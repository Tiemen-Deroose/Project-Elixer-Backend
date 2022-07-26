const { collections } = require('..');

module.exports = {
  async up(db) {
    if (!db.collection(collections.jewelry))
      await db.createCollection(collections.jewelry);
  },
  async down(db) {
    await db.collection(collections.jewelry).drop();
  },
};