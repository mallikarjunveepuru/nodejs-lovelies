var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var sessions = require('client-sessions');
var app = express();


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


/* Set-up Express
 * * * * * * * * */
app.set('views', './views');
app.set('view engine', 'jade');

/* Express middle-ware
 * * * * * * * * * * */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(sessions({
  cookieName: 'session',
  secret: 'mf984na89nap98vn8n9o87v43wsa',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));
app.use(express.static('./public'));


/* Set-up routes
 * * * * * * * * * * * */
var router = require('./routes/router');
app.get('/', router.index);
app.get('/index.html', router.index);
app.get('/band', router.index);
app.get('/shows', router.index);
app.get('/contact', router.index);
app.get('/admin', router.index);
app.get('/admin/*', router.index);
app.get('/api/partials/:id', router.partials);

// User login for admin-panel
app.get('/api/admin', router.admin);
app.post('/api/admin/login', router.login);
app.get('/api/admin/logout', router.logout);
app.post('/api/admin/register', router.register);

//app.all('/song', router.song);
app.get('/api/email', router.sendEmail);

// show and song database routes
app.get('/api/show', router.getShows);
app.get('/api/show/:id', router.getOneShow);
app.post('/api/show', router.postShow);
app.put('/api/show/:id', router.updateShow);
app.delete('/api/show/:id', router.deleteShow);
app.get('/api/song', router.getSongs);
app.get('/api/song/:id', router.getOneSong);
app.post('/api/song', router.postSong);
app.put('/api/song/:id', router.updateSong);
app.delete('/api/song/:id', router.deleteSong);

app.use(router.error);

/* Start the server already!
 * * * * * * * * * * * * * */
app.listen(3000);
console.log('Listening on port 3000.');
