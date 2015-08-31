var test = require('tape');
var fs = require('fs');
var oenyim = require('../index');
var path = require('path');
var testImages = {
  sq: {
    filename: path.join(__dirname, './assets/ssj-sq.jpeg'),
    size: {width: 225, height: 225}
  },
  ls: {
    filename: path.join(__dirname, './assets/ssj-ls.jpeg'),
    size: {width: 259, height: 194}
  },
  pt: {
    filename: path.join(__dirname, './assets/ssj-pt.jpeg'),
    size: {width: 188, height: 269}
  },
};


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

test('should return instance of error on failing exec', function(assert) {
  assert.plan(1);
  var image = oenyim('');
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
  var image = oenyim('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
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

//From landscape resizing

test('should resize with correct values in contain method landscape to portrait', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 300, height: 400, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method landscape to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 200, height: 200, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 200;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 150;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method landscape to larger ratio landscape', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 200, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 267;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 200;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method landscape to smaller ratio landscape', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 300, height: 270, method: 'contain'};
  var image =  oenyim('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

//From square resizing

test('should resize with correct values in contain method square to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 400, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 400;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 400;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method square to portrait', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 200, height: 400, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 200;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 200;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method square to landsape', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 310, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 310;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 310;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

// From portrait resizing

test('should resize with correct values in contain method portait to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 400, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.pt.size.width, height: testImages.pt.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 280;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 400;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method portait to portrait with smaller ratio', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 200, height: 800, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.pt.size.width, height: testImages.pt.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 200;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 286;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method portait to portrait with bigger ratio', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 700, height: 800, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.pt.size.width, height: testImages.pt.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 559;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 800;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method portait to portrait with same ratio', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 559, height: 800, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.pt.size.width, height: testImages.pt.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 559;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 800;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});

test('should resize with correct values in contain method portait to landscape', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 600, height: 380, method: 'contain'};
  var image = oenyim('');

  image._size = {width: testImages.pt.size.width, height: testImages.pt.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 266;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 380;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
    });
});
