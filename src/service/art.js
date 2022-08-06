const uuid = require('uuid');
const data = require('../data');
const collections = data.collections;

const { getChildLogger } = require('../core/logging');
let logger;

function createLogger() {
  if (!logger)
    logger = getChildLogger('art-service');
}

function checkAttributes(action, title, material, medium, size, image_url, price) {
  createLogger();

  const stringAttributes = [title, material, medium, size, image_url];
  let isCorrect = true;

  var counter = 0;
  stringAttributes.forEach((attribute) => {
    counter++;
    if (typeof attribute !== 'string') {
      logger.error(
        `Could not ${action} art: expected string, but got ${typeof attribute} '${attribute}', arg ${counter}`,
      );
      isCorrect = false;
    }
  });

  if (typeof price !== 'number') {
    logger.error(
      `Could not ${action} art: attribute 'price' must be a number`,
    );
    isCorrect = false;
  }

  return isCorrect;
}

async function getAll() {
  const dbConnection = await data.getConnection();
  const response = await dbConnection.collection(collections.art).find().toArray();

  return {
    data: response,
    count: response.length,
  };
}

async function getById(_id) {
  const dbConnection = await data.getConnection();
  const requestedArt = await dbConnection.collection(collections.art).findOne({_id});

  return requestedArt;
}

async function create({ title, material, medium, size, image_url, price }) {
  if (!checkAttributes('create', title, material, medium, size, image_url, price))
    return null;

  const createdArt = {
    _id: uuid.v4(),
    title,
    material,
    medium,
    size,
    image_url,
    price,
  };

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.art).insertOne(createdArt);

  return createdArt;
}

async function updateById(_id, { title, material, medium, size, image_url, price }) {
  if (!checkAttributes('update', title, material, medium, size, image_url, price))
    return null;

  const updatedArt = {
    title,
    material,
    medium,
    size,
    image_url,
    price,
  };

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.art).updateOne({_id}, {$set: updatedArt});

  return { _id, ...updatedArt};
}

async function deleteById(_id) {
  const dbConnection = await data.getConnection();
  const artToDelete = await dbConnection.collection(collections.art).findOne({_id});
  await dbConnection.collection(collections.art).deleteOne({_id});

  return artToDelete;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};