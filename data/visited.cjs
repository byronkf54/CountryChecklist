const mongodb_client = require('../lib/db'); // import for db connection
const abr2name = require('../public/abr2name.js').abr2name; // dictionary of country abreviations to full names

var visited = {}; // dictionary for abrev to visited status used in setting colours of countries

// function checks if the user has any data for each country in the DB, if not adds new record with default values
async function initialiseVisits(userID) {
    mongodb_client.connectToCluster().then(async (client) => {
        let db = client.db('CountryChecklistDB');
        for (const element of Object.keys(abr2name)) {
            const existingRow = await db.collection('visited_status').findOne({
                userID: userID,
                countryAbr: element
            });

            if (!existingRow) {
                const row = {userID: userID, countryAbr: element, countryName: abr2name[element], visited: 0};
                const result = await db.collection('visited_status').insertOne(row);
            }
        }
    });
}

// function to retrieve visited status of all countries
async function getVisited(userID) {
    const client = await mongodb_client.connectToCluster();
    const db = client.db('CountryChecklistDB');
    const visited = {};

    const visitedCountries = await db.collection('visited_status').find({userID: userID}).toArray();
    for (const row of visitedCountries) {
        visited[row.countryAbr] = Boolean(row.visited);
    }

    return visited;
}

async function getVisitedCount(userID) {
    const client = await mongodb_client.connectToCluster();
    const db = client.db('CountryChecklistDB');

    return await db.collection('visited_status')
        .countDocuments({userID: userID, visited: 1});
}


// function to update visited status
async function updateVisitedStatus(userID, countryAbr, status) {
    mongodb_client.connectToCluster().then(async (client) => {
        let db = client.db('CountryChecklistDB')

        await db.collection('visited_status').updateOne(
            {userID: userID, countryAbr: countryAbr},
            {$set: {visited: status}}
        );
    });
}


module.exports = {initialiseVisits, getVisited, getVisitedCount, updateVisitedStatus}; // exports all functions for use in other files