var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var assert = require('assert');

var routes = require('./routes/index');
var users = require('./routes/users');
var quizzes = require('./routes/quizzes');

var operations = require('./operations');


var MONGO_URL = "mongodb://localhost:27017/quizzes";
mongoose.connect(MONGO_URL);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected to mongodb server at '+MONGO_URL);
});

// var MongoClient = require('mongodb').MongoClient, assert = require('assert');


// MongoClient.connect(MONGO_URL, function(err, db) {
//   assert.equal(err, null);
//   console.log("Connected to MongoDB server");

//   var collection = 'questions';
//   var document = {name: "Ex-machina"};
//   var update = {name: "Vikings", description: "A movie about how sexy and awesome Vikings were"};

//   operations.updateDocument(db, document, update, collection, function(result) {
//       console.log("Removed this: ");
//       console.log(result);

//     operations.findDocuments(db, collection, function(result) {
//       console.log("Heres what he have now: ");
//       console.log(result);

//       db.close();
//     });    
//   });


  // var collection = db.collection('questions');

  // collection.insertOne({name: "Ex-machina", description: "A movie about a robot chick"}, function(err, result) {
  //   assert.equal(err, null);
  //   console.log("After Insert:");
  //   console.log(result.ops);

  //   collection.find({}).toArray(function(err, docs) {
  //     assert.equal(err, null);
  //     console.log("Found:");
  //     console.log(docs);      
  //   });

  // });
// });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
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
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
