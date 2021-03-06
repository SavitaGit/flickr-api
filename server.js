var express = require('express');
var app = express();
var path = require('path');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var superhero = require('./app/routes/superhero')();
var mongoose = require('mongoose');

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
mongoose.connect('mongodb://su:welcome123@ds011158.mlab.com:11158/sample2', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

//app.use(require('prerender-node').set('prerenderToken', 'fnu9gwOPhdT0b30IXLI8'));
app.use(require('prerender-node').set('prerenderServiceUrl', 'https://prerender-test402.herokuapp.com'));



//process.env.NODE_ENV = 'production';

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());            
app.use(bodyParser.json({ type: 'application/json'}));  
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded

app.use(express.static( path.join(__dirname + '/public')));
app.use('/bower_components',  express.static(path.join(__dirname + '/bower_components')));

app.route('/superhero').post(superhero.post).get(superhero.getAll);
app.route('/superhero/:id').get(superhero.getOne);

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.set('view cache', false);

var port = process.env.PORT || 1337;

app.listen(port, function(){
	console.log('listening @ port : ' + port);
});

module.exports = app;