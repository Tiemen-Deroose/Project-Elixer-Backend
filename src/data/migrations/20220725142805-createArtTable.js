const { collections } = require('..');

module.exports = {
  async up(db) {
    if (!db.collection(collections.art))
      await db.createCollection(collections.art);
  },
  async down(db) {
    await db.collection(collections.art).drop();
  },
};