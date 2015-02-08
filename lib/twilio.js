var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/twilio.json')[env];
var client = require('twilio')(config.account_sid, config.auth_token);
var methods = {};

methods.text = function(options){
  options.from = options.from_number || config.from_number;
  return client.sendMessage(options);
};

module.exports = methods;
