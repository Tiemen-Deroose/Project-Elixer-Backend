const uuid = require('uuid');
const mime = require('mime-types');
const fs = require('fs');

const data = require('../data');
const collections = data.collections;

const { getChildLogger } = require('../core/logging');
let loggerInstance;
function Logger() {
  if (!loggerInstance) loggerInstance = getChildLogger('art-service');
  return loggerInstance;
}

function checkAttributes(action, name, category, material, colour, image_url, price) {
  const stringAttributes = [name, category, material, colour, image_url];
  let isCorrect = true;

  var counter = 0;
  stringAttributes.forEach((attribute) => {
    counter++;
    if (typeof attribute !== 'string' || !attribute) {
      Logger().error(
        `Could not ${action} jewelry: expected string, but got ${typeof attribute} '${attribute}', arg ${counter}`,
      );
      isCorrect = false;
    }
  });

  if (typeof price !== 'number') {
    Logger().error(
      `Could not ${action} jewelry: attribute 'price' must be a number`,
    );
    isCorrect = false;
  }

  return isCorrect;
}

async function getAll() {
  const dbConnection = await data.getConnection();
  const response = await dbConnection.collection(collections.jewelry).find().toArray();

  return {
    data: response,
    count: response.length,
  };
}

async function getById(_id) {
  const dbConnection = await data.getConnection();
  const requestedJewelry = await dbConnection.collection(collections.jewelry).findOne({_id});

  return requestedJewelry;
}

async function create({ name, category, material, colour, image_url, price }) {
  if (!checkAttributes('create', name, category, material, colour, image_url, price))
    return null;

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
  if (!checkAttributes('update', name, category, material, colour, image_url, price))
    return null;

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