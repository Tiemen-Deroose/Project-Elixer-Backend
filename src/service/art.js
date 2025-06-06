const config = require('config');
const uuid = require('uuid');
const data = require('../data');
const ServiceError = require('../core/serviceError');
const collections = data.collections;

const { limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET } = config.get('pagination');

const { getChildLogger } = require('../core/logging');
const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('art-service');
  this.logger.debug(message, meta);
};

async function getAll(limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) {
  debugLog(`Getting all art with limit: ${limit} and offset: ${offset}`);
  const dbConnection = await data.getConnection();
  const response = await dbConnection.collection(collections.art).find().skip(offset).limit(limit).toArray();

  return {
    data: response,
    count: response.length,
    limit,
    offset,
  };
}

async function getById(_id) {
  debugLog(`Getting art with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const requestedArt = await dbConnection.collection(collections.art).findOne({ _id });

  if (!requestedArt)
    throw ServiceError.notFound(`Could not find art with id: ${_id}`);
  
  return requestedArt;
}

async function create({ title, material, medium, size, image_url, price }) {
  const createdArt = {
    _id: uuid.v4(),
    title,
    material,
    medium,
    size,
    image_url,
    price,
  };

  debugLog(`Inserting new art with id: ${createdArt._id}`);
  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.art).insertOne(createdArt);

  return createdArt;
}

async function updateById(_id, { title, material, medium, size, image_url, price }) {
  const updatedArt = {
    title,
    material,
    medium,
    size,
    image_url,
    price,
  };

  debugLog(`Updating art with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const found = (await dbConnection.collection(collections.art).updateOne({ _id }, { $set: updatedArt }))
    .modifiedCount;

  if (!found)
    throw ServiceError.notFound(`Could not find art with id: ${_id}`);

  return { _id, ...updatedArt };
}

async function deleteById(_id) {
  debugLog(`Deleting art with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const deleted = (await dbConnection.collection(collections.art).deleteOne({ _id })).deletedCount;

  if (!deleted)
    throw ServiceError.notFound(`Could not find art with id: ${_id}`);

  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};