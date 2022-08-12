const { collections } = require('..');

module.exports = {
  async up(db) {
    await db.collection(collections.users).updateMany(
      { 'favourites': {$exists : false}},
      { $set: { 
        favourites: [],
      }},
    );
  },
  async down(db) {
    await db.collection(collections.users).updateMany(
      { $unset: { 
        favourites: [],
      }},
    );
  },
};
