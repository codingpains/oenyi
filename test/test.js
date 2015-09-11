var test = require('tape');
var fs = require('fs');
var oenyi = require('../index');
var buffer = fs.readFileSync(__dirname + '/assets/ssj-sq.jpeg');
var testImages = {
  sq: {
    size: {
      width: 225,
      height: 225
    }
  },
  ls: {
    size: {
      width: 259,
      height: 194
    }
  },
  pt: {
    size: {
      width: 188,
      height: 269
    }
  }
};

test('should return oenyi instance', function(assert) {
  var image = oenyi('');
  var actual = image.constructor.name;
  var expected = 'Oenyi';

  assert.equal(actual, expected);
  assert.end();
});

test('should recieve buffer', function(assert) {
  var image = oenyi(buffer);
  var actual = image.constructor.name;
  var expected = 'Oenyi';

  assert.equal(actual, expected);
  assert.end();
});

test('should receive null', function(assert) {
  var image = oenyi(null);
  var actual = image.constructor.name;
  var expected = 'Oenyi';

  assert.equal(actual, expected);
  assert.end();
});

test('should receive undefined', function(assert) {
  var image = oenyi();
  var actual = image.constructor.name;
  var expected = 'Oenyi';

  assert.equal(actual, expected);
  assert.end();
});

test('should throw error if argument is a number', function(assert) {
  var error;
  var image;
  var actual;
  var expected;
  try {
    image = oenyi(2);
  } catch(err) {
    error = err;
  }

  actual = error ? error.constructor.name : 'nope';
  expected = 'BadArgumentError';
  assert.equal(actual, expected);

  actual = !!image;
  expected = false;
  assert.equal(actual, expected);

  assert.end();
});

test('should throw error if argument is true', function(assert) {
  var error;
  var image;
  var actual;
  var expected;
  try {
    image = oenyi(true);
  } catch(err) {
    error = err;
  }

  actual = error ? error.constructor.name : 'nope';
  expected = 'BadArgumentError';
  assert.equal(actual, expected);

  actual = !!image;
  expected = false;
  assert.equal(actual, expected);

  assert.end();
});

test('should throw error if argument is an object', function(assert) {
  var error;
  var image;
  var actual;
  var expected;
  try {
    image = oenyi({});
  } catch(err) {
    error = err;
  }

  actual = error ? error.constructor.name : 'nope';
  expected = 'BadArgumentError';
  assert.equal(actual, expected);

  actual = !!image;
  expected = false;
  assert.equal(actual, expected);

  assert.end();
});

test('should throw error if argument is an array', function(assert) {
  var error;
  var image;
  var actual;
  var expected;
  try {
    image = oenyi([]);
  } catch(err) {
    error = err;
  }

  actual = error ? error.constructor.name : 'nope';
  expected = 'BadArgumentError';
  assert.equal(actual, expected);

  actual = !!image;
  expected = false;
  assert.equal(actual, expected);

  assert.end();
});

test('should throw error if argument is a function', function(assert) {
  var error;
  var image;
  var actual;
  var expected;
  try {
    image = oenyi(function() {});
  } catch(err) {
    error = err;
  }

  actual = error ? error.constructor.name : 'nope';
  expected = 'BadArgumentError';
  assert.equal(actual, expected);

  actual = !!image;
  expected = false;
  assert.equal(actual, expected);

  assert.end();
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
  var image = oenyi('');

  function f1(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null, 1); }});
  };

  function f2(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null, 2); }});
  };

  function f3(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null, 3); }});
  };

  image._queue = [f1, f2, f3];
  image.exec(function(error, data) {
    if (error) return assert.fail('unexpected error');
    var expected = 3;
    var actual = data;

    assert.equal(actual, expected, 'execution order');
    assert.end();
  });
});

test('should empty queue after execution', function(assert) {
  var image = oenyi('');

  function f1(fn) {
    fn(null, {toBuffer: function(mime, cb) { return cb(null, 1); }});
  };

  image._queue = [f1];

  image.exec(function(error, data) {
    if (error) return assert.fail('unexpected error');
    var expected = 0;
    var actual = image._queue.length;

    assert.equal(actual, expected, 'empty queue after execution');
    assert.end();
  });
});

test('should return instance of error on failing exec', function(assert) {
  var image = oenyi('');

  function fail(fn) {
    var error = new Error('This function failed!');
    fn(error, null, null);
  };

  image._queue = [fail];
  image.exec(function(error, data) {
    if (error) {
      var expected = typeof error;
      var actual = typeof error;

      assert.equal(actual, expected, 'return error when exec failed');
      assert.end();
    } else {
      return assert.fail('expected error, got nothing');
    }
  });
});

test('should apply just resize when method is fit', function(assert) {
  var resizeArgs = {width: 300, height: 400, method: 'fit'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(error, buffer, calc) {
      if (error) return assert.fail('unexpected error');
      var keyNames = Object.keys(calc);
      var expected = 1;
      var actual = keyNames.length;

      assert.equal(actual, expected, 'responds with just one key');

      expected = 'resize';
      actual = keyNames[0];

      assert.equal(actual, expected, 'applied resize');
      assert.end();
    });
});

