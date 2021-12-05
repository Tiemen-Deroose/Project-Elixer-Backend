const uuid = require('uuid');

const database = require('../data');
const collections = database.collections;

const { getChildLogger } = require('../core/logging');
const logger = getChildLogger('art-service');

function checkAttributes(action, title, material, medium, size, image_url, price) {
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
  const response = await database.getAll(collections.art);

  return {
    data: response,
    count: response.length,
  };
}
async function getById(id) {
  const requestedArt = database.getById(collections.art, id);

  return requestedArt;
}
async function create({
  title,
  material,
  medium,
  size,
  image_url,
  price,
}) {
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

  database.create(collections.art, createdArt);
  return createdArt;
}
async function updateById(id, {
  title,
  material,
  medium,
  size,
  image_url,
  price,
}) {
  if (!checkAttributes('update', title, material, medium, size, image_url, price))
    return null;

  const updatedArt = database.updateById(collections.art, id, {
    title,
    material,
    medium,
    size,
    image_url,
    price,
  });

  return updatedArt ?? null;
}
const deleteById = (id) => {
  const artToDelete = database.deleteById(collections.art, id);

  return artToDelete ?? null;
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};