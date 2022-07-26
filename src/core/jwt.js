const config = require('config');
const jwt = require('jsonwebtoken');
const { getLogger: logger } = require('./logging');

const { 
  audience: JWT_AUDIENCE, 
  issuer : JWT_ISSUER, 
  secret : JWT_SECRET,
  expirationInterval : JWT_EXPIRATION_INTERVAL,
} = config.get('auth.jwt');

module.exports.generateJWT = (user) => {
  const tokenData = {
    userId: user._id,
    roles: user.roles,
  };

  const signOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
  };

  return new Promise((resolve, reject) => {
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err) {
        logger.error('Error while signing new token', { error: err?.message });
        return reject(err);
      }
      return resolve(token);
    });
  });
};

module.exports.verifyJWT = (authToken) => {
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  };

  return new Promise((resolve) => {
    jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
      if (err || !decodedToken) {
        logger.error('Error while verifying token', { error: err?.message });
      }

      return resolve(decodedToken);
    });
  });
};