// This is the wrapper for custom tests, called upon web components ready state
function runCustomTests() {
  // Place any setup steps like variable declaration and initialization here

  // This is the placeholder suite to place custom tests in
  // Use testCase(options) for a more convenient setup of the test cases
  suite('px_progress_bar_1 is created and initialized correctly', function() {
    var prog1 = Polymer.dom(document).querySelector('#px_progress_bar_1');
    test('Check that fixture is created', function(done){
      assert.isDefined(prog1);
      done();
    });
    test('Check that px_progress_bar_1 has Value attribute', function(done){
      assert.isDefined(prog1.value);
      done();
    });
    test('Check initial value of progress bar', function(done){
      assert.equal(prog1.value, '-10');
      done();
    });
    test('Check width of progress bar fill', function(done){
      assert.equal(prog1.$$('#fill').style.transform, 'scaleX(0)');
      done();
    });
  });
  suite('px_progress_bar_2 is created and initialized correctly', function() {
    var prog2 = Polymer.dom(document).querySelector('#px_progress_bar_2');
    test('Check that fixture is created', function(done){
      assert.isDefined(prog2);
      done();
    });
    test('Check that px_progress_bar_2 has Value attribute', function(done){
      assert.isDefined(prog2.value);
      done();
    });
    test('Check initial value of progress bar', function(done){
      assert.equal(prog2.value, '80');
      done();
    });
    test('Check width of progress bar fill', function(done){
      assert.equal(prog2.$$('#fill').style.transform, 'scaleX(0.8)');
      done();
    });
    test('Check that bar is striped', function(done){
      assert.isTrue(prog2.$$('#filleffect').classList.contains('striped'));
      done();
    });
  });
  suite('px_progress_bar_3 is created and initialized correctly', function() {
    var prog3 = Polymer.dom(document).querySelector('#px_progress_bar_3');
    test('Check that fixture is created', function(done){
      assert.isDefined(prog3);
      done();
    });
    test('Check that px_progress_bar_3 has Value attribute', function(done){
      assert.isDefined(prog3.value);
      done();
    });
    test('Check initial value of progress bar', function(done){
      assert.equal(prog3.value, '120');
      done();
    });
    test('Check width of progress bar fill', function(done){
      assert.equal(prog3.$$('#fill').style.transform, 'scaleX(1)');
      done();
    });
    test('Check that bar is animated', function(done){
      assert.isTrue(prog3.$$('#filleffect').classList.contains('animated'));
      done();
    });
  });
}
