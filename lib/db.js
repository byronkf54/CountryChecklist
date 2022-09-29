var mysql = require('mysql');

const con = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db: ' + err);
    return;
  }
});

module.exports = { con };