var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models  = require('../models/index');
var crypto = require('crypto');
var moment = require('moment');
var nodemailer = require('nodemailer');

// passport configuration
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.find(id).then(function(user) {
    done(null, user);
  }, function(err){
    done(err);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {
  models.User
  .find({ 
    where: { 
      email: email, 
      password: crypto.createHash('md5').update(password).digest('hex') 
    } 
  })
  .then(function(user) {
    return done(null, user);
  }, function(err){
    return done(err);
  });
}));

router.get('/log_in', function(req, res) {
  res.render('app/log_in', {});
});

router.post('/log_in', passport.authenticate('local', { 
  successRedirect: '/app',
  failureRedirect: '/log_in',
  failureFlash: true 
}));

router.get('/sign_up', function(req, res) {
  res.render('app/sign_up', {});
});

router.post('/sign_up', function(req, res) {
  req.checkBody('email', 'email is required').notEmpty().isEmail();
  req.checkBody('password', 'password is required').notEmpty();
  var errors = req.validationErrors();
  
  if(errors){
    req.flash('errors', errors);
  }else{
    var email = req.body.email;
    var pass = crypto.createHash('md5').update(req.body.password).digest('hex');
    models.User.find({
      where: {
        email: email
      }
    }).then(function(user){
      if(!user){
        //create account
        return models.Account.create();
      }else{
        res.redirect('/log_in');
      }
    }).then(function(account){
      if(account){
        return account.createUser({
          email: email,
          password: pass,
          is_verified: false
        });
      }else{
        res.redirect('/sign_up');
      }
    }).then(function(){
      res.redirect('/log_in');
    });
  }

});

router.get('/reset_password', function(req, res) {
  res.render('app/reset_password', {step: 1});
});

router.post('/reset_password', function(req, res) {
  req.checkBody('email', 'email is required').notEmpty().isEmail();
  var errors = req.validationErrors();
  if(errors){
    
    req.flash('errors', errors);
  
  }else{
  
    var currentDate = new Date().valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(currentDate + random).digest('hex');
    var expires = moment().add(1, 'days').toDate();
    var email = req.body.email;

    models.User.update({
      reset_password_token: hash,
      reset_password_expires: expires
    }, {
      where: {
        email: email
      }
    }).then(function(){
      //send email
      var transporter = nodemailer.createTransport();
      transporter.sendMail({
        from: 'support@lendingclubbalances.com',
        to: email,
        subject: 'Password Reset',
        text: 'http://104.236.87.12/reset_password/change?email=' + email + '&token=' + hash
      });
      res.redirect('/reset_password/instructions');
    }, function(err){
      res.redirect('/reset_password');
    });
  
  }

});

router.get('/reset_password/instructions', function(req, res) {
  res.render('app/reset_password', {step: 2});
});

router.get('/reset_password/change', function(req, res) {
  req.checkQuery('email', 'email is required').notEmpty().isEmail();
  req.checkQuery('token', 'token is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
 
    req.flash('errors', errors);   
  
  }else{
    
    var token = req.query.token;
    var email = req.query.email;
    res.render('app/reset_password', {
      step: 3,
      email: email,
      token: token
    });
  
  }
});

router.post('/reset_password/change', function(req, res) {
  req.checkBody('email', 'email is required').notEmpty().isEmail();
  req.checkBody('password', 'password is required').notEmpty().equals(req.body.confirm_password);
  req.checkBody('confirm_password', 'confirm password is required').notEmpty();
  req.checkBody('token', 'token is required').notEmpty();
  var errors = req.validationErrors();
  
  if(errors){
 
    req.flash('errors', errors);   
  
  }else{
  
    var token = req.body.token;
    var email = req.body.email;
    var pass = crypto.createHash('md5').update(req.body.password).digest('hex');
    var confirmPass = crypto.createHash('md5').update(req.body.confirm_password).digest('hex');  
      
    models.User.find({ 
      where: { 
        email: email, 
        reset_password_token: token
      } 
    }).then(function(user) {
      user.password = pass;
      user.reset_password_token = null;
      return user.save();
    }).then(function(user){
      if(new Date() < user.reset_password_expires){
        res.redirect('/reset_password/success');
      }else{
        res.redirect('/reset_password');
      }
    });
    
  }
});

router.get('/reset_password/success', function(req, res) {
  res.render('app/reset_password', {step: 4});
});

router.get('/log_out', function(req, res) {
  req.logout();
  res.redirect('/log_in');
});


module.exports = router;
