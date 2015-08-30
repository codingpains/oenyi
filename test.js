var test = require('tape');
var oenyim = require('./index');

test('should return oenyim instance', function(assert) {
  assert.plan(1);
  assert.timeoutAfter(5);

  var image = oenyim('');
  var actual = image.constructor.name;
  var expected = 'Oenyim';

  assert.equal(actual, expected);
});

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

test('should execute queue in order', function(assert) {
  assert.plan(1);
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
  });
});

test('should empty queue after execution', function(assert) {
  assert.plan(1);
  assert.timeoutAfter(150);

  var image = oenyim('');

  function f1(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null,1); }});
  };

  image._queue = [f1];

  image.exec(function(err, data) {
    var expected = 0;
    var actual = image._queue.length;

    assert.equal(actual, expected, 'empty queue after execution');
  });
})
