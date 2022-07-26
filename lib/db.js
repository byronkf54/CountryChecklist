var mysql = require('mysql');
var util = require('util');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 50,
  host: process.env.hostname,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: 3306
});

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }

  if (connection) connection.release()

  return
})

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

module.exports = { pool }