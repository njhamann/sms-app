var express = require('express');
var router = express.Router();

require('./subscription')(router);
require('./user')(router);
require('./account')(router);

module.exports = router;
