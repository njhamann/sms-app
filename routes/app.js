var express = require('express');
var router = express.Router();
var models  = require('../models/index');

router.get('/app', ensureAuthenticated, function(req, res) {
  models.User.find(req.user.id).then(function(user){
    return user.getAccount().then(function(account){
      req.session.user = user.values;
      req.session.account = account.values;
      res.render('app/app', {
        data: {
          account: account,
          user: user
        }
      });
    });
  });
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next();
  }
  res.redirect('/log_in')
}

module.exports = router;
