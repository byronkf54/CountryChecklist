const mongodb_client = require('../lib/db'); // import for db connection
const abr2name = require('../public/abr2name.js').abr2name; // dictionary of country abreviations to full names

var visited = {}; // dictionary for abrev to visited status used in setting colours of countries

// function checks if the user has any data for each country in the DB, if not adds new record with default values
async function initialiseVisits(userID) {
    let db = mongodb_client.connectToCluster().db('CountryChecklistDB');
    for (const element of Object.keys(abr2name)) {
        try {
            const existingRow = await db.collection('visited_status').findOne({ userID: userID, countryAbr: element });
            if (!existingRow) {
                const row = { userID: userID, countryAbr: element, countryName: abr2name[element], visited: 0 };
                const result = await db.collection('visited_status').insertOne(row);
                console.log(`New document inserted with _id: ${result.insertedId}`);
            }
        }
        catch {
            console.log("CATCH");
            console.log(userID);
            console.log(element);
            let insertedID = await db.collection('visited_status').update({}, {$set: {"userID": userID, "countryAbr": element, "visited": 0}}, false, true);
            console.log(insertedID);
        }
    }


}

// function to retrieve visited status of all countries
function getVisited(userID) {
    mongodb_client.connectToCluster().then(async (client) => {
        let db = client.db('CountryChecklistDB')
        // Check if user already exists
        const visited_countries = await db.collection('users').find({userID: userID});
        for (let row in visited_countries) {
            visited[row.countryAbr] = Boolean(row.visited)
        }
        return visited;
    });
}

async function getVisitedCount(userID) {
    mongodb_client.connectToCluster().then(async (client) => {
        let db = client.db('CountryChecklistDB')

        return db.collection('visited_status')
            .find({userID: userID, visited: 1})
            .count();
    });
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