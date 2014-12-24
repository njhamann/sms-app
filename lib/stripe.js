var stripe = require('stripe');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/stripe.json')[env];

var st = stripe(config.secret_key);

var stripeMethods = {};

stripeMethods.createCustomer = function(options, callback){
  var stripeID = config.plan_ids.basic;
  st.customers.create({
    card: options.token,
    plan: options.plan,
    email: options.email,
    description: 'email: ' + options.email
  }, function(err, customer){
    callback(err, customer);
  });
};

stripeMethods.updateCustomer = function(options, callback){
  st.customers.update(options.customerID, {
    card: options.token,
  }, function(err, customer){
    callback(err, customer);
  });
};

stripeMethods.updateSubscription = function(options, callback){
  st.customers.updateSubscription( 
    options.customerID, 
    options.subscriptionID, 
    { plan: options.plan }, 
    function(err, customer){
      callback(err, customer);
    }
  );
};

stripeMethods.cancelSubscription = function(options, callback){
  st.customers.cancelSubscription(
    options.customerID, 
    options.subscriptionID, 
    function(err, subscription){
      console.log(err);
      if(!err){
          callback(err, subscription);
      }
    }
  );
};

module.exports = stripeMethods;
