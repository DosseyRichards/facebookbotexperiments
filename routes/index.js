var express = require('express');
var router = express.Router();
var MessengerPlatform = require('facebook-bot-messenger');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/facebookHook', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
