const mongodb_client = require('../lib/db'); // import for db connection

// Create User
async function createUser(user, hashedPassword) {
    mongodb_client.connectToCluster().then(async (db) => {
        db('CountryChecklistDB')
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({user: user});
        if (existingUser) {
            return -1;
        }

        // Insert new user
        const result = await db.collection('users').insertOne({user: user, password: hashedPassword});
        return result.insertedId;
    });
}

createUser()

async function getUser(user) {
    const db = mongodb_client.connectToCluster().then(async (db) => {
        db('CountryChecklistDB');

        // Select user by name
        const result = await db.collection('users').findOne({user: user});
        if (!result) {
            return {}; // return an empty object if no user is found
        }

        return result;
    })
}


module.exports = {createUser, getUser};