const pool = require('../lib/db').pool; // import for db connection
const { User, visited_status } = require('../lib/models');

function createUser(user, hashedPassword) {
    return new Promise(function (resolve, reject) {
        // check if username already exists
        pool.query(`SELECT * FROM users WHERE user = '${user}'`, (err, rows) => {
            if (err) throw (err)

            if (rows.length != 0) {
                resolve(-1);
            }
            else {
                pool.query(`INSERT INTO users (user, password) VALUES ('${user}', '${hashedPassword}')`, (err, result) => {
                    if (err) throw (err)
                    resolve(result.insertId);
                })
            }
        })
    });
}

function getUser(user) {
    return new Promise(function (resolve, reject) {
        // select user by name
        pool.query(`SELECT * FROM users WHERE user = '${user}'`, (err, rows) => {
            if (err) throw (err)

            if (rows.length == 0) {
                resolve(User.build());
            }
            else {
                resolve(rows[0]);
            }
        });
    });
}


module.exports = { createUser, getUser };