const express = require('express')
const bodyParser = require('body-parser');
const exec = require('child_process').exec
const path = require('path')
var schedule = require('node-schedule');
var nodemailer = require("nodemailer");

const app = express()
const port = 3002

app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}));

// Mongo Database connection
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:admin@nhl-cluster-6yf4s.mongodb.net/test?retryWrites=true";

// Variables
var obj = {
    'New Jersey': ['Blake Coleman', '	Nico Hischier', 'Michael McLeod', 'Kevin Rooney', 'Pavel Zacha', 'Travis Zajac'],
    'Philadelphia': ['Sean Couturier', 'Corban Knight', 'Travis Konecny', 'Scott', 'Nolan', 'Phil'],
    'NY Islanders': ['Mathew Barzal', 'Casey Cizikas', 'Valtteri Filppula', 'Tanner Fritz', 'Leo Komarov', 'Brock Nelson'],
    'NY Rangers': ['Lias Andersson', 'onnor Brickley', 'Filip Chytil', 'Brett Howden', 'Vinni Lettieri', 'Boo Nieves'],
    'Pittsburgh': ['Zach', 'Nick Bjugstd', 'Teddy Blueger', 'Sidney Crosby', 'Matt Cullen', 'Jake Guentzel'],
    'Boston': ['Noel', 'David', 'Patrice', 'Paul', 'Charlie', 'Ryan'],
    'Buffalo': ['Jack', 'Zemgus', 'Casey', 'Sam', 'Scott', 'Vladimir'],
    'Montreal': ['Byron', 'Philip', 'Max Domi', 'Andrew Shaw', 'Jordan Weal', 'Nate Thompson'],
    'Ottawa': ['Frederik Gauthier', 'Zach Hyman', '    Nazem Kadri', 'Patrick Marleau', 'Mitch Marner', ' Auston Matthews'],
    'Carolina': ['Patrick Brown', 'Greg McKegg', 'Jordan Staal', 'Lucas Wallmark', 'Sebastian Aho', 'Micheal Ferland'],
    'Florida': ['Aleksander Barkov', ' Henrik Borgstrom', 'Jonathan Huberdeau', '    Derek MacKenzie', 'Denis Malgin', 'Colton Sceviour'],
    'Tampa Bay': ['Anthony Cirelli', 'Tyler Johnson', 'Alex Killorn', '  Danick Martel', 'J.T. Miller', 'Cedric Paquette'],
    'Washington': ['Nicklas Backstrom', 'Travis Boyd', 'Nic Dowd', 'Lars Eller', 'Juuso Ikonen', 'Evgeny Kuznetsov'],
    'Chicago': ['Artem Anisimov', 'Drake Caggiula', 'John Hayden', 'Dominik Kahun', 'David Kampf', '   Marcus Kruger'],
    'Detroit': ['Andreas Athanasiou', 'Christoffer Ehn', 'Luke Glendening', 'Darren Helm', 'Dylan Larkin', 'Frans Nielsen'],
    'Nashville': ['Nick Bonino', 'Brian Boyle', 'Filip Forsberg', 'Frederick Gaudreau', 'Mikael Granlund', 'Rocco Grimaldi'],
    'St Louis': ['Tyler Bozak', 'Robby Fabbri', 'Ryan OReilly', 'Brayden Schenn', 'Oskar Sundqvist', 'Robert Thomas'],
    'Calgary': ['Mikael Backlund', 'Sam Bennett', 'Austin Czarnik', 'Dillon Dube', 'Mark Jankowski', 'Elias Lindholm'],
    'Colorado': ['Derick Brassard', 'Tyson Jost', 'Alexander Kerfoot', 'Nathan MacKinnon', 'Carl Soderberg', 'Colin Wilson'],
    'Edmonton': ['Kyle Brodziak', 'Colby Cave', 'Leon Draisaitl', 'Sam Gagner', 'Joe Gambardella', 'Brad Malone'],
    'Vancouver': ['Jay Beagle', 'Adam Gaudette', 'Markus Granlund', 'Bo Horvat', 'Tyler Motte', '  Elias Pettersson'],
    'Anaheim': ['Ryan Getzlaf', 'Derek Grant', 'Adam Henrique', 'Ryan Kesler', 'Rickard Rakell', 'Devin Shore'],
    'Dallas': ['Andrew Cogliano', 'Jason Dickinson', 'Justin Dowling', 'Radek Faksa', 'Mattias Janmark', 'Tyler Seguin'],
    'Los Angeles': ['Jonny Brodzinski', 'Jeff Carter', 'Alex Iafallo', 'Anze Kopitar', 'Trevor Lewis', 'Blake Lizotte'],
    'Phoenix': ['Carl Dahlstrom', 'Gustav Forsling', 'Erik Gustafsson', 'Duncan Keith', 'Slater Koekkoek', 'Connor Murphy'],
    'San Jose': ['Logan Couture', 'Dylan Gambrell', 'Micheal Haley', 'Tomas Hertl', 'Gustav Nyquist', 'Joe Pavelski'],
    'Columbus': ['Brandon Dubinsky', 'Pierre-Luc Dubois', 'Matt Duchene', 'Boone Jenner', 'Riley Nash', 'Lukas Sedlak'],
    'Minnesota': ['Ryan Donato', 'Joel Eriksson Ek', 'Mikko Koivu', 'Luke Kunin', 'Victor Rask', 'Eric Staal'],
    'Winnipeg': ['Mason Appleton', 'Andrew Copp', 'Marko Dano', 'Kevin Hayes', 'Matt Hendricks', 'Par Lindholm'],
    'Arizona': ['Dave Bolland', 'Nick Cousins', 'Christian Dvorak', 'Alex Galchenyuk', 'Vinnie Hinostroza', 'Clayton Keller'],
    'Vegas': ['Ryan Carpenter', 'Cody Eakin', 'William Karlsson', 'Jonathan Marchessault', 'Tomas Nosek', 'Brandon Pirri']
}

