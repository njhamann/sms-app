var models = require('./../../models');

//routes
var routes = function(router){
  router.get('/phone/create', ensureAuthenticated, create);
};

var create = function(req, res){
  req.checkQuery('number').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.json({
      success: false,
      errors: errors
    });
  }else{
    models.Phone.create({
      number: req.query.number,
    }).then(function(phone){
      res.json({
        success: true,
        phone: phone
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
