const uuid = require('uuid');
const data = require('../data');
const collections = data.collections;

async function getAll() {
  const dbConnection = await data.getConnection();
  const response = await dbConnection.collection(collections.user).find().toArray();

  return {
    data: response,
    count: response.length,
  };
}

async function getById(_id) {
  const dbConnection = await data.getConnection();
  const requestedUser = await dbConnection.collection(collections.user).findOne({_id});

  return requestedUser;
}

async function create({ username, email }) {
  const createdUser = {
    _id: uuid.v4(),
    username,
    email,
  };

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.user).insertOne(createdUser);

  return createdUser;
}

async function updateById(_id, { username, email }) {
  const updatedUser = {
    username,
    email,
  };

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.user).updateOne({_id}, {$set: updatedUser});

  return { _id, ...updatedUser};
}

async function deleteById(_id) {
  const dbConnection = await data.getConnection();
  const userToDelete = await dbConnection.collection(collections.user).findOne({_id});
  await dbConnection.collection(collections.user).deleteOne({_id});

  return userToDelete;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};