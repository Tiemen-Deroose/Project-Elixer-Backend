const config = require('config');
const {
  MongoClient,
  MongoNotConnectedError,
} = require('mongodb');

const {
  getChildLogger,
} = require('../core/logging');
let logger;

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_URL = config.get('mongodb.database_url');
const DATABASE_NAME = config.get('mongodb.database_name');
const DATABASE_CONNECTIONSTRING = `${DATABASE_URL}${DATABASE_NAME}`;

const artSeed = require('./seeds/202111271520_art');
const jewelrySeed = require('./seeds/202111271530_jewelry');

let client;
let database;

async function initializeData() {
  logger = getChildLogger('database');
  logger.info('Testing connection to the database');

  // Test connection, also creates the database
  MongoClient.connect(DATABASE_CONNECTIONSTRING, function (err, dbClient) {
    if (err) {
      logger.error(`Could not connect to the database: ${err}`);
      throw err;
    }

    client = dbClient;
    database = dbClient.db(DATABASE_NAME);
  });


  // Seed the database if we are in development
  if (isDevelopment) {
    try {
      await artSeed.seed();
      await jewelrySeed.seed();
    } catch (err) {
      logger.error(`Error while seeding the database: ${err}`);
      throw err;
    }
  }

  logger.info('Succesfully connected to the database');
}

async function shutdownData() {

  (await getConnection()).client.close();
  logger.info('Database connection has been succesfully shut down');
}

async function connect() {

  client = await MongoClient.connect(DATABASE_CONNECTIONSTRING);
  database = client.db(DATABASE_NAME);

  if (!client || !database) { // if we didn't get a connection, throw an error
    logger.error('Could not connect to the database');
    throw MongoNotConnectedError;
  }

  console.log('reconnect');

  return {
    client,
    database,
  };
}

// function to reconnect if the connection was lost
async function getConnection() {

  if (!client || !database)
    await connect();

  return {
    client,
    database,
  };
}

async function getAll(collectionName) {

  const {
    database,
  } = await getConnection();

  const foundCollection = await database.collection(collectionName).find().toArray();

  return foundCollection;
}

async function getById(collectionName, id) {

  const {
    database,
  } = await getConnection();

  const query = {
    _id: id,
  };
  const foundObject = await database.collection(collectionName).find(query).toArray();

  return foundObject[0];
}

async function updateById(collectionName, id, object) {

  const {
    database,
  } = await getConnection();

  const query = {
    _id: id,
  };
  const newValues = {
    $set: object,
  };

  await database.collection(collectionName).updateOne(query, newValues);
  const newObject = await database.collection(collectionName).find(query).toArray();

  return newObject[0];
}

async function deleteById(collectionName, id) {

  const {
    database,
  } = await getConnection();

  const query = {
    _id: id,
  };

  const deletedObject = await database.collection(collectionName).find(query).toArray();
  await database.collection(collectionName).deleteOne(query);

  return deletedObject[0];
}

async function create(collectionName, object) {

  const {
    database,
  } = await getConnection();

  await database.collection(collectionName).insertOne(object);
}

const collections = Object.freeze({
  art: 'art',
  jewelry: 'jewelry',
});

module.exports = {
  collections,
  initializeData,
  shutdownData,
  getAll,
  getById,
  updateById,
  deleteById,
  create,
};