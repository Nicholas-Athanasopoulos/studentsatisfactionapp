var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('studentsatisfactionDB2.2');
var express = require('express');
var restapi = express();
var multer = require('multer');
var upload = multer();
var bodyParser = require('body-parser');
var cors = require('cors'); // npm i cors
restapi.use(cors());

restapi.use(bodyParser.json({ limit: '1mb' }));

restapi.use(bodyParser.urlencoded({ extended: true }));
// create restapilication/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS satisfaction (id INTEGER PRIMARY KEY AUTOINCREMENT, satisfaction TEXT, classroom TEXT, dateandtime TEXT)");
    db.run("DELETE FROM satisfaction");
});

restapi.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

restapi.post('/addfeedback', upload.array(), urlencodedParser, function (req, res) {

    let satisfaction = req.body.satisfaction;
    let classroom = req.body.classroom;
    let dateandtime = new Date().toLocaleTimeString();
    res.send('Thank you for submitting data')
    console.log(satisfaction, classroom, dateandtime);

    db.run("INSERT INTO satisfaction (satisfaction, classroom, dateandtime) VALUES (?, ?, ?)",
        satisfaction, classroom, dateandtime,
        function (error) {
            if (error) {
                console.err(error);
                res.status(500);
            } else {
                res.status(202);
            } res.end();
        });
});

restapi.get('/satisfaction/:id', function (req, res) {
    let id = req.params.id;
    res.setHeader('Content-Type', 'application/json');
    db.all("SELECT * FROM satisfaction WHERE id=?", [id], function (err, rows) {
        res.json(rows);
    });
});

restapi.get('/allfeedback', function (req, res) {
    db.all("select * from satisfaction", function (err, rows) {
        res.json(rows);
    });
})

restapi.get('/', function (req, res) {
    res.send('HELLO WORLD');
});

restapi.listen(3000);
console.log("Up and running..");
