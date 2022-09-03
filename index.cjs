var express=require("express");
var bodyParser=require("body-parser");
var fs = require('fs');

var abr2name = require("./public/abr2name.js").abr2name;
var db = require("./data/visited.cjs");

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.post('/CountryList', function(req,res) {
    var userID = 1;
    db.getVisited(userID).then((visited) => {
        return res.render('CountryList', { visited: visited, abr2name: abr2name });
    });
})

app.post('/CountryMap', function(req,res) {
    // check if user has data in DB
    var userID = 1;
    db.initialiseVisits(userID);
    // get current visit status
    db.getVisited(userID).then((visited) => {
        return res.render('map', { visited: visited, abr2name: abr2name });
    });
})

app.get('/abr2name', function(req, res) {
    return res.sendFile(__dirname + '\\public\\abr2name.js');
})

app.get('/getVisitedCount', function(req, res) {
    var userID = 1;
    db.getVisitedCount(userID).then((count) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(count));
    })
})

app.post('/updateVisitedStatus', function(req, res) {
    var countryAbr = req.body.countryAbr;
    var status = req.body.visitedStatus;
    var userID = 1;
    //update tempDB
    db.updateVisitedStatus(userID, countryAbr, status);
})

app.get('/',function(req,res){    
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    // check if user has data in DB
    var userID = 1;
    db.initialiseVisits(userID);
    // get current visit status
    db.getVisited(userID).then((visited) => {
        // return res.render('home.ejs');
        return res.render('home', { visited: visited, abr2name: abr2name });
    });
    
}).listen(3000)
  
  
console.log("server listening at port 3000");