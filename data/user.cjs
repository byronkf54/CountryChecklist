const mongodb_client = require('../lib/db'); // import for db connection

// Create User
async function createUser(username, hashedPassword) {
    const client = await mongodb_client.connectToCluster();
    const db = client.db('CountryChecklistDB');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username: username });
    if (existingUser) {
        return -1;
    }

    // Insert new user
    const result = await db.collection('users').insertOne({ username: username, password: hashedPassword });
    return result.insertedId.toString();
}


async function getUser(username) {
    const client = await mongodb_client.connectToCluster()
    let db = client.db('CountryChecklistDB');

    // Select user by name
    return db.collection('users').findOne({ username: username })
        .then(userRow => {
            console.log("userROW: ", userRow)
            if (!userRow) {
                return undefined; // return an empty object if no user is found
            }

            return userRow;
        });
}


module.exports = {createUser, getUser};