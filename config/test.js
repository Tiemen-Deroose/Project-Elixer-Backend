module.exports = {
  logger: {
    silent: true,
  },
  
  cors: {
    origins: ['http://localhost:3000'],
    maxAge: 3 * 60 * 60,
  },
  
  mongodb: {
    database_name: 'elixer_test',
    database_url: 'mongodb://localhost:27017/',
  },
};