const config = require('config');
const { up, down, config: migrationConfig } = require('migrate-mongo');
const { Seeder } = require('mongo-seeding');
const {
  MongoClient,
  MongoNotConnectedError,
} = require('mongodb');
const {
  getChildLogger,
} = require('../core/logging');
const path = require('path');

let logger;

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_URL = config.get('mongodb.database_url');
const DATABASE_NAME = config.get('mongodb.database_name');
const DATABASE_CONNECTIONSTRING = `${DATABASE_URL}${DATABASE_NAME}`;

const MIGRATION_CONFIG = config.get('mongodb.migration');

const { path: SEEDING_PATH, dropDatabase: SEEDING_DROPDATABASE } = config.get('mongodb.seeding');

let client;
let database;

async function initializeData() {
  logger = getChildLogger('data');
  logger.info('Testing connection to the database');

  // Test connection, also creates the database
  client = await MongoClient.connect(DATABASE_CONNECTIONSTRING);
  if (!client) {
    logger.error('Could not connect to the database');
    throw MongoNotConnectedError;
  }
  database = client?.db(DATABASE_NAME);

  let migrationsFailed = true;
  migrationConfig.set(MIGRATION_CONFIG);

  try {
    logger.info('Migrating the database');
    await up(database);
    migrationsFailed = false;
  } catch (error) {
    logger.error(`Error while migrating the database: ${error}`);
  }

  if (migrationsFailed) {
    try {
      await down(database);
    } catch (error) {
      logger.error(`Error while undoing last migration: ${error}`);
    }

    throw new Error('Migrations failed');
  }

  // Seed the database if we are in development
  if (isDevelopment) {
    logger.info('Seeding the database');

    try {
      const seeder = new Seeder({database: DATABASE_CONNECTIONSTRING, dropDatabase: SEEDING_DROPDATABASE});
      const collections = seeder.readCollectionsFromPath(path.resolve(SEEDING_PATH));
      await seeder.import(collections);
    } catch (err) {
      logger.error(`Error while seeding the database: ${err}`);
      throw err;
    }
  }

  logger.info('Succesfully connected to the database');
}

async function shutdownData() {

  client.close();
  logger.info('Database connection has been succesfully shut down');
}

async function connect() {

  client = await MongoClient.connect(DATABASE_CONNECTIONSTRING).client;
  database = database.db(DATABASE_NAME);

  if (!database) { // if we didn't get a connection, throw an error
    logger.error('Could not connect to the database');
    throw MongoNotConnectedError;
  }

  return database;
}

// function to reconnect if the connection was lost
async function getConnection() {

  if (!database)
    await connect();

  return database;
}

const collections = Object.freeze({
  art: 'art',
  jewelry: 'jewelry',
  users: 'users',
});

module.exports = {
  collections,
  getConnection,
  initializeData,
  shutdownData,
};