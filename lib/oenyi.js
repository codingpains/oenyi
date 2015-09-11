var gm = require('gm').subClass({ imageMagick: true });
var nimble = require('nimble');
var deepcopy = require('deepcopy');
var Promise = require('bluebird');
var resizer = require('./resizer');
var mockimg = require('./mockimg');
var errors = require('./errors');

var CompressionError = errors.CompressionError;

var Oenyi = function Oenyi(fileName) {
  return this.init.call(this, fileName);
};

// Private methods;
var doResize;
var doConvertToJPG;
var doCompress;

Oenyi.prototype._queue = null;
Oenyi.prototype._image = null;
Oenyi.prototype._format = null;
Oenyi.prototype._size = null;
Oenyi.prototype._calc = null;

Oenyi.prototype.init = function(fileName) {
  this._queue = [];
  this._calc = {};

  if (!fileName || fileName === '') {
    this._image = mockimg(fileName);
  } else {
    this._image = gm(fileName);
  }

  return this;
};

doResize = function(params, fn) {
  var destiny = {width: params.width, height: params.height};
  var oenyi = this;
  var calc;
  var imageFits;

  this._getSize(function(error, original) {
    if (error) return fn(error);

    switch(params.method) {
      case 'cover':
        calc = resizer.resizeByCover(original, destiny);
        if (calc.crop) {
          oenyi._image.crop(calc.crop.width, calc.crop.height, calc.crop.x, calc.crop.y);
        }
        break;
      case 'fit':
        imageFits = original.width === destiny.width && original.height === destiny.height;
        calc = resizer.resizeByFitOrContain(original, destiny, imageFits);
        break;
      case 'contain':
        imageFits = original.width <= destiny.width && original.height <= destiny.height;
        calc = resizer.resizeByFitOrContain(original, destiny, imageFits);
        break;
    }

    oenyi._image.resize(calc.resize.width, calc.resize.height);
    oenyi._calc = calc;

    fn(null, oenyi._image);
  });
};

doConvertToJPG = function(fn) {
  var oenyi = this;
  oenyi._calc.convert = {toFormat: 'jpg'};

  oenyi._getFormat(function(err, format) {
    if (err) return fn(err);

    format = format.toLowerCase();
    if (format === 'jpg') return fn(null, oenyi._image);

    if (format === 'gif') {
      oenyi._image
        .scene(1)
        .coalesce();

      oenyi._calc.convert.fromFormat = 'gif';
      oenyi._calc.convert.scene = 0;
      oenyi._calc.convert.coalesce = true;
    }

    if (format === 'png') {
      oenyi._image.flatten();
      oenyi._calc.convert.fromFormat = 'png';
      oenyi._calc.convert.flatten = true;
    }

    fn(null, oenyi._image);
  });
};

doCompress = function(params, fn) {
  var formats = ['jpg', 'jpeg', 'png'];
  var oenyi = this;
  this._getFormat(function(error, format) {
    if (error) return fn(error);
    format = format.toLowerCase();

    if (formats.indexOf(format) < 0) return fn(new CompressionError('can´t compress this format.'));

    oenyi._image.quality(params.quality);
    oenyi._calc.compress = {quality: params.quality};

    fn(null, oenyi._image);
  });
};

Oenyi.prototype._getSize = function(fn) {
  var oenyi = this;
  if (oenyi._size) return fn(null, oenyi._size);

  oenyi._image.size(function(error, size) {
    if (error) return fn(error);

    oenyi._size = {width: size.width, height: size.height};
    fn(null, oenyi._size);
  });
};

Oenyi.prototype._getFormat = function(fn) {
  var oenyi = this;
  if (oenyi._format) return fn(null, oenyi._format);

  oenyi._image.format(function(error, format) {
    if (error) return fn(error);

    oenyi._format = format;
    fn(null, format);
  });
};

Oenyi.prototype._enqueue = function(process, args) {
  var oenyi = this;
  if (!args) {
    args = [];
  }

  var wrapperFunction = function(fn) {
    args.push(fn);
    process.apply(oenyi, args);
  };

  this._queue.push(wrapperFunction);

  return this;
};

Oenyi.prototype.exec = function(fn) {
  var oenyi = this;
  var calc;
  var ret;

  this._getFormat(function(error, format) {
    if (error) return fn(error);

    nimble.series(oenyi._queue, function(error, res) {
      if (error) return fn(error);

      calc = deepcopy(oenyi._calc);
      ret;

      oenyi._queue = [];
      oenyi._calc = {};
      ret = res.pop();

      ret.toBuffer(oenyi._format, function(error, buff) {
        fn(error, buff, calc);
      });
    });
  });
};

Oenyi.prototype.pipe = function(stream) {
  var oenyi = this;

  return new Promise(function(resolve, reject) {
    oenyi._getFormat(function(error, format) {
      if (error) return reject(error);

      nimble.series(oenyi._queue, function(error, res) {
        oenyi._queue = [];
        if (error) return reject(error);

        var ret = res.pop();
        ret.stream(oenyi._format)
          .pipe(stream);

        return resolve(stream);
      });
    });
  });
};

Oenyi.prototype.resize = function(args) {
  return this._enqueue(doResize, [args]);
};

Oenyi.prototype.toJPG = function() {
  return this._enqueue(doConvertToJPG);
};

Oenyi.prototype.compress = function(args) {
  return this._enqueue(doCompress, [args]);
};

module.exports = Oenyi;
