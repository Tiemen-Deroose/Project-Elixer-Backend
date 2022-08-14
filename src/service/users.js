const config = require('config');
const uuid = require('uuid');
const data = require('../data');
const ServiceError = require('../core/serviceError');
const { hashPassword, verifyPassword } = require('../core/password');
const collections = data.collections;
const roles = require('../core/roles');
const { generateJWT, verifyJWT } = require('../core/jwt');

const { limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET } = config.get('pagination');

const { getChildLogger } = require('../core/logging');
const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('users-service');
  this.logger.debug(message, meta);
};

const makeExposedUser = ({ password, ...user }) => user; // eslint-disable-line no-unused-vars

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    token,
    user: makeExposedUser(user),
  };
};

async function checkAndParseSession(authHeader) {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
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
    getChildLogger('users-service').error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }
}

function checkRole(role, roles) {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
}

async function login(email, password) {
  debugLog(`Logging in user with email: ${email}`);
  const user = await getByEmail(email);

  if (!user)
    throw ServiceError.unauthorized('The given email and password do not match');

  const passwordValid = await verifyPassword(password, user.password);

  if (!passwordValid)
    throw ServiceError.unauthorized('The given email and password do not match');

  debugLog(`Successfully logged in user with email: ${email}`);
  return await makeLoginData(user);
}

async function register({ username, email, password }) {
  debugLog(`Registering new user with email: ${email}`);
  const createdUser = {
    _id: uuid.v4(),
    username,
    email,
    password: await hashPassword(password),
    roles: [roles.USER],
    favourites: [],
  };

  if (await getByEmail(email)) {
    throw ServiceError.validationFailed('The given email is already in use');
  }

  const dbConnection = await data.getConnection();
  await dbConnection.collection(collections.users).insertOne(createdUser);

  debugLog(`Succesfully registered new user with email: ${email}`);
  return await makeLoginData(createdUser);
}

async function getAll(limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) {
  debugLog(`Getting all users with limit: ${limit} and offset: ${offset}`);
  const dbConnection = await data.getConnection();
  const response = (await dbConnection.collection(collections.users).find().skip(offset).limit(limit).toArray())
    .map((user) => makeExposedUser(user));

  return {
    data: response,
    count: response.length,
    limit,
    offset,
  };
}

async function getById(_id) {
  debugLog(`Getting user with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const requestedUser = await dbConnection.collection(collections.users).findOne({ _id });

  if (!requestedUser)
    throw ServiceError.notFound(`Could not find user with id: ${_id}`);

  debugLog(`Found user with id: ${_id}`);
  return makeExposedUser(requestedUser);
}

async function getByEmail(email) {
  debugLog(`Getting user with email: ${email}`);
  const dbConnection = await data.getConnection();
  const requestedUser = await dbConnection.collection(collections.users).findOne({ 'email': email });

  debugLog(`${requestedUser ? 'Found' : 'Could not find'} user with email: ${email}`);
  return requestedUser;
}

async function updateById(_id, { username, email, password, roles, favourites }) {
  const updatedUser = {
    username,
    email,
    password: await hashPassword(password),
    roles,
    favourites,
  };

  debugLog(`Updating user with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const found = (await dbConnection.collection(collections.users).updateOne({ _id }, { $set: updatedUser }))
    .modifiedCount;

  if (!found)
    throw ServiceError.notFound(`Could not find user with id: ${_id}`);

  return { _id, ...makeExposedUser(updatedUser) };
}

async function addFavourite(userId, { itemId }) {
  debugLog(`Adding favourite '${itemId}' to user: ${userId}`);
  const dbConnection = await data.getConnection();
  const found = (await dbConnection.collection(collections.users).updateOne(
    { _id: userId },
    { $push: { favourites: itemId } },
  )).modifiedCount;

  if (!found)
    throw ServiceError.notFound(`Could not find user with id: ${userId}`);
}

async function removeFavourite(userId, { itemId }) {
  debugLog(`Removing favourite '${itemId}' from user: ${userId}`);
  const dbConnection = await data.getConnection();
  const found = (await dbConnection.collection(collections.users).updateOne(
    { _id: userId },
    { $pull: { favourites: itemId } },
  )).modifiedCount;

  if (!found)
    throw ServiceError.notFound(`Could not find user with id: ${userId}`);
}

async function deleteById(_id) {
  debugLog(`Deleting user with id: ${_id}`);
  const dbConnection = await data.getConnection();
  const deleted = (await dbConnection.collection(collections.users).deleteOne({ _id })).deletedCount;

  if (!deleted)
    throw ServiceError.notFound(`Could not find user with id: ${_id}`);

  debugLog(`Deleted user with id: ${_id}`);

  return deleted;
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
  addFavourite,
  removeFavourite,
  deleteById,
};