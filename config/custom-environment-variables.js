module.exports = {
  env: 'NODE_ENV',
  database: {
    client: 'DATABASE_CLIENT',
    name: 'DATABASE_NAME',
    host: 'DATABASE_HOST',
    port: 'DATABASE_PORT',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
  },
  auth: {
    jwt: {
      secret: 'JWT_SECRET',
    },
  },
};