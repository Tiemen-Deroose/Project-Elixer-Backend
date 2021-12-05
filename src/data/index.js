const config = require('config');
const mongoClient = require('mongodb').MongoClient;

const {
  getChildLogger,
} = require('../core/logging');
let logger;

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_URL = config.get('mongodb.database_url');
const DATABASE_NAME = config.get('mongodb.database_name');

const artSeed = require('./seeds/202111271520_art');
const jewelrySeed = require('./seeds/202111271530_jewelry');

async function initializeDatabase() {
  logger = getChildLogger('database');
  logger.info('Testing connection to the database');

  // Check connection, also creates the database
  mongoClient.connect(DATABASE_URL, function (err, client) {
    if (err) {
      logger.error(`Could not connect to the database: ${err}`);
      throw err;
    }

    client.close();
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

async function connect() {

  const client = await mongoClient.connect(DATABASE_URL);
  const database = client.db(DATABASE_NAME);

  return {client, database};
}

async function getAll(collectionName) {

  const {client, database} = await connect();

  const foundCollection = await database.collection(collectionName).find().toArray();

  client.close();
  return foundCollection;
}

async function getById(collectionName, id) {

  const {client, database} = await connect();

  const query = {
    _id: id,
  };
  const foundObject = await database.collection(collectionName).find(query).toArray();

  client.close();
  return foundObject[0];
}

async function updateById(collectionName, id, object) {

  const {client, database} = await connect();

  const query = {
    _id: id,
  };
  const newValues = {
    $set: object,
  };

  await database.collection(collectionName).updateOne(query, newValues);
  const newObject = await database.collection(collectionName).find(query).toArray();

  client.close();
  return newObject[0];
}

async function deleteById(collectionName, id) {

  const {client, database} = await connect();

  const query = {
    _id: id,
  };

  const deletedObject = await database.collection(collectionName).find(query).toArray();
  await database.collection(collectionName).deleteOne(query);

  client.close();
  return deletedObject[0];
}

async function create(collectionName, object) {

  const {client, database} = await connect();

  await database.collection(collectionName).insertOne(object);

  client.close();
}

const collections = Object.freeze({
  art: 'art',
  jewelry: 'jewelry',
});

module.exports = {
  collections,
  initializeDatabase,
  getAll,
  getById,
  updateById,
  deleteById,
  create,
};