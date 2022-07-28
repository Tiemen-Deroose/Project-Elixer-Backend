const { initializeLogger } = require('../src/core/logging');
const { initializeData, getConnection, collections } = require('../src/data');
const Role = require('../src/core/roles');

module.exports = async () => {
  initializeLogger();

  await initializeData();

  const db = await getConnection();

  await db.collection(collections.users).insertMany([
    {
      _id: '740142ce-1a4c-4ce9-b1d2-fcfa195bf4e2',
      username: 'test user',
      email: 'test.user@domain.com',
      password: '$argon2id$v=19$m=131072,t=6,p=1$xUtJgbdN09lCVj1tEfl7tQ$bp23otHNsvgQ9EfvzOcmsg', // 123
      roles: [
        Role.USER,
      ],
    },
    {
      _id: '740142ce-1a4c-4ce9-b1d2-fcfa195bf4e3',
      username: 'test admin',
      email: 'test.admin@domain.com',
      password: '$argon2id$v=19$m=131072,t=6,p=1$xUtJgbdN09lCVj1tEfl7tQ$bp23otHNsvgQ9EfvzOcmsg', // 123
      roles: [
        Role.USER, 
        Role.ADMIN,
      ],
    },
  ]);
};