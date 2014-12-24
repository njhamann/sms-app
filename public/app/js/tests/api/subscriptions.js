QUnit.test( "GET /api/subscription", function( assert ) {
  var userID = 4;
  var accountID = 4;
  var done = assert.async();
  $.getJSON('/api/subscription', {
    account_id: 4 
  }, function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.equal( data.subscription, null, "Should have no subscription" );
    done();
  }); 
});

QUnit.test( "POST /api/subscription/create", function( assert ) {
  var done = assert.async();
  var number = 4242424242424242;
  var cvc = 123;
  var exp_month = 12;
  var exp_year = 2018;
  var email = 'testuser@gmail.com';
  var initialPlan = 'basic';
  var userID = 4;
  var accountID = 4;
  
  
  Stripe.card.createToken({
    number: number,
    cvc: cvc,
    exp_month: exp_month,
    exp_year: exp_year
  }, function(status, response){
    assert.equal( status, 200, "Stripe respond with status 200" );
    assert.ok(response.id, 'Stripe responded with token');
    $.post('/api/subscription/create', {
      account_id: accountID,
      token: response.id,
      email: email,
      plan: initialPlan
    }, function(data){
      assert.equal( data.success, true, 'Success equals true' );
      assert.ok( data.subscription, 'returned our subscription' );
      assert.ok( data.customer, 'returned customer' );
      assert.equal( data.customer.subscriptions.data.length, 1, 'has only one subscription' );
      assert.equal( data.customer.subscriptions.data[0].plan.id, 'basic', 'Subscribed to the basic plan' );
      assert.equal( data.customer.cards.data[0].last4, '4242', 'Last 4 digits of card equal 4242' );
      done();
      //updateSubscription(data.customer.id, data.subscription.stripe_subscription_id);
    }, 'json');
  });
});

QUnit.test( "POST /api/subscription/update_plan", function( assert ) {
  var done = assert.async();
  var upgradePlan = 'ultimate';
  var accountID = 4;
  
  $.getJSON('/api/subscription', {
    account_id: 4 
  }).then(function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.ok( data.subscription, "Should return a subscription" );
    return $.post('/api/subscription/update_plan', {
      customer_id: data.subscription.stripe_customer_id,
      subscription_id: data.subscription.stripe_subscription_id,
      plan: upgradePlan
    }, 'json');
  }).then(function(data){
    assert.equal( data.success, true, 'Update success equals true' );
    assert.ok( data.subscription, 'returned our subscription' );
    assert.equal( data.subscription.plan, 'ultimate', 'new plan equals ultimate' );
    done(); 
  }); 
});

QUnit.test( "POST /api/subscription/update_card", function( assert ) {
  var done = assert.async();
  var second_number = 4012888888881881;
  var second_cvc = 321;
  var second_exp_month = 12;
  var second_exp_year = 2017;
  var customerID;
  var userID = 4;
  var accountID = 4;
  
  Stripe.card.createToken({
    number: second_number,
    cvc: second_cvc,
    exp_month: second_exp_month,
    exp_year: second_exp_year
  }, function(status, response){
    assert.equal( status, 200, "Stripe respond with status 200" );
    assert.ok(response.id, 'Stripe responded with token');
    
    $.getJSON('/api/subscription', {
      account_id: 4 
    }).then(function(data, stat, xhr){
      assert.equal( xhr.status, 200, "Respond with status 200" );
      assert.ok( data.subscription, "Should return a subscription" );
      return $.post('/api/subscription/update_card', {
        customer_id: data.subscription.stripe_customer_id,
        token: response.id
      }, 'json');
    }).then(function(data){
      assert.equal( data.success, true, 'Update success equals true' );
      assert.ok( data.subscription, 'returned our subscription' );
      assert.ok( data.customer, 'returned customer' );
      assert.equal( data.customer.subscriptions.data.length, 1, 'has only one subscription' );
      assert.equal( data.customer.cards.data[0].last4, '1881', 'Last 4 digits of card equal 1881' );
      done();
    });
  });
});

QUnit.test( "POST /api/subscription/cancel", function( assert ) {
  var done = assert.async();
  var userID = 4;
  var accountID = 4;
  
  $.getJSON('/api/subscription', {
    account_id: 4 
  }).then(function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.ok( data.subscription, "Should return a subscription" );
    return $.post('/api/subscription/cancel', {
      customer_id: data.subscription.stripe_customer_id,
      subscription_id: data.subscription.stripe_subscription_id
    }, 'json');
  }).then(function(data){
    assert.equal( data.success, true, 'Subscription was canceled' );
    assert.ok( data.subscription, 'returned subscription' );
    done();
  });
});
