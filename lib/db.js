var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b97545559289be',
  password: '62228bda',
  database: 'heroku_388ff6fbeda2f76'
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db: ' + err);
    return;
  }
});

module.exports = { con };