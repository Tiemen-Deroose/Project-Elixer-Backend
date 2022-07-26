module.exports = {
  logger: {
    silent: true,
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

    seeding: {},
  },

  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: 'h9VAbGyVikC2eGUFF8OI1twkkxbKAXA1iN86oBmQi6QMyPOXr3RgiNY6ZmZWqUTOHdTvBn6PRPVHM2SdWQyxRSRpwYg6wjvlq7XkVi6fQ7rhWjNQ7rv4IC3SMHpFtrXYngnwkGWx1Af2',
      expirationInterval: 60 * 60 * 1000,
      issuer: 'elixer.hogent.be',
      audience: 'elixer.hogent.be',
    },
  },
};