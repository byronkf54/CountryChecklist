const mongodb_client = require('../lib/db'); // import for db connection

const db = {};

(async () => {
    const mongoClient = await mongodb_client.connectToCluster();
    db.users = mongoClient.db('CountryChecklistDB').collection('users');
    db.visited_status = mongoClient.db('CountryChecklistDB').collection('visited_status');
    await createIndexes();

    // Close the MongoDB connection
    // client.close();
})();

async function createIndexes() {
    await db.users.createIndex({ user: 1 }, { unique: true });
    await db.visited_status.createIndex({ userID: 1, countryAbr: 1 }, { unique: true });
}

module.exports = db;
