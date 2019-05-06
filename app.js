const express = require('express')
const bodyParser = require('body-parser');
const exec = require('child_process').exec
const path = require('path')
const app = express()
const port = 3002

app.set('views', path.join(__dirname, '/view'));
app.set('view engine','ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/getHomeTeam', (req, res) => {
  console.log("getHomeTeam inside")
  console.log(req.body)
  console.log(req.query.homeTeamId)
  res.render('home', {teaminfo: "response from server"})
})
// http://www.espn.com/nhl/players
var map1 = new Map();
map1.set('New Jersey',['Blake Coleman','Nico Hischier', 'Michael McLeod', 'Kevin Rooney','Pavel Zacha', 'Travis Zajac']);
map1.set('Philadelphia',['Sean Couturier','Corban Knight','Travis Konecny','Scott','Nolan','Phil']);
map1.set('NY Islanders',['Mathew Barzal','Casey Cizikas','Valtteri Filppula','Tanner Fritz','Leo Komarov','Brock Nelson']);
map1.set('NY Rangers',['','','','','','']);
map1.set('Pittsburgh',['','','','','','']);
map1.set('Boston',['','','','','','']);
map1.set('Buffalo',['','','','','','']);
map1.set('Montreal',['','','','','','']);
map1.set('Ottawa',['','','','','','']);
map1.set('Toronto',['','','','','','']);
map1.set('Carolina',['','','','','','']);
map1.set('Florida',['','','','','','']);
map1.set('Tampa Bay',['','','','','','']);
map1.set('Washington',['','','','','','']);
map1.set('Chicago',['','','','','','']);
map1.set('Detroit',['','','','','','']);
map1.set('Nashville',['','','','','','']);
map1.set('St Louis',['','','','','','']);
map1.set('Calgary',['','','','','','']);
map1.set('Colorado',['','','','','','']);
map1.set('Edmonton',['','','','','','']);
map1.set('Vancouver',['','','','','','']);
map1.set('Anaheim',['','','','','','']);
map1.set('Dallas',['','','','','','']);
map1.set('Los Angeles',['','','','','','']);
map1.set('Phoenix',['','','','','','']);
map1.set('San Jose',['','','','','','']);
map1.set('Columbus',['','','','','','']);
map1.set('Minnesota',['','','','','','']);
map1.set('Winnipeg',['','','','','','']);
map1.set('Arizona',['','','','','','']);
map1.set('Vegas',['','','','','','']);

var obj = {
  'New Jersey': ['mandip', 'shash'],
  'Philadelphia': ['Sean Couturier','Corban Knight','Travis Konecny','Scott','Nolan','Phil'],
  'NY Islanders': ['Mathew Barzal','Casey Cizikas','Valtteri Filppula','Tanner Fritz','Leo Komarov','Brock Nelson']
}


app.post('/', (req, res) => {
  console.log(req.body)
  console.log('python "NHL_274.py" ' + req.body.home.split(',')[0] + ' ' + req.body.away.split(',')[0])
  
  var homeTeamPlayers =[];
  if( obj[req.body.home.split(',')[1]].length > 0 ){
    homeTeamPlayers = obj[req.body.home.split(',')[1]];
  }

  var awayTeamPlayers =[];
  if( obj[req.body.away.split(',')[1]].length > 0 ){
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
      awayTeamPlayers: awayTeamPlayers
    })
  })
})

app.listen(port, () => {
  console.log(`Project View Listening on Port ${port}!`)
})
