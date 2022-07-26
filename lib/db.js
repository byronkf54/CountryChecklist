var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tadworth70@',
  database: 'countrychecklist'
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db: ' + err);
    return;
  }
});

module.exports = { con };