var message = '';
var homeTeamPlayers = [];
var awayTeamPlayers = [];

// APIs
app.get('/', (req, res) => {
    res.render('home')
    console.log(new Date);
})

app.get('/subscribe', (req, res) => {
    res.render('subscribe')
})

app.post('/getHomeTeam', (req, res) => {
    console.log("getHomeTeam inside")
    console.log(req.body)
    console.log(req.query.homeTeamId)
    res.render('home', {
        teaminfo: "response from server"
    })
})

app.post('/subscribeUser', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("NHL");
        var myobj = req.body;
        dbo.collection("Users").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });

    res.render('home',{
        emailStatus: 'Subscribed Successfully!'
    });
});

app.post('/', (req, res) => {
    console.log('python "NHL_274.py" ' + req.body.home.split(',')[0] + ' ' + req.body.away.split(',')[0])
    if (req.body.home.split(',')[1].length > 0) {
        homeTeamPlayers = obj[req.body.home.split(',')[1]];
    }
    if (req.body.away.split(',')[1].length > 0) {
        awayTeamPlayers = obj[req.body.away.split(',')[1]];
    }

    exec('python "NHL_274.py" ' + req.body.home.split(',')[0] + ' ' + req.body.away.split(',')[0], (error, stdout, stderr) => {
        console.log(error)
        console.log(stderr)
        console.log(stdout)
        message = 'Among teams ' + req.body.home.split(',')[1] + ' and ' + req.body.away.split(',')[1] + ', '
        if (stdout == 2) {
            message += req.body.home.split(',')[1] + ' will win.'
        } else if (stdout == 0) {
            message += req.body.away.split(',')[1] + ' will win.'
        } else {
            message += ' the match will draw.'
        }
        res.render('home', {
            message: message,
            homeTeamPlayers: homeTeamPlayers,
            awayTeamPlayers: awayTeamPlayers,
            emailStatus: ''
        })
    })
})

// Node Scheduler - IOT
var rule = new schedule.RecurrenceRule();
rule.minute = 15;

var j = schedule.scheduleJob(rule, function() {
    console.log("firing emails");
    sendEmails();
});

// Sends Email to the subscribed users
function sendEmails() {
    var d = new Date();
    var ONE_HOUR = 60 * 60 * 1000; /* ms */

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "sharkscmpe274@gmail.com",
            pass: "sharks@123"
        }
    });

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("NHL");
        dbo.collection("Match-schedule").find({}).toArray(function(err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
            console.log(result[i].Date - (new Date));
                if ((result[i].Date - (new Date)) > 0 && (result[i].Date - (new Date)) < ONE_HOUR) {
                    message = 'Among teams Home Team:' + result[i].homeTeam + ' and Away Team:' + result[i].awayTeam + ', '
                    exec('python "NHL_274.py" ' + result[i].homeTeamId + ' ' + result[i].awayTeamId, (error, stdout, stderr) => {
                        console.log(error)
                        console.log(stderr)
                        console.log(stdout)
                        if (stdout == 2) {
                            message += '-> Home Team Wins.'
                        } else if (stdout == 0) {
                            message += '-> Away Team Wins.'
                        } else {
                            message += ' the match will draw.'
                        }
                        console.log(message);
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            var dbo = db.db("NHL");
                            dbo.collection("Users").find({}).toArray(function(err, result) {
                                if (err) throw err;
                                userList = result;
                                for (var i = 0; i < result.length; i++) {
                                    var mailOptions = {
                                        from: 'sharkscmpe274@gmail.com',
                                        to: result[i].Email,
                                        subject: 'Ice Hockey Game Predictor by Sharks',
                                        text: "Hello " + result[i].FirstName + " " + result[i].LastName + ",\r\n\r\n" + message + "\r\n\r\nThank you"
                                    };
                                    transporter.sendMail(mailOptions, function(error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log("success");
                                        }
                                    });
                                }
                                db.close();
                            });
                        });
                    })
                }
            }
            db.close();
        });
    });
}

app.listen(process.env.PORT || 3002)