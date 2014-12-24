var express = require('express');
var router = express.Router();
var subscriptions = require('./subscription')(router);
module.exports = router;
