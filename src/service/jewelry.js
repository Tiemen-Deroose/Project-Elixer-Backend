const config = require('config');
const uuid = require('uuid');
const data = require('../data');
const ServiceError = require('../core/serviceError');
const collections = data.collections;

const { limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET } = config.get('pagination');

const { getChildLogger } = require('../core/logging');
const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('jewelry-service');
  this.logger.debug(message, meta);
};

async function getAll(limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) {
  debugLog(`Getting all jewelry with limit: ${limit} and offset: ${offset}`);
  const dbConnection = await data.getConnection();
  const response = await dbConnection.collection(collections.jewelry).find().skip(offset).limit(limit).toArray();

  return {
    data: response,
    count: response.length,
    limit,
    offset,
  };
}

async function getById(_id) {
  debugLog(`Getting jewelry with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const requestedJewelry = await dbConnection.collection(collections.jewelry).findOne({ _id });

  if (!requestedJewelry)
    throw ServiceError.notFound(`Could not find jewelry with id: ${_id}`);

  return requestedJewelry;
}

async function create({ name, category, material, colour, image_url, price }) {
  const createdJewelry = {
    _id: uuid.v4(),
    name: name,
    category,
    material,
    colour,
    image_url,
    price,
  };

  debugLog(`Inserting new jewelry with id: ${createdJewelry._id}`);
  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.jewelry).insertOne(createdJewelry);

  return createdJewelry;
}

async function updateById(_id, { name, category, material, colour, image_url, price }) {
  const updatedJewelry = {
    name,
    category,
    material,
    colour,
    image_url,
    price,
  };

  debugLog(`Updating jewelry with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const found = (await dbConnection.collection(collections.jewelry).updateOne({ _id }, { $set: updatedJewelry }))
    .modifiedCount;

  if (!found)
    throw ServiceError.notFound(`Could not find jewelry with id: ${_id}`);

  return { _id, ...updatedJewelry };
}

async function deleteById(_id) {
  debugLog(`Deleting jewelry with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const deleted = (await dbConnection.collection(collections.jewelry).deleteOne({ _id })).deletedCount;

  if (!deleted)
    throw ServiceError.notFound(`Could not find jewelry with id: ${_id}`);

  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};