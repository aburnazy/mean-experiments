var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var assert = require('assert');

// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var FileStore = require('session-file-store')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config');
// var auth = require('./auth');

var routes = require('./routes/index');
var admin = require('./routes/admin');
var users = require('./routes/users');
var quizzes = require('./routes/quizzes');

var operations = require('./operations');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected to mongodb server at '+config.mongoUrl);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// app.use(cookieParser(config.secretKey));
// app.use(session({
//   name: 'session-id',
//   secret: config.secretKey,
//   saveUninitialized: true,
//   resave: true,
//   store: new FileStore()
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(auth);

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', admin);
app.use('/users', users);
app.use('/quizzes', quizzes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
  if(err.status == 401) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic',
      'Content-Type': 'text/plain'
    });

    res.end("<b>"+err.status+" "+err.message+"</b>");
  } else {
    res.status(err.status || 500);

    res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });      
  }
});


module.exports = app;
