module.exports = {
  logger: {
    silent: false,
  },

  directories: {
    images: {
      art: './images/art/',
      jewelry: './images/jewelry/',
    },
  },

  cors: {
    origins: ['http://localhost:3000'],
    maxAge: 3 * 60 * 60,
  },

  pagination: {
    limit: 100,
    offset: 0,
  },

  validation: {
    abortEarly: true,
    allowUnknown: false,
    context: true,
    convert: true,
    presence: 'required',
  },

  database: {
    client: 'mongodb',
    host: 'localhost',
    port: '27017',
    name: 'elixer',
    username: 'root',
    password: '',
  },

  mongodb: {
    migration: {
      options: { useNewUrlParser: true },
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
      secret: '',
      expirationInterval: 60 * 60 * 1000,
      issuer: 'elixer.hogent.be',
      audience: 'elixer.hogent.be',
    },
  },
};