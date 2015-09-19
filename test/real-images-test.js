var test = require('tape');
var fs = require('fs');
var WriteStream = require('memory-streams').WritableStream;
var oenyi = require('../index');
var path = require('path');
var testImages = {
  sq: {
    filename: path.join(__dirname, './assets/ssj-sq.jpeg'),
    buffer: fs.readFileSync(__dirname + '/assets/ssj-sq.jpeg'),
    size: {width: 225, height: 225}
  },
  ls: {
    filename: path.join(__dirname, './assets/ssj-ls.jpeg'),
    buffer: fs.readFileSync(__dirname + '/assets/ssj-ls.jpeg'),
    size: {width: 259, height: 194}
  },
  pt: {
    filename: path.join(__dirname, './assets/ssj-pt.jpeg'),
    buffer: fs.readFileSync(__dirname + '/assets/ssj-pt.jpeg'),
    size: {width: 188, height: 269}
  },
  gif: {
    filename: path.join(__dirname, './assets/ssj.gif'),
    buffer: fs.readFileSync(__dirname + '/assets/ssj.gif'),
  }
};

//From landscape resizing

test('resize by fit: should calculate correct values landscape to portrait', function(assert) {
  var resizeArgs = {width: 300, height: 400, method: 'fit'};
  var image = oenyi(testImages.ls.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 300;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values landscape to portrait', function(assert) {
  var resizeArgs = {width: 300, height: 400, method: 'fit'};
  var image = oenyi(testImages.ls.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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
  var image = oenyi(testImages.ls.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 200;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 150;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values landscape to square', function(assert) {
  var resizeArgs = {width: 200, height: 200, method: 'fit'};
  var image = oenyi(testImages.ls.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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
  var image = oenyi(testImages.ls.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 267;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 200;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values landscape to larger ratio landscape', function(assert) {
  var resizeArgs = {width: 400, height: 200, method: 'fit'};
  var image = oenyi(testImages.ls.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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
  var image = oenyi(testImages.ls.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 300;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 225;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values landscape to smaller ratio landscape', function(assert) {
  var resizeArgs = {width: 300, height: 270, method: 'fit'};
  var image = oenyi(testImages.ls.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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
  var image = oenyi(testImages.ls.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 401;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 300;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values landscape to same ratio landscape', function(assert) {
  var resizeArgs = {width: 401, height: 300, method: 'fit'};
  var image = oenyi(testImages.ls.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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
  var image = oenyi(testImages.ls.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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

test('resize by cover (buffer): should calculate correct values landscape to square', function(assert) {
  var resizeArgs = {width: 100, height: 100, method: 'cover'};
  var image = oenyi(testImages.ls.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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

test('resize by fit: should calculate correct values square to square', function(assert) {
  var resizeArgs = {width: 400, height: 400, method: 'fit'};
  var image = oenyi(testImages.sq.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 400;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 400;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values square to square', function(assert) {
  var resizeArgs = {width: 400, height: 400, method: 'fit'};
  var image = oenyi(testImages.sq.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      var expected = 400;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 400;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit: should calculate correct values square to portrait', function(assert) {
  var resizeArgs = {width: 200, height: 400, method: 'fit'};
  var image = oenyi(testImages.sq.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 200;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 200;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values square to portrait', function(assert) {
  var resizeArgs = {width: 200, height: 400, method: 'fit'};
  var image = oenyi(testImages.sq.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 200;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 200;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit: should calculate correct values  square to landsape', function(assert) {
  var resizeArgs = {width: 400, height: 310, method: 'fit'};
  var image = oenyi(testImages.sq.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 310;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 310;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by fit (buffer): should calculate correct values  square to landsape', function(assert) {
  var resizeArgs = {width: 400, height: 310, method: 'fit'};
  var image = oenyi(testImages.sq.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 310;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 310;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('resize by cover: should calculate correct values square to square', function(assert) {
  var resizeArgs = {width: 300, height: 300, method: 'cover'};
  var image = oenyi(testImages.sq.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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

test('resize by cover (buffer): should calculate correct values square to square', function(assert) {
  var resizeArgs = {width: 300, height: 300, method: 'cover'};
  var image = oenyi(testImages.sq.buffer);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

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

// From portrait resizing

test('should resize with correct values in fit method portait to square', function(assert) {
  var resizeArgs = {width: 400, height: 400, method: 'fit'};
  var image = oenyi(testImages.pt.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 280;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 400;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

test('should resize with correct values in fit method portait to portrait with smaller ratio', function(assert) {
  var resizeArgs = {width: 200, height: 800, method: 'fit'};
  var image = oenyi(testImages.pt.filename);

  image.resize(resizeArgs)
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 200;
      var actual = calc.resize.width;
      assert.equal(actual, expected, 'resized with is correct');

      expected = 286;
      actual = calc.resize.height;
      assert.equal(actual, expected, 'resized height is correct');

      assert.end();
    });
});

// Compression

test('compress: should return max quality', function(assert) {
  var image = oenyi(testImages.sq.filename);

  image.compress({quality: 75})
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 75;
      var actual = calc.compress.quality;
      assert.equal(actual, expected, 'compress quality is correct');

      assert.end();
    });
});

test('compress (buffer): should return max quality', function(assert) {
  var image = oenyi(testImages.sq.buffer);

  image.compress({quality: 75})
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 75;
      var actual = calc.compress.quality;
      assert.equal(actual, expected, 'compress quality is correct');

      assert.end();
    });
});

test('compress: should return CompressionError if called on GIF', function(assert) {
  var image = oenyi(testImages.gif.filename);

  image.compress({quality: 75})
    .exec(function(err, buffer, calc) {
      assert.notOk(buffer, 'should not return buffer');
      assert.ok(err, 'should throw');

      var expected = 'CompressionError';
      var actual = err.name;
      assert.equal(actual, expected, 'compress format chech is correct');

      assert.end();
    });
});

test('compress (buffer): should return CompressionError if called on GIF', function(assert) {
  var image = oenyi(testImages.gif.buffer);

  image.compress({quality: 75})
    .exec(function(err, buffer, calc) {
      assert.notOk(buffer, 'should not return buffer');
      assert.ok(err, 'should throw');

      var expected = 'CompressionError';
      var actual = err.name;
      assert.equal(actual, expected, 'compress format chech is correct');

      assert.end();
    });
});

test('to jpeg: should return to jpeg format', function(assert) {
  var image = oenyi(testImages.sq.filename);

  image.toJPG()
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 'jpg';
      var actual = calc.convert.toFormat;
      assert.equal(actual, expected);

      assert.end();
    });
});

test('to jpeg (buffer): should return to jpeg format', function(assert) {
  var image = oenyi(testImages.sq.buffer);

  image.toJPG()
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 'jpg';
      var actual = calc.convert.toFormat;
      assert.equal(actual, expected);

      assert.end();
    });
});

test('to jpeg: should return to jpeg format, scene and coalesce', function(assert) {
  var image = oenyi(testImages.gif.filename);

  image.toJPG()
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 'jpg';
      var actual = calc.convert.toFormat;
      assert.equal(actual, expected);

      expected = 'gif';
      actual = calc.convert.fromFormat;
      assert.equal(actual, expected);

      expected = 0;
      actual = calc.convert.scene;
      assert.equal(actual, expected);

      expected = true;
      actual = calc.convert.coalesce;
      assert.end();
    });
});

test('to jpeg (buffer): should return to jpeg format, scene and coalesce', function(assert) {
  var image = oenyi(testImages.gif.buffer);

  image.toJPG()
    .exec(function(err, buffer, calc) {
      assert.ok(buffer, 'should return buffer');
      assert.ok(buffer.length, 'buffer should not be empty');
      assert.notOk(err, 'should not throw');

      var expected = 'jpg';
      var actual = calc.convert.toFormat;
      assert.equal(actual, expected);

      expected = 'gif';
      actual = calc.convert.fromFormat;
      assert.equal(actual, expected);

      expected = 0;
      actual = calc.convert.scene;
      assert.equal(actual, expected);

      expected = true;
      actual = calc.convert.coalesce;
      assert.end();
    });
});

test('to jpeg (pipe): should return to jpeg format, scene and coalesce', function(assert) {
  var image = oenyi(testImages.gif.buffer);
  var wstream = new WriteStream();

  image.toJPG()
    .pipe(wstream, function(error, calc) {
      assert.ok(calc, 'should return calc');
      assert.notOk(error, 'should not throw');

      var expected = 'jpg';
      var actual = calc.convert.toFormat;
      assert.equal(actual, expected);

      expected = 'gif';
      actual = calc.convert.fromFormat;
      assert.equal(actual, expected);

      expected = 0;
      actual = calc.convert.scene;
      assert.equal(actual, expected);

      expected = true;
      actual = calc.convert.coalesce;
      assert.end();
    });
});
