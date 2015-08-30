var test = require('tape');
var oenyim = require('./index');

test('should chain', function(assert) {
  assert.plan(1);
  var image = oenyim('');
  var expected = 2;
  var actual;

  image.compress().resize();

  actual = image._queue.length;

  assert.equals(actual, expected);
});
