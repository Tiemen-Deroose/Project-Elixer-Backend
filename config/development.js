module.exports = {
  logger: {
    level: 'debug',
  },

  mongodb: {
    seeding: {
      path: './src/data/seeds',
      dropDatabase: true,
    },
  },
};