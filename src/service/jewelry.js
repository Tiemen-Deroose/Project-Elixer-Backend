const uuid = require('uuid');
const mime = require('mime-types');
const fs = require('fs');

const database = require('../data');
const collections = database.collections;

const { getChildLogger } = require('../core/logging');
let logger;

function createLogger() {
  if (!logger)
    logger = getChildLogger('art-service');
}

function checkAttributes(action, name, category, material, colour, image_url, price) {
  const stringAttributes = [name, category, material, colour, image_url];
  let isCorrect = true;

  var counter = 0;
  stringAttributes.forEach((attribute) => {
    counter++;
    if (typeof attribute !== 'string' || !attribute) {
      logger.error(
        `Could not ${action} jewelry: expected string, but got ${typeof attribute} '${attribute}', arg ${counter}`,
      );
      isCorrect = false;
    }
  });

  if (typeof price !== 'number') {
    logger.error(
      `Could not ${action} jewelry: attribute 'price' must be a number`,
    );
    isCorrect = false;
  }

  return isCorrect;
}

async function getAll() {
  createLogger();

  const response = await database.getAll(collections.jewelry);

  return {
    data: response,
    count: response.length,
  };
}
async function getById(id) {
  createLogger();

  const requestedJewelry = database.getById(collections.jewelry, id);

  return requestedJewelry;
}
async function create({
  name,
  category,
  material,
  colour,
  image_url,
  price,
}) {
  createLogger();

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

  database.create(collections.jewelry, createdJewelry);
  return createdJewelry;
}
async function updateById(id, {
  name,
  category,
  material,
  colour,
  image_url,
  price,
}) {
  createLogger();

  if (!checkAttributes('update', name, category, material, colour, image_url, price))
    return null;

  const updatedJewelry = database.updateById(collections.jewelry, id, {
    name,
    category,
    material,
    colour,
    image_url,
    price,
  });

  return updatedJewelry;
}
async function deleteById(id) {
  createLogger();

  const jewelryToDelete = database.deleteById(collections.jewelry, id);

  return jewelryToDelete;
}
const getImageByPath = (path) => {
  createLogger();

  var mimeType = mime.lookup(path);
  const src = fs.createReadStream(path);
  
  return { src, mimeType };
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getImageByPath,
};