const mongoClient = require('../lib/db').mongoClient; // import for db connection
const abr2name = require('../public/abr2name.js').abr2name; // dictionary of country abreviations to full names

var visited = {}; // dictionary for abrev to visited status used in setting colours of countries

// function checks if the user has any data for each country in the DB, if not adds new record with default values
async function initialiseVisits(userID) {
    let db = mongoClient.db('CountryChecklistDB')
    for (const element of Object.keys(abr2name)) {
        try {
            const existingRow = await db.visited_status.findOne({ userID: userID, countryAbr: element });
            if (!existingRow) {
                const row = { userID: userID, countryAbr: element, countryName: abr2name[element], visited: 0 };
                const result = await db.visited_status.insertOne(row);
                console.log(`New document inserted with _id: ${result.insertedId}`);
            }
        }
        catch {
            console.log("CATCH");
            console.log(userID);
            console.log(element);
            let insertedID = await db.visited_status.update({}, {$set: {"userID": userID, "countryAbr": element, "visited": 0}}, false, true);
            console.log(insertedID);
        }
    }


}

// function to retrieve visited status of all countries
function getVisited(userID) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT countryAbr, visited FROM visited_status WHERE userID = ${userID}`, (err, rows) => {
            rows.forEach(row => {
                visited[row.countryAbr] = Boolean(row.visited);
            });
            resolve(visited);
        });
    });
}

function getVisitedCount(userID) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT COUNT(*) AS visitedCount FROM visited_status WHERE userID = ${userID} AND visited = 1`, (err, rows) => {
            resolve(rows[0].visitedCount);
        });
    });
}

// function to update visited status
function updateVisitedStatus(userID, countryAbr, status) {
    pool.query(`UPDATE visited_status SET visited = ${status} WHERE userID = ${userID} AND countryAbr = '${countryAbr}'`);
}

module.exports = {initialiseVisits, getVisited, getVisitedCount, updateVisitedStatus}; // exports all functions for use in other files