module.exports = {
  logger: {
    silent: false,
  },

  mongodb: {
    seeding: {
      path: './src/data/seeds',
      dropDatabase: true,
    },
  },
};