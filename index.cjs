const express = require("express");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const cookieParser = require("cookie-parser");
require('dotenv').config()
const fs = require('fs');

// custom files we require access to
const abr2name = require("/app/public/abr2name.js").abr2name;
const visited_db = require("/app/data/visited.cjs");
const user_db = require("/app/data/user.cjs");
const auth = require("/app/lib/authentication");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

app.post('/CountryList', auth.authenticateToken, function (req, res) {
    const userID = req.cookies.userID;
    visited_db.getVisited(userID).then((visited) => {
        return res.render('CountryList', {visited: visited, abr2name: abr2name});
    });
})

app.post('/CountryMap', auth.authenticateToken, function (req, res) {
    // check if user has data in DB
    var userID = req.cookies.userID;
    // get current visit status
    visited_db.getVisited(userID).then((visited) => {
        return res.render('map', {visited: visited, abr2name: abr2name});
    });
})

app.get('/abr2name', function (req, res) {
    return res.sendFile(__dirname + '\\public\\abr2name.js');
})

app.get('/getVisitedCount', function (req, res) {
    var userID = req.cookies.userID;
    visited_db.getVisitedCount(userID).then((count) => {
        res.send(JSON.stringify(count));
    })
})

app.post('/updateVisitedStatus', async function (req, res) {
    var countryAbr = req.body.countryAbr;
    var status = req.body.visitedStatus;
    var userID = req.cookies.userID;
    console.log(countryAbr, status, userID)
    //update tempDB
    await visited_db.updateVisitedStatus(userID, countryAbr, status);
    visited_db.getVisited(userID).then((visited) => {
        return res.render('home', {visited: visited, abr2name: abr2name});
    });
})

app.post('/createUser', async function (req, res) {
    // check username is not empty
    if (req.body.user === undefined || req.body.user.length < 1) {
        res.render('register', {errors: ["Username must not be empty"]});
    }
    const username = req.body.user;

    // check password is valid
    if (!auth.validatePassword(req.body.password)) {
        return res.render('register', {
            errors: ["Password must meet the criteria: \n" +
            "Between 8 and 100 characters, \n" +
            "Contain an uppercase, lowercase, digit and symbol"]
        });
    }

    // hash password using Bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create user and access token
    user_db.createUser(username, hashedPassword).then(async (userID) => {
        if (userID === -1) {
            return res.render('register', {errors: ["Username is not available"]})
        } else {
            // generate access token so user can stay logged in
            const token = auth.generateAccessToken({user: username});
            res = setCookies(res, "token", token);
            res = setCookies(res, "userID", userID);

            // initialise visit status
            visited_db.initialiseVisits(userID).then(() => {
                // get current visit status
                visited_db.getVisited(userID).then((visited) => {
                    return res.render('home', {visited: visited, abr2name: abr2name});
                });
            });
        }
    });
})

app.post('/login', function (req, res) {
    if (req.body.user.length === 0) {
        res.render('login', {errors: ["Username can't be empty."]});
    }
    const username = req.body.user;
    const password = req.body.password;

    user_db.getUser(username).then(async (existingUser) => {
        if (existingUser === undefined) {
            return res.render('login', {errors: ["Username is not recognised"]})
        } else {
            const hashedPassword = existingUser.password;
            bcrypt.compare(password, hashedPassword).then(async (comparison) => {
                if (comparison) {
                    // generate access token so user can access pages requiring authorisation
                    const token = auth.generateAccessToken({user: username});
                    const userID = existingUser._id;
                    res = setCookies(res, "token", token);
                    res = setCookies(res, "userID", userID);

                    // get current visit status
                    const visited = await visited_db.getVisited(userID);
                    return res.render('home', {visited: visited, abr2name: abr2name});
                } else { // password incorrect
                    return res.render("login", {errors: ["Password incorrect."]})
                }
            })
        }
    })
})

app.post('/logOut', function (req, res) {
    res.clearCookie("token");
    res.clearCookie("userID");
    res.render("login", {errors: ""});
})

app.get('/home', auth.authenticateToken, function (req, res) {
    const userID = req.cookies.userID;
    visited_db.getVisited(userID).then((visited) => {
        return res.render('home', {visited: visited, abr2name: abr2name});
    });
})

app.get('/register', function (req, res) {
    res.render('register', {errors: [""]});
})

app.get('/login', function (req, res) {
    if (req.cookies.userID === undefined) {
        res.render('login', {errors: [""]});
    } else {
        const userID = req.cookies.userID;
        visited_db.getVisited(userID).then((visited) => {
            return res.render('home', {visited: visited, abr2name: abr2name});
        });
    }
})

app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    // check user is logged in    
    if (req.cookies.token === undefined) {
        res.render('register', {errors: ""});
    } else if (req.cookies.userID !== undefined) {
        const userID = req.cookies.userID;
        visited_db.getVisited(userID).then((visited) => {
            return res.render('home', {visited: visited, abr2name: abr2name});
        });
    }
}).listen(port)

// default response for 404 error
app.get('*', function (req, res) {
    res.status(404).render('login', {errors: "Page not found"});
});

function setCookies(res, cookieName, value) {
    res.cookie(cookieName, value, {
        secure: true,
        httpOnly: true,
        expires: dayjs().add(60, "minutes").toDate(),
    })
    return res;
}


console.log(`server listening at port ${port}`);