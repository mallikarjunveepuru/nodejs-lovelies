var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var app = express();

/* Set-up Express
 * * * * * * * * */
app.set('views', './views');
app.set('view engine', 'jade');

/* Express middle-ware
 * * * * * * * * * * */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static('./public'));


/* Set-up routes
 * * * * * * * * * * * */
var router = require('./routes/router');
app.get('/', router.index);
app.get('/index.html', router.index);
app.get('/band', router.band);
app.get('/shows', router.shows);
app.get('/contact', router.contact);
app.get('/partials/:id', router.partials);
  // ~/song routes
//app.all('/song', router.song);
app.get('/song', router.getSongs);
app.get('/song/:id', router.getOneSong);
app.post('/song', router.postSong);
app.put('/song/:id', router.updateSong);
app.delete('/song/:id', router.deleteSong);

app.use(router.error);

/* Connection to the database
 * * * * * * * * * * * * * * */
var mongoose = require('mongoose');
var db_url = 'mongodb://localhost:27017/lovelies_db';
mongoose.connect(db_url, function(err) {
  if (err) {
    console.log('Database connection error: ', err);
  } else {
    console.log('Connected to database @ ' + db_url);
  }
});

/* Start the server already!
 * * * * * * * * * * * * * */
app.listen(3000);
console.log('Listening on port 3000.');
