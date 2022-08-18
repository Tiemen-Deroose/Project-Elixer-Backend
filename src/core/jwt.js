const config = require('config');
const jwt = require('jsonwebtoken');
const ServiceError = require('./serviceError');

const {
  audience: JWT_AUDIENCE,
  issuer: JWT_ISSUER,
  secret: JWT_SECRET,
  expirationInterval: JWT_EXPIRATION_INTERVAL,
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
    jwt.sign(
      tokenData, JWT_SECRET, signOptions, (err, token) => {
        if (err)
          return reject(err);
        return resolve(token);
      },
    );
  });
};

module.exports.verifyJWT = (authToken) => {
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  };

  return new Promise((resolve, reject) => {
    jwt.verify(
      authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
        if (err || !decodedToken)
          return reject(err || ServiceError.unauthorized('Token could not be parsed'));
        return resolve(decodedToken);
      },
    );
  });
};