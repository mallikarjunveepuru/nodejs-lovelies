var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
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


/* Set-up routes
 * * * * * * * * * * * */
var index = require('./routes/index');
app.use('/', index);
var song = require('./routes/song');
app.use('/song', song);


/* Static router and error page
 * * * * * * * */
app.use('/', express.static('./public'));
var error = require('./routes/error');
app.use(error);


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
