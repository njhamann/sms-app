var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || "development";
var config = require('./../config/stripe.json')[env];
var models  = require('../models/index');
var email = require('../lib/email');

router.get('/tests', function(req, res) {
  res.render('tests/index', { stripeKey: config.publishable_key });
});

router.get('/tests/email', function(req, res) {
  email.generic({message: 'new generic message'});
  res.json({});
});

router.get('/tests/:type', function(req, res) {
  models.User.find(req.user.id)
  .success(function(user){
    res.render('tests/index', { 
      user: user,
      stripeKey: config.publishable_key, 
      type: req.params.type 
    });
  });
});


module.exports = router;
