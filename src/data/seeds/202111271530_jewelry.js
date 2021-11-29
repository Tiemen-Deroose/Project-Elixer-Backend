const config = require('config');
const mongo = require('mongodb');

const mongoClient = mongo.MongoClient;
const DATABASE_URL = config.get('mongodb.database_url');
const DATABASE_NAME = config.get('mongodb.database_name');

const jewelryObjects = [
  { 
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
  },
];

module.exports = {
  seed: async () => {
    const client = await mongoClient.connect(DATABASE_URL);

    const database = client.db(DATABASE_NAME);

    // delete all jewelry objects
    console.log();
        
    if ((await database.listCollections().toArray()).map((c) => c.name).includes('jewelry')) // if database has a collection named 'jewelry', then
      await database.collection('jewelry').drop();

    // add fresh jewelry objects
    await database.createCollection('jewelry');
    await database.collection('jewelry').insertMany(jewelryObjects);
        
    client.close();
  },
};