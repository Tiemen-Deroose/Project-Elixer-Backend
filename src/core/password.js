const config = require('config');
const argon2 = require('argon2');

const ARGON_SALT_LENGTH = config.get('auth.argon.saltLength');
const ARGON_HASH_LENGTH = config.get('auth.argon.saltLength');
const ARGON_TIME_COST = config.get('auth.argon.timeCost');
const ARGON_MEMORY_COST = config.get('auth.argon.memoryCost');

module.exports.hashPassword = async (password) => {
  return argon2.hash(password, {
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
    type: argon2.argon2id,
  });
};

module.exports.verifyPassword = async (password, passwordHash) => {
  return argon2.verify(passwordHash, password, {
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
    type: argon2.argon2id,
  });
};