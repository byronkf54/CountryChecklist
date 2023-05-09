const mongoClient = require('../lib/db').mongoClient; // import for db connection

const db = {};
db.users = mongoClient.db().collection('users');
db.visited_status = mongoClient.db().collection('visited_status');

createIndexes();

// Close the MongoDB connection
// client.close();

async function createIndexes() {
    await db.users.createIndex({ user: 1 }, { unique: true });
    await db.visited_status.createIndex({ userID: 1, countryAbr: 1 }, { unique: true });
}

module.exports = db;
