const uuid = require('uuid');
const data = require('../data');
const { hashPassword, verifyPassword } = require('../core/password');
const collections = data.collections;
const roles = require('../core/roles');
const { generateJWT, verifyJWT } = require('../core/jwt');

const { getChildLogger } = require('../core/logging');
let loggerInstance;
function Logger() {
  if (!loggerInstance) loggerInstance = getChildLogger('art-service');
  return loggerInstance;
}

const makeExposedUser = ({ password, ...user}) => user; // eslint-disable-line no-unused-vars

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    token,
    user: makeExposedUser(user),
  };
};

async function checkAndParseSession(authHeader) {
  if (!authHeader) {
    throw new Error('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authentication token');
  }

  const authToken = authHeader.substr(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    Logger().error(error.message, { error });
    throw new Error(error.message);
  }
}

function checkRole(role, roles) {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw new Error('You are not allowed to view this part of the application');
  }
}

async function login(email, password) {
  const user = await getByEmail(email);

  if (!user)
    throw new Error('The given email and password do not match');

  const passwordValid = await verifyPassword(password, user.password);

  if (!passwordValid)
    throw new Error('The given email and password do not match');

  return await makeLoginData(user);
}

async function register({ username, email, password }) {
  const createdUser = {
    _id: uuid.v4(),
    username,
    email,
    password: await hashPassword(password),
    roles: [roles.USER],
  };

  if (await getByEmail(email)) {
    throw new Error('The given email is already in use');
  }

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.users).insertOne(createdUser);

  return await makeLoginData(createdUser);
}

async function getAll() {
  const dbConnection = await data.getConnection();
  const response = (await dbConnection.collection(collections.users).find().toArray())
    .map((user) => makeExposedUser(user));

  return {
    data: response,
    count: response.length,
  };
}

async function getById(_id) {
  const dbConnection = await data.getConnection();
  const requestedUser = await dbConnection.collection(collections.users).findOne({_id});

  return makeExposedUser(requestedUser);
}

async function getByEmail(email) {
  const dbConnection = await data.getConnection();
  const requestedUser = await dbConnection.collection(collections.users).findOne({'email': email});

  return requestedUser;
}

async function updateById(_id, { username, email, password, roles}) {
  const updatedUser = {
    username,
    email,
    password: await hashPassword(password),
    roles: roles,
  };

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.users).updateOne({_id}, {$set: updatedUser});

  return { _id, ...makeExposedUser(updatedUser) };
}

async function deleteById(_id) {
  const dbConnection = await data.getConnection();
  const userToDelete = await dbConnection.collection(collections.users).findOne({_id});
  await dbConnection.collection(collections.users).deleteOne({_id});

  return makeExposedUser(userToDelete);
}

module.exports = {
  checkAndParseSession,
  checkRole,
  login,
  register,
  getAll,
  getById,
  getByEmail,
  updateById,
  deleteById,
};