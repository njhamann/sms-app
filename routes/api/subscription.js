//includes
var stripe = require('./../../lib/stripe');
var models = require('./../../models');

//routes
var routes = function(router){
  router.get('/subscription', ensureAuthenticated, get);
  router.post('/subscription/create', ensureAuthenticated, create);
  router.post('/subscription/update_plan', ensureAuthenticated, updateSubscription);
  router.post('/subscription/update_card', ensureAuthenticated, updateCard);
  router.post('/subscription/cancel', ensureAuthenticated, cancel);
};

//actions
var get = function(req, res){
  var accountID = req.body.account_id;
  req.checkQuery('account_id', 'account_id is required').notEmpty()
  var errors = req.validationErrors();
  if(!errors){
    models.Subscription
    .find({ AccountId: accountID })
    .then(function(subscription){
      res.json({ 
        success: true,
        subscription: subscription
      });
    });
  }else{
    res.json({ 
      success: false,
      errors: errors
    });
  }
};

var create = function(req, res){

  var email = req.body.email;
  var plan = req.body.plan;
  var token = req.body.token;
  stripe.createCustomer({
    token: token,
    plan: plan,
    email: email
  }, function(err, customer){
    var card = customer.cards.data[0];
    var cardDescription = (card.type || 'Credit card') + ' ending in ' + card.last4;  
    models.Subscription.create({
      stripe_customer_id: customer.id, 
      stripe_subscription_id: customer.subscriptions.data[0].id, 
      card_description: cardDescription,
      plan: plan,
      is_active: true,
      AccountId: req.user.AccountId
    }).then(function(subscription){
      res.json({ 
        success: true,
        subscription: subscription,
        customer: customer
      });
    });
  
  });
};

var updateSubscription = function(req, res){
  var customerID = req.body.customer_id;
  var subscriptionID = req.body.subscription_id;
  var plan = req.body.plan;
  stripe.updateSubscription({
    customerID: customerID,
    subscriptionID: subscriptionID,
    plan: plan
  }, function(err, stripeSubscription) {
    models.Subscription.find( { 
      where: { 
        stripe_customer_id: customerID 
      } 
    } ).then( function(subscription) { 
      subscription.plan = plan;
      subscription.stripe_subscription_id = stripeSubscription.id;
      return subscription.save();
    } ).then( function(subscription) {
      res.json( { 
        success: true,
        subscription: subscription
      } );
    } );
  });
};

var updateCard = function(req, res){
  var customerID = req.body.customer_id;
  var token = req.body.token;

  stripe.updateCustomer({
    customerID: customerID,
    token: token
  }, function(err, customer){
    
    var card = customer.cards.data[0];
    var cardDescription = (card.type || 'Credit card') + ' ending in ' + card.last4;  

    models.Subscription.find( { 
      where: { 
        stripe_customer_id: customerID 
      } 
    } ).then( function(subscription) { 
      subscription.card_description = cardDescription;
      return subscription.save();
    } ).then( function(subscription) {
      res.json({ 
        success: true,
        customer: customer,
        subscription: subscription
      });
    } );
  
  });
};

var cancel = function(req, res){
  var customerID = req.body.customer_id;
  var subscriptionID = req.body.subscription_id;

  stripe.cancelSubscription({
    customerID: customerID, 
    subscriptionID: subscriptionID
  }, function(err, subscription){
    models.Subscription.find( { 
      where: { 
        stripe_customer_id: customerID 
      } 
    } ).then( function(subscription) { 
      return subscription.destroy();
    } ).then( function() {
      res.json({ 
        success: true,
        subscription: subscription
      });
    } );
    
  });
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
