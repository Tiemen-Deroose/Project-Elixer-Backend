const { collections } = require('../../src/data');
const { withServer, loginAdmin } = require('../supertest.setup');

const dataNoId = ({ _id, ...object }) => object; // eslint-disable-line no-unused-vars

const art_data = [{
  _id: 'f064a797-99fa-4ec0-9454-ba14838f5df4',
  title: 'Sunlight',
  material: 'canvas',
  medium: 'resin',
  size: 'large',
  image_url: 'http://localhost:9000/api/art/images/sunlight.jpg',
  price: 209.99,
},
{
  _id: '9ee5fb36-1ff5-4588-b888-fade80b88d05',
  title: 'Autumn Tree',
  material: 'canvas',
  medium: 'acrylic paint',
  size: 'medium',
  image_url: 'http://localhost:9000/api/art/images/autumn_tree.jpg',
  price: 59.99,
}];

describe('Art', () => {
  let request;
  let database;
  let loginHeader;

  withServer(({ request: r, db }) => {
    request = r;
    database = db;
  });

  beforeAll(async () => {
    loginHeader = await loginAdmin(request);
  });

  const url = '/api/art';

  describe('GET /api/art', () => {

    beforeAll(async () => {
      await database.collection(collections.art).insertMany(art_data);
    });

    afterAll(async () => {
      await database.collection(collections.art).deleteMany();
    });

    test('it should have code 200 and return all art', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.count).toEqual(art_data.length);
      expect(response.body.data).toEqual(expect.arrayContaining(art_data));
    });
  });

  describe('GET /api/art/:id', () => {

    beforeAll(async () => {
      await database.collection(collections.art).insertOne(art_data[0]);
    });

    afterAll(async () => {
      await database.collection(collections.art).deleteMany();
    });

    test('it should have code 200 and return the requested art', async () => {
      const response = await request.get(`${url}/${art_data[0]._id}`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(art_data[0]);
    });
  });

  describe('POST /api/art', () => {

    afterAll(async () => {
      await database.collection(collections.art).deleteMany({});
    });

    test('it should have code 201 and return the created art', async () => {
      const response = await request.post(url).send(dataNoId(art_data[0])).set('Authorization', loginHeader);

      expect(response.status).toBe(201);
      expect(response.body._id).toBeTruthy();
      expect(response.body.title).toEqual(art_data[0].title);
      expect(response.body.material).toEqual(art_data[0].material);
      expect(response.body.medium).toEqual(art_data[0].medium);
      expect(response.body.size).toEqual(art_data[0].size);
      expect(response.body.price).toEqual(art_data[0].price);
      expect(response.body.image_url).toEqual(art_data[0].image_url);
    });
  });

  describe('PUT /api/art/:id', () => {
    beforeAll(async () => {
      await database.collection(collections.art).insertOne(art_data[0]);
    });

    afterAll(async () => {
      await database.collection(collections.art).deleteMany();
    });

    test('it should have code 200 and update art', async () => {
      const response = await request.put(`${url}/${art_data[0]._id}`).send(dataNoId(art_data[1])).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body._id).toBeTruthy();
      expect(response.body.title).toEqual(art_data[1].title);
      expect(response.body.material).toEqual(art_data[1].material);
      expect(response.body.medium).toEqual(art_data[1].medium);
      expect(response.body.size).toEqual(art_data[1].size);
      expect(response.body.price).toEqual(art_data[1].price);
      expect(response.body.image_url).toEqual(art_data[1].image_url);
    });
  });

  describe('DELETE /api/art/:id', () => {
    beforeAll(async () => {
      await database.collection(collections.art).insertOne(art_data[0]);
    });

    afterAll(async () => {
      await database.collection(collections.art).deleteMany();
    });

    test('it should have code 204 and delete art', async () => {
      const response = await request.delete(`${url}/${art_data[0]._id}`).set('Authorization', loginHeader);

      expect(response.status).toBe(204);
    });
  });
});