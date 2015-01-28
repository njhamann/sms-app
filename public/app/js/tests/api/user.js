QUnit.test( "GET /api/user", function( assert ) {
  var userID = 1;
  var accountID = 1;
  var done = assert.async();
  $.getJSON('/api/user', {
    user_id: userID
  }).then(function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.ok( data.user, "found user" );
    done();
  }); 
});

QUnit.test( "POST /api/user/create", function( assert ) {
  var userID = 1;
  var done = assert.async();
  $.post('/api/user/create', {
    user_id: userID,
    email: 'tester@gmail.com',
    password: 'hello', 
    confirm_password: 'hello' 
  }, function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.ok( data.user, 'Should have a user' );
    done();
  }); 
});
