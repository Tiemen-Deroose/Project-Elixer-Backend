module.exports = {
  env: 'NODE_ENV',
  database: {
    name: 'DATABASE_NAME',
    url: 'DATABASE_URL',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
  },
  auth: {
    jwt: {
      secret: 'JWT_SECRET',
    },
  },
};