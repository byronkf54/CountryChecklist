const mongodb_client = require('../lib/db'); // import for db connection

// Create User
async function createUser(user, hashedPassword) {
    mongodb_client.connectToCluster().then(async (client) => {
        let db = client.db('CountryChecklistDB')
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({userID: user});
        if (existingUser) {
            return -1;
        }

        // Insert new user
        const result = await db.collection('users').insertOne({userID: user, password: hashedPassword});
        return result.insertedId;
    });
}


async function getUser(user) {
    mongodb_client.connectToCluster().then(async (client) => {
        let db = client.db('CountryChecklistDB');

        // Select user by name
        const result = await db.collection('users').findOne({userID: user});
        if (!result) {
            return {}; // return an empty object if no user is found
        }

        return result;
    })
}


module.exports = {createUser, getUser};