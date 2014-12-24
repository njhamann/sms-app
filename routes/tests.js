var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || "development";
var config = require('./../config/stripe.json')[env];

router.get('/tests', function(req, res) {
  res.render('app/tests', { stripeKey: config.publishable_key });
});

module.exports = router;
