const { collections } = require('../../src/data');
const { withServer, loginUser } = require('../supertest.setup');

const dataNoId = ({ _id, ...object }) => object; // eslint-disable-line no-unused-vars

const jewelry_data = [{ 
  _id: 'ee402224-b772-4536-a378-40268b46562e',
  name: 'Colour Changing Pendant',
  category: 'pendant',
  material: 'steel',
  colour: 'silver',
  image_url: 'http://localhost:9000/api/jewelry/images/colour_changing_pendant.jpg',
  price: 49.99,
},
{ 
  _id: '111b85dc-e7e4-473a-9952-06183f5f97cc',
  name: 'Skeletonized Petals bracelet',
  category: 'bracelet',
  material: 'sterling silver',
  colour: 'silver',
  image_url: 'http://localhost:9000/api/jewelry/images/skeletonized_petals_bracelet.jpg',
  price: 39.99,
}];

describe('Jewelry', () => {
  let request;
  let database;
  let loginHeader;

  withServer(({ request: r, db}) => {
    request = r;
    database = db;
  });

  beforeAll(async () => {
    loginHeader = await loginUser(request);
  });

  const url = '/api/jewelry';

  describe('GET /api/jewelry', () => {

    beforeAll(async () => {
      await database.collection(collections.jewelry).insertMany(jewelry_data);
    });

    afterAll(async () => {
      await database.collection(collections.jewelry).deleteMany();
    });

    test('it should have code 200 and return all jewelry', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.count).toEqual(jewelry_data.length);
      expect(response.body.data).toEqual(expect.arrayContaining(jewelry_data));
    });
  });

  describe('GET /api/jewelry/:id', () => {

    beforeAll(async () => {
      await database.collection(collections.jewelry).insertOne(jewelry_data[0]);
    });

    afterAll(async () => {
      await database.collection(collections.jewelry).deleteMany();
    });

    test('it should have code 200 and return the requested jewelry', async () => {
      const response = await request.get(`${url}/${jewelry_data[0]._id}`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(jewelry_data[0]);
    });
  });

  describe('POST /api/jewelry', () => {

    afterAll(async () => {
      await database.collection(collections.jewelry).deleteMany({});
    });

    test('it should have code 201 and return the created jewelry', async () => {
      const response = await request.post(url).send(dataNoId(jewelry_data[0])).set('Authorization', loginHeader);

      expect(response.status).toBe(201);
      expect(response.body._id).toBeTruthy();
      expect(response.body.name).toEqual(jewelry_data[0].name);
      expect(response.body.category).toEqual(jewelry_data[0].category);
      expect(response.body.material).toEqual(jewelry_data[0].material);
      expect(response.body.colour).toEqual(jewelry_data[0].colour);
      expect(response.body.price).toEqual(jewelry_data[0].price);
      expect(response.body.image_url).toEqual(jewelry_data[0].image_url);
    });
  });

  describe('PUT /api/jewelry/:id', () => {
    beforeAll(async () => {
      await database.collection(collections.jewelry).insertOne(jewelry_data[0]);
    });

    afterAll(async () => {
      await database.collection(collections.jewelry).deleteMany();
    });

    test('it should have code 200 and update jewelry', async () => {
      const response = await request.put(`${url}/${jewelry_data[0]._id}`).send(dataNoId(jewelry_data[1])).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body._id).toBeTruthy();
      expect(response.body.name).toEqual(jewelry_data[1].name);
      expect(response.body.category).toEqual(jewelry_data[1].category);
      expect(response.body.material).toEqual(jewelry_data[1].material);
      expect(response.body.colour).toEqual(jewelry_data[1].colour);
      expect(response.body.price).toEqual(jewelry_data[1].price);
      expect(response.body.image_url).toEqual(jewelry_data[1].image_url);
    });
  });

  describe('DELETE /api/jewelry/:id', () => {
    beforeAll(async () => {
      await database.collection(collections.jewelry).insertOne(jewelry_data[0]);
    });

    afterAll(async () => {
      await database.collection(collections.jewelry).deleteMany();
    });

    test('it should have code 204 and delete jewelry', async () => {
      const response = await request.delete(`${url}/${jewelry_data[0]._id}`).set('Authorization', loginHeader);

      expect(response.status).toBe(204);
    });
  });
});