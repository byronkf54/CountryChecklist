var express = require("express");
const bcrypt = require("bcrypt");
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var fs = require('fs');

// custom files we require access to
var abr2name = require("./public/abr2name.js").abr2name;
var visited_db = require("./data/visited.cjs");
var user_db = require("./data/user.cjs");
const generateAccessToken = require("./lib/generateAccessToken");
const secretJWTKey = process.env.secretJWTKey;
const { default: e } = require("express");

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.post('/CountryList', function(req,res) {
    var userID = req.body.userID;
    visited_db.getVisited(userID).then((visited) => {
        return res.render('CountryList', { visited: visited, abr2name: abr2name });
    });
})

app.post('/CountryMap', function(req,res) {
    // check if user has data in DB
    var userID = req.body.userID;
    visited_db.initialiseVisits(userID);
    // get current visit status
    visited_db.getVisited(userID).then((visited) => {
        return res.render('map', { visited: visited, abr2name: abr2name });
    });
})

app.get('/abr2name', function(req, res) {
    return res.sendFile(__dirname + '\\public\\abr2name.js');
})

app.get('/getVisitedCount', function(req, res) {
    var userID = req.body.userID;
    visited_db.getVisitedCount(userID).then((count) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(count));
    })
})

app.post('/updateVisitedStatus', function(req, res) {
    var countryAbr = req.body.countryAbr;
    var status = req.body.visitedStatus;
    var userID = req.body.userID;
    //update tempDB
    visited_db.updateVisitedStatus(userID, countryAbr, status);
})

app.post('/createUser', async function(req, res) {
    if (req.body.user == undefined) {
        res.render('register');
    }
    const user = req.body.user;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user_db.createUser(user, hashedPassword).then((result) => {
        if (result == -1) {
            console.log("username exists");
            return res.render('register', { errors: ["Username is not available"] })
        }
        else {
            // generate access token so user can stay logged in
            const token = generateAccessToken({user: user});
            console.log("token: " + token);
            res.json({accessToken: token});

            // check if user has data in DB
            const userID = result.userID;
            visited_db.initialiseVisits(userID);
            // get current visit status
            visited_db.getVisited(userID).then((visited) => {
                return res.render('home', { visited: visited, abr2name: abr2name });
            });
        }
    });    
})

app.post('/login', function(req, res) {
    const user = req.body.name;
    const password = req.body.password;

    console.log("User: " + user);

    user_db.getUser(user).then((result) => {
        console.log("Get User Result: " + result.user);
        if (result.user == undefined) res.sendStatus(404); // user does not exist
        else {
            const hashedPassword = result.password;
            bcrypt.compare(password, hashedPassword).then((comparison) => {
                if (comparison) {
                    // generate access token so user can stay logged in
                    const token = generateAccessToken({user: user});
                    console.log("token: " + token);
                    res.json({accessToken: token});

                    // check if user has data in DB
                    const userID = result.userID;
                    visited_db.initialiseVisits(userID);
                    // get current visit status
                    visited_db.getVisited(userID).then((visited) => {
                        return res.render('home', { visited: visited, abr2name: abr2name });
                    });
                }
                else { // password incorrect
                    console.log("Retry password");
                    return res.render()
                }
            })
        }
    })
})

app.get('/home', function(req,res) {
    
})

app.get('/register', function(req, res) {
    res.render('register', { errors: "" });
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/',function(req,res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    // check user is logged in    
    if (req.body.accessToken == undefined) {
        res.render('login');
    }
}).listen(port)
  
  
console.log(`server listening at port ${port}`);