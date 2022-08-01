const config = require('config');
const uuid = require('uuid');
const mime = require('mime-types');
const fs = require('fs');
const data = require('../data');
const collections = data.collections;

const { limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET } = config.get('pagination');

const { getChildLogger } = require('../core/logging');
let loggerInstance;
function Logger() {
  if (!loggerInstance) loggerInstance = getChildLogger('art-service');
  return loggerInstance;
}

async function getAll(limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) {
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
  const dbConnection = await data.getConnection();
  const requestedJewelry = await dbConnection.collection(collections.jewelry).findOne({_id});

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

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.jewelry).updateOne({_id}, {$set: updatedJewelry});

  return { _id, ...updatedJewelry };
}

async function deleteById(_id) {
  const dbConnection = await data.getConnection();
  const jewelryToDelete = await dbConnection.collection(collections.jewelry).findOne({_id});
  await dbConnection.collection(collections.jewelry).deleteOne({_id});

  return jewelryToDelete;
}

async function getImageByPath(path) {
  var mimeType = mime.lookup(path);
  const src = fs.createReadStream(path);
  
  return { src, mimeType };
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getImageByPath,
};