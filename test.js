var test = require('tape');
var oenyim = require('./index');

test('should chain', function(assert) {
  assert.plan(1);
  assert.timeoutAfter(30);

  var image = oenyim('');
  var expected = 2;
  var actual;

  image.compress().resize();

  actual = image._queue.length;

  assert.equal(actual, expected);
});

test('should execute queue in order and empty queue.', function(assert) {
  assert.plan(2);
  assert.timeoutAfter(150);

  var image = oenyim('');

  function f1(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null,1); }});
  };

  function f2(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null,2) }});
  };

  function f3(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null,3); }});
  };

  image._queue = [f1, f2, f3];
  image.exec(function(err, data) {
    var expected = 3;
    var actual = data;

    assert.equal(actual, expected, 'execution order');

    expected = 0;
    actual = image._queue.length;

    assert.equal(actual, expected, 'empty queue after execution');
  });

});
