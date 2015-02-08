var express = require('express');
var router = express.Router();

require('./subscription')(router);
require('./user')(router);
require('./account')(router);
require('./phone')(router);
require('./message')(router);

module.exports = router;
