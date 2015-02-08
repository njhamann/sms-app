var models = require('./../../models');
var twilio = require('./../../lib/twilio');

//routes
var routes = function(router){
  router.get('/message/create', ensureAuthenticated, create);
};

var create = function(req, res){
  req.checkQuery('phone_id').notEmpty();
  req.checkQuery('message').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.json({
      success: false,
      errors: errors
    });
  }else{
    var userPhone;
    models.Phone.find(req.query.phone_id).then(function(phone){
      userPhone = phone;
      return models.Message.create({
        message: req.query.message,
      });
    }).then(function(message){
      return twilio.text({
        to: userPhone.number,
        body: req.query.message
      });
    }).then(function(resp){
      res.json({
        success: true,
        message: resp
      });
    });
  }
};

//private methods
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next();
  }
  res.redirect('/log_in');
}

//export
module.exports = routes;
