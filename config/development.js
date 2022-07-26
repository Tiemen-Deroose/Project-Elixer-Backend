module.exports = {
  logger: {
    silent: false,
  },

  cors: {
    origins: ['http://localhost:3000'],
    maxAge: 3 * 60 * 60,
  },

  mongodb: {
    database_name: 'elixer',
    database_url: 'mongodb://localhost:27017/',

    migration: {
      mongodb: {
        url: 'mongodb://localhost:27017/',
        options: { useNewUrlParser: true },
      },

      migrationsDir: 'src/data/migrations',
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.js',
    },

    seeding: {
      path: './src/data/seeds',
      dropDatabase: true,
    },
  },
};