var test = require('tape');
var fs = require('fs');
var oenyi = require('../index');
var path = require('path');
var testImages = {
  sq: { size: {width: 225, height: 225} },
  ls: { size: {width: 259, height: 194} },
  pt: { size: {width: 188, height: 269} },
};


test('should return oenyi instance', function(assert) {
  assert.plan(1);

  var image = oenyi('');
  var actual = image.constructor.name;
  var expected = 'Oenyi';

  assert.equal(actual, expected);
});

test('should chain', function(assert) {
  assert.plan(1);

  var image = oenyi('');
  var expected = 2;
  var actual;

  image.compress().resize();

  actual = image._queue.length;

  assert.equal(actual, expected);
});

test('should execute queue in order', function(assert) {
  assert.plan(1);

  var image = oenyi('');

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

  var image = oenyi('');

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
  var image = oenyi('');
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
  var image = oenyi('');

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

test('resize by contain: should calculate correct values landscape to portrait', function(assert) {
  var resizeArgs = {width: 300, height: 400, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values landscape to square', function(assert) {
  var resizeArgs = {width: 200, height: 200, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 200;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 150;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values landscape to larger ratio landscape', function(assert) {
  var resizeArgs = {width: 400, height: 200, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 267;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 200;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values landscape to smaller ratio landscape', function(assert) {
  var resizeArgs = {width: 300, height: 270, method: 'contain'};
  var image =  oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values landscape to same ratio landscape', function(assert) {
  var resizeArgs = {width: 401, height: 300, method: 'contain'};
  var image =  oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 401;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 300;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by cover: should calculate correct values landscape to square', function(assert) {
  var resizeArgs = {width: 100, height: 100, method: 'cover'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 100;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 100;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      expected = 194;
      actual = calc.crop.width;
      assert.equal(actual, expected, 'cropped width is correct');

      expected = 194;
      actual = calc.crop.height;
      assert.equal(actual, expected, 'cropped height is correct');

      expected = 33;
      actual = calc.crop.x;
      assert.equal(actual, expected, 'crop x is correct');

      expected = 0;
      actual = calc.crop.y;
      assert.equal(actual, expected, 'crop y is correct');

      assert.end();
    });
});

//From square resizing

test('resize by contain: should calculate correct values square to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 400, method: 'contain'};
  var image = oenyi('');

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

test('resize by contain: should calculate correct values  square to portrait', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 200, height: 400, method: 'contain'};
  var image = oenyi('');

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

test('resize by contain: should calculate correct values  square to landsape', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 310, method: 'contain'};
  var image = oenyi('');

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

test('resize by cover: should calculate correct values square to square', function(assert) {
  var resizeArgs = {width: 300, height: 300, method: 'cover'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 300;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');
      console.log(calc);
      assert.end();
    });
});

test('resize by cover: should calculate correct values  square to portrait', function(assert) {
  var resizeArgs = {width: 100, height: 300, method: 'cover'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 100;
      var actual = calc.resize.width;

      assert.equal(actual, expected, 'resized with is correct');

      expected = 300;
      actual = calc.resize.height;

      assert.equal(actual, expected, 'resized height is correct');

      expected = 75;
      actual = calc.crop.width;

      assert.equal(actual, expected, 'cropped width is correct');

      expected = 225;
      actual = calc.crop.height;

      assert.equal(actual, expected, 'cropped height is correct');

      expected = 75;
      actual = calc.crop.x;

      assert.equal(actual, expected, 'crop x position is correct');

      expected = 0;
      actual = calc.crop.y;

      assert.equal(actual, expected, 'crop y position is correct');
      assert.end();
    });
});

test('resize by cover: should calculate correct values  square to landscape', function(assert) {
  var resizeArgs = {width: 300, height: 150, method: 'cover'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 300;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 150;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      expected = 225;
      actual = calc.crop.width;
      assert.equal(actual, expected, 'cropped width is correct');

      expected = 113;
      actual = calc.crop.height;
      assert.equal(actual, expected, 'cropped height is correct');

      expected = 0;
      actual = calc.crop.x;
      assert.equal(actual, expected, 'crop x is correct');

      expected = 56;
      actual = calc.crop.y;
      assert.equal(actual, expected, 'crop y is correct');

      assert.end();
    });
});

// From portrait resizing

test('should resize with correct values in contain method portait to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 400, method: 'contain'};
  var image = oenyi('');

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
  var image = oenyi('');

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
  var image = oenyi('');

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
  var image = oenyi('');

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
  var image = oenyi('');

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
