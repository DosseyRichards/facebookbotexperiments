var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MessengerPlatform = require('facebook-bot-messenger');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var bot = MessengerPlatform.create({
  pageID: '<your page id>',
  appID: '1971780353040040',
  appSecret: '9c815e2fe193c0d126597f00dde074d6',
  validationToken: '<your validation token>',
  pageToken: 'EAAcBUuOEnqgBALZAEB8PrFrqBN25U2K8ZAigaENI1jXstA1YPR2qEs7ZC6blZCI2Dlfw0S1EZA0xQyQ3yyAjIMiv5OCPe7HUtTZACzqKiA6aIcCLeqkfMzSyXZA2N1O24B7am1cmPtODsp9pxbMSUDTgD3cZAu7DD9Rj3rwCov9IVHy5Cl2pqr0z'
});



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

app.use('/', index);
app.use('/users', users);




app.use(bot.webhook('/webhook'));
bot.on(MessengerPlatform.Events.MESSAGE, function(userId, message) {
  // add code below. 
  bot.sendTextMessage('<user id>', 'TEST');

});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
