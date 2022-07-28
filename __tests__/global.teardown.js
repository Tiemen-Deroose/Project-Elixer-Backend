const { shutdownData, getConnection, collections } = require('../src/data');

module.exports = async () => {
  const db = await getConnection();

  await db.collection(collections.art).drop();
  await db.collection(collections.jewelry).drop();
  await db.collection(collections.users).drop();

  await shutdownData();
};