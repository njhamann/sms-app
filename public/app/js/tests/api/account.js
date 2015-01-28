var namespace = account;
QUnit.test( 'GET /api/' + namespace, function( assert ) {
  var done = assert.async();
  $.getJSON('/api/' + namespace + '/' + globals.user.AccountId).then(function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.ok( data.account, ' found ' + namespace );
    done();
  }); 
});

QUnit.test( 'POST /api/' + namespace, function( assert ) {
  var userID = 1;
  var done = assert.async();
  $.post('/api/' + namespace, function(data, stat, xhr){
    assert.equal( xhr.status, 200, "Respond with status 200" );
    assert.ok( data.account, 'Should have a ' + namespace );
    done();
  }); 
});

QUnit.test( 'POST /api/' + namespace + '/:id/update', function( assert ) {
  var done = assert.async();
  $.post('/api/' + namespace + '/' + globals.user.AccountId + '/update', {
    name: 'test name'
  }).then(function(data, stat, xhr){
    assert.equal( xhr.status, 200, 'Respond with status 200' );
    assert.ok( data.account, 'found ' + namespace );
    assert.equal( data.account.name, 'test name', 'account name changed' );
    done();
  }); 
});
