var test = require('tape');
var fs = require('fs');
var oenyim = require('../index');
var path = require('path');
var imagePath = path.join(__dirname, './assets/ssj.jpeg');
var origSize = {width: 259, height: 194};

test('should return oenyim instance', function(assert) {
  assert.plan(1);

  var image = oenyim('');
  var actual = image.constructor.name;
  var expected = 'Oenyim';

  assert.equal(actual, expected);
});

test('should chain', function(assert) {
  assert.plan(1);

  var image = oenyim('');
  var expected = 2;
  var actual;

  image.compress().resize();

  actual = image._queue.length;

  assert.equal(actual, expected);
});

test('should execute queue in order', function(assert) {
  assert.plan(1);

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
});

test('should return Buffer and transformations object on sucessful exec', function(assert) {
  assert.plan(3);
  var image = oenyim(imagePath);
  var buff = new Buffer(1);

  image
    .resize({width: 200, height: 200, method: 'contain'})
    .exec(function(err, buffer, tfs) {
      assert.equals(err, null, 'exec succeded');

      var expected = typeof buff;
      var actual = typeof buffer;

      assert.equal(actual, expected, 'exec callback first data argument is a buffer');

      expected = 'object';
      actual = typeof tfs;

      assert.equal(actual, expected, 'exec callback second data argument is an object');
    });
});

test('should return instance of error on failing exec', function(assert) {
  assert.plan(1);
  var image = oenyim(imagePath);
  var error = new Error();

  function fail(fn) {
    fn(new Error);
  };

  image._queue = [fail];
  image.exec(function(err, data) {
    var expected = typeof error;
    var actual = typeof err;

    assert.equal(actual, expected, 'return error when exec failed');
  });
});

test('should apply just resize when method is contain', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 300, height: 400, method: 'contain'};

  oenyim(imagePath)
    .resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var keyNames = Object.keys(calc);
      var expected = 1;
      var actual = keyNames.length;

      assert.equal(actual, expected, 'responds with just one key');

      expected = 'resize';
      actual = keyNames[0];

      assert.equal(actual, expected, 'applied resize');
    });
});

test('should resize with correct values in contain method', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 300, height: 400, method: 'contain'};

  oenyim(imagePath)
    .resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});
