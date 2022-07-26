const { collections } = require('..');

module.exports = {
  async up(db) {
    await db.collection(collections.users).updateMany(
      { 'password': {$exists : false}},
      { $set: { 
        password: '',
      }},
    );
    await db.collection(collections.users).updateMany(
      { 'roles': {$exists : false}},
      { $set: { 
        roles: [],
      }},
    );
  },
  async down(db) {
    await db.collection(collections.users).updateMany(
      {},
      { $unset: { 
        password: '',
        roles: [],
      }},
    );
  },
};