// From landscape resizing
test('resize by fit: should calculate correct values landscape to portrait', function(assert) {
  var resizeArgs = {width: 300, height: 400, method: 'fit'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(error, buffer, calc) {
      if (error) return assert.fail('unexpected error');
      var expected = 300;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit: should calculate correct values landscape to square', function(assert) {
  var resizeArgs = {width: 200, height: 200, method: 'fit'};
  var image = oenyi('');

  image._size = {width: testImages.ls.size.width, height: testImages.ls.size.height};

  image.resize(resizeArgs)
    .exec(function(error, buffer, calc) {
      if(error) return assert.fail('unexpected error');
      var expected = 200;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 150;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit: should calculate correct values landscape to larger ratio landscape', function(assert) {
  var resizeArgs = {width: 400, height: 200, method: 'fit'};
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

test('resize by fit: should calculate correct values landscape to smaller ratio landscape', function(assert) {
  var resizeArgs = {width: 300, height: 270, method: 'fit'};
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

test('resize by fit: should calculate correct values landscape to same ratio landscape', function(assert) {
  var resizeArgs = {width: 401, height: 300, method: 'fit'};
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

// Resize by Contain:
test('resize by contain: should caclulate correct values landscape to smaller landscape', function(assert) {
  var resizeArgs = {width: 500, height: 255, method: 'contain'};
  var image =  oenyi('');

  image._size = {width: 3000, height: 600};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 500;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 100;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should caclulate correct values landscape to bigger landscape', function(assert) {
  var resizeArgs = {width: 6000, height: 4500, method: 'contain'};
  var image =  oenyi('');

  image._size = {width: 3000, height: 600};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 3000;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 600;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values landscape to portait (example case)', function(assert) {
  var resizeArgs = {width: 1000, height: 2000, method: 'contain'};
  var image = oenyi('');

  image._size = {width: 5000, height: 3000};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 1000;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 600;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

//From square resizing

//By Contain
test('resize by contain: should calculate correct values square to smaller square', function(assert) {
  var resizeArgs = {width: 10, height: 10, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 10;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 10;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values square to bigger square', function(assert) {
  var resizeArgs = {width: 500, height: 500, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 225;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values square to smaller landsape', function(assert) {
  var resizeArgs = {width: 100, height: 20, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 20;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 20;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values square to equal landsape', function(assert) {
  var resizeArgs = {width: 300, height: 225, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 225;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values square to bigger landsape', function(assert) {
  var resizeArgs = {width: 500, height: 300, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 225;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values square to smaller portrait', function(assert) {
  var resizeArgs = {width: 100, height: 300, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 100;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 100;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by contain: should calculate correct values square to equal portrait', function(assert) {
  var resizeArgs = {width: 225, height: 300, method: 'contain'};
  var image = oenyi('');

  image._size = {width: testImages.sq.size.width, height: testImages.sq.size.height};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 225;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

// By Fit
test('resize by fit: should calculate correct values square to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 400, method: 'fit'};
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

test('resize by fit: should calculate correct values  square to portrait', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 200, height: 400, method: 'fit'};
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

test('resize by fit: should calculate correct values square to landsape', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 310, method: 'fit'};
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

// By Cover
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

// To fit
test('should resize with correct values in fit method portait to square', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 400, height: 400, method: 'fit'};
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

test('should resize with correct values in fit method portait to portrait with smaller ratio', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 200, height: 800, method: 'fit'};
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

test('should resize with correct values in fit method portait to portrait with bigger ratio', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 700, height: 800, method: 'fit'};
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

test('should resize with correct values in fit method portait to portrait with same ratio', function(assert) {
  assert.plan(2);
  var resizeArgs = {width: 559, height: 800, method: 'fit'};
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

test('should resize with correct values in fit method portait to square (example case)', function(assert) {
  var resizeArgs = {width: 1024, height: 1024, method: 'fit'};
  var image = oenyi('');

  image._size = {width: 640, height: 2560};

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 256;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 1024;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('should resize with correct values in fit method portait to landscape', function(assert) {
  var resizeArgs = {width: 600, height: 380, method: 'fit'};
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

      assert.end();
    });
});


// Compression

test('compress: should return max quality', function(assert) {
  var image = oenyi();

  image._format = 'png'; // Mocking images might return gif
  image.compress({quality: 75})
    .exec(function(err, buffer, calc) {
      console.log(err);
      var expected = 75;
      var actual = calc.compress.quality;
      assert.equal(actual, expected, 'compress quality is correct');

      assert.end();
    });
});

test('compress: should return COMPRESSION_ERROR if called on GIF', function(assert) {
  var image = oenyi();

  image._format = 'gif';
  image.compress({quality: 75})
    .exec(function(err, buffer, calc) {
      var expected = 'CompressionError';
      var actual = err.name;
      assert.equal(actual, expected, 'compress format chech is correct');

      assert.end();
    });
});

test('to jpeg: should return to jpeg format', function(assert) {
  var image = oenyi();

  image.toJPG()
    .exec(function(err, buffer, calc) {
      var expected = 'jpg';
      var actual = calc.convert.toFormat;
      assert.equal(actual, expected);

      assert.end();
    });
});
