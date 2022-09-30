const pool = require('../lib/db').pool; // import for db connection
const abr2name = require('../public/abr2name.js').abr2name; // dictionary of country abreviations to full names

var visited = {}; // dictionary for abrev to visited status used in setting colours of countries

// function checks if the user has any data for each country in the DB, if not adds new record with default values
function initialiseVisits(userID) {
  Object.keys(abr2name).forEach(element => {
    pool.query(`SELECT * FROM visited_status WHERE userID = ${userID} and countryAbr = '${element}'`, (error, rows) => {
      if (rows.length == 0) {
        const row = { userID: userID, countryAbr: element, countryName: abr2name[element], visited: 0 };
        pool.query('INSERT INTO visited_status SET ?', row, (err, res) => {
          if (err) throw err;
          console.log('Last insert ID: ', res.insertId);
        });
      }
    });
  });
}

// function to retrieve visited status of all countries
function getVisited(userID) {
  return new Promise(function (resolve, reject) {
    pool.query(`SELECT countryAbr, visited FROM visited_status WHERE userID = ${userID}`, (error, rows) => {    
      rows.forEach(row => {
        visited[row.countryAbr] = Boolean(row.visited);
      });
      resolve(visited);
    });
  });
}

function getVisitedCount(userID) {
  return new Promise(function (resolve, reject) {
    pool.query(`SELECT COUNT(*) AS visitedCount FROM visited_status WHERE userID = ${userID} AND visited = 1`, (error, rows) => {
      resolve(rows[0].visitedCount);
    });
  });
}

// function to update visited status
function updateVisitedStatus(userID, countryAbr, status) {
  pool.query(`UPDATE visited_status SET visited = ${status} WHERE userID = ${userID} AND countryAbr = '${countryAbr}'`);
}

module.exports = { initialiseVisits, getVisited, getVisitedCount, updateVisitedStatus }; // exports all functions for use in other files