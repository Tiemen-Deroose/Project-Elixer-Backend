const config = require('config');
const mongo = require('mongodb');

const mongoClient = mongo.MongoClient;
const DATABASE_URL = config.get('mongodb.database_url');
const DATABASE_NAME = config.get('mongodb.database_name');

const artObjects = [
    {
        _id: 'f064a797-99fa-4ec0-9454-ba14838f5df4',
        title: 'Sunlight',
        material: 'canvas',
        medium: 'resin',
        size: 'large',
        image_url: 'http://localhost:9000/api/art/images/sunlight.jpg',
        price: 209.99
    },
    {
        _id: '9ee5fb36-1ff5-4588-b888-fade80b88d05',
        title: 'Autumn Tree',
        material: 'canvas',
        medium: 'acrylic paint',
        size: 'medium',
        image_url: 'http://localhost:9000/api/art/images/autumn_tree.jpg',
        price: 59.99
    }
];

module.exports = {
    seed: async () => {
        const client = await mongoClient.connect(DATABASE_URL);

        const database = client.db(DATABASE_NAME);

        // delete all art objects
        if ((await database.listCollections().toArray()).map(c => c.name).includes('art')) // if database has a collection named 'art', then
            await database.collection('art').drop();

        // add fresh art objects
        await database.createCollection("art");
        await database.collection("art").insertMany(artObjects);

        client.close();
    }
}