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
  pageID: '101159390522665',
  appID: '1971780353040040',
  appSecret: '9c815e2fe193c0d126597f00dde074d6',
  validationToken: 'catsarecool',
  pageToken: 'EAAcBUuOEnqgBAExugvgT349oWh1yno81qic6iQtM7fDhy4k0Ms7Nsb9v09OcIXqitZCGiUMod7cuJeBTpg5iqnzcYSthNjYvb6yOUodGgyehfieHRnUFaJ0PEtPtVAu7i9WhsZBee4eCYJiSlPE13GyBJiZCWkTcu6d8lr2l0203JapnNfk'
});

var pageToken = 'EAAcBUuOEnqgBADHjDHTbZAeLae19fT84KVD0LOe1dCdO4DGiMDoiSC43aVE0Ks5ujJkP3elWPHVf1s4yu43AVxmRZA8IqVKjfj89grZAZCGTAP43Fe7jbGZAO89e0as0HJZCs0ATh4YCS1ZBC9MLchsZCeKcuqFWPI9gLpkkaQQVX36kiJZCiZAPQ3'


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






// bot.on(	MessengerPlatform.Events.MESSAGE, function(userId, message) {
//   // add code below. 
//   var textMessage =  "You wrote ";
//   console.log("hello");
//   console.log(userId, message)
//   bot.sendTextMessage(userId, textMessage);



// });
// app.use(bot.webhook('/webhook'));


app.post('/webhook/', function(req, res, next){
	console.log(req.body);

	var messaging_events = req.body.entry[0].messaging
	for (var i = 0; i < messaging_events.length; i++) {
		var event = req.body.entry[0].messaging[i]
		var sender = event.sender.id
		console.log(sender);
		if (event.message && event.message.text) {
			var text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			console.log("trying to send something");
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));

		}
		if (event.postback) {
			var text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200));
			continue
		}
	}
	res.sendStatus(200)
});

app.get('/webhook', function (req, res) {
	console.log("challenge accepted!");
	console.log( req.query['hub.challenge'] );
	if (req.query['hub.verify_token']) {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
});

var sendTextMessage = function(sender, text) {
	console.log("sendText message function init");
	var messageData = { text: text };
	
	request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:pageToken},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })

};


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
