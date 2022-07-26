const { collections } = require('..');

module.exports = {
  async up(db) {
    if (!db.collection(collections.users))
      await db.createCollection(collections.users);
  },
  async down(db) {
    await db.collection(collections.users).drop();
  },
};