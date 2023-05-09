let MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let username = process.env._USER;
let password = process.env._PASSWORD;
let db_name = process.env._DB_NAME;

async function connectToCluster() {
  let mongoClient;
  let uri = `mongodb+srv://${username}:${password}@${db_name}.usui8pg.mongodb.net/?retryWrites=true&w=majority`;

  try {
    mongoClient = new MongoClient(uri);
    console.log('Connecting to MongoDB Atlas cluster...');
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB Atlas!');

    return mongoClient;
  } catch (error) {
    console.error('Connection to MongoDB Atlas failed!', error);
    process.exit();
  }
}

module.exports = connectToCluster