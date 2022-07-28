const createServer = require('../src/createServer');
const { getConnection } = require('../src/data');
const supertest = require('supertest');

module.exports.withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    setter({
      request: supertest(server.getApp().callback()),
      db: await getConnection(),
    });
  });
  
  afterAll(async () => {
    await server.stop();
  });
};

module.exports.loginUser = async (supertest) => {
  const response = await supertest.post('/api/users/login')
    .send({
      email: 'test.user@domain.com',
      password: '123',
    });
  
  if (response.statusCode != 200)
    throw new Error(response.body.message || 'Unknown error occurred');

  return `Bearer ${response.body.token}`;
};

module.exports.loginAdmin = async (supertest) => {
  const response = await supertest.post('/api/users/login')
    .send({
      email: 'test.admin@domain.com',
      password: '123',
    });
    
  if (response.statusCode != 200)
    throw new Error(response.body.message || 'Unknown error occurred');
  
  return `Bearer ${response.body.token}`;
};