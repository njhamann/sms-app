//includes
var crypto = require('crypto');
var stripe = require('./../../lib/stripe');
var models = require('./../../models');
var err = require('./../../lib/error-handling');

//routes
var routes = function(router){
  router.get('/user', ensureAuthenticated, get);
  router.post('/user/create', ensureAuthenticated, create);
  router.post('/user/update', ensureAuthenticated, update);
  router.post('/user/update_password', ensureAuthenticated, updatePassword);
  router.post('/user/delete', ensureAuthenticated, remove);
};

var get = function(req, res){
  req.checkQuery('user_id', 'user_id is required').notEmpty().equals(req.user.id);
  var errors = req.validationErrors();
  if(errors){
    res.json({ 
      success: false,
      errors: errors
    });
  }else{
    models.User
    .find(req.query.user_id)
    .success(function(user){
      res.json({ 
        success: true,
        user: user
      });
    })
    .error(err.model(res));
  }
};

var create = function(req, res){
  req.checkBody('user_id').notEmpty().equals(req.user.id);
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty().equals(req.body.confirm_password);
  req.checkBody('confirm_password', 'confirm_password is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    res.json({
      success: false,
      errors: errors
    });
  }else{
    var email = req.body.email;
    var pass = crypto.createHash('md5').update(req.body.password).digest('hex');
    models.User.find({
      where: {
        email: email
      }
   }).then(function(user){
      if(!user){
        return models.User.create({
          email: email,
          password: pass,
          is_verified: false
        });
      }
    }).then(function(user){
      res.json({
        success: true,
        user: user
      });
    });
  }
};

var update = function(req, res){
  req.checkQuery('user_id', 'user_id is required').notEmpty().equals(req.user.id);
  var errors = req.validationErrors();
  if(errors){
    res.json({ 
      success: false,
      errors: errors
    });
  }else{
    models.User
    .find(req.body.user_id)
    .success(function(user){
        user.email = req.body.email || user.email;
    })
    .error(err.model(res));
  }
};

var updatePassword = function(req, res){
    
  req.checkQuery('user_id', 'user_id is required').notEmpty().equals(req.user.id);
  req.checkBody('current_password', 'your current password is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty().equals(req.body.confirm_password);
  req.checkBody('confirm_password', 'confirm password is required').notEmpty();
  if(errors){
    req.flash('errors', errors);   
  }else{
    var currentPass = crypto.createHash('md5').update(req.body.password).digest('hex');
    var pass = crypto.createHash('md5').update(req.body.password).digest('hex');
    models.User.find({ 
      where: { 
        id: req.body.user_id,
        password: currentPass
      } 
    }).then(function(user) {
        user.password = pass;
        return user.save();
    }).success(function(user){
        res.json({ 
          success: true,
          user: user
        });
    });
  }
};

var remove = function(req, res){
  req.checkQuery('user_id', 'user_id is required').notEmpty().equals(req.user.id);
  if(errors){
    req.flash('errors', errors);   
  }else{
    models.User.find(req.body.user_id).then(function(user) {
      return user.destroy();
    }).success(function(user){
      res.json({ 
        success: true,
        user: user
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
