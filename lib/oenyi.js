var gm = require('gm');
var async = require('async');
var Promise = require('bluebird');
var mockimg = require('./mockimg');
var errors = require('./errors');

var CompressionError = errors.CompressionError;

var Oenyi = function Oenyi(fileName) {
  return this.init.call(this, fileName);
};

var doResize;
var resizeByCover;
var resizeByContain;
var calculateCropArea;
var isPortrait;

Oenyi.prototype._queue = null;
Oenyi.prototype._image = null;
Oenyi.prototype._format = null;
Oenyi.prototype._size = null;
Oenyi.prototype._calc = null;

Oenyi.prototype.init = function(fileName) {
  var oenyi = this;
  this._queue = [];
  this._calc = {};

  if (!fileName || fileName === '') {
    this._image = mockimg(fileName);
  } else {
    this._image = gm(fileName);
  }

  return this;
};

isPortrait = function(size) {
  return size.height > size.width;
};

isSquare = function(size) {
  return size.height === size.width;
};

isLandscape = function(size) {
  return size.width > size.height;
};

calculateCropArea = function(original, destiny) {
  var crop = {x: 0, y: 0, height: original.height, width: original.width};
  if (original.ratio > destiny.ratio) {
    crop.width = Math.round(original.height * destiny.ratio);
    crop.x = Math.round((original.width - crop.width) / 2);
  } else {
    crop.height = Math.round(original.width / destiny.ratio);
    crop.y = Math.round((original.height - crop.height) / 2);
  }

  return crop;
};

doResize = function(params, fn) {
  var args = {width: params.width, height: params.height};

  if (params.method === 'cover') return resizeByCover.call(this, args, fn);
  return resizeByContain.call(this, args, fn);
};

resizeByCover = function(params, fn) {
  var oenyi = this;
  var destiny = params;
  var crop;

  destiny.ratio = destiny.width / destiny.height;

  oenyi._getSize(function(err, original) {
    if (err) return fn(err);
    original.ratio = original.width / original.height;

    if (original.ratio === destiny.ratio) {
      oenyi._image.resize(destiny.width, destiny.height);
    } else {
      crop = calculateCropArea(original, destiny);
      oenyi._image
        .crop(crop.width, crop.height, crop.x, crop.y)
        .resize(destiny.width, destiny.height);
    }

    if (crop) {
      oenyi._calc.crop = JSON.parse(JSON.stringify(crop));
    }
    oenyi._calc.resize = JSON.parse(JSON.stringify(destiny));

    fn(null, oenyi._image);
  });
};

resizeByContain = function(params, fn) {
  var oenyi = this;
  var destiny = params;

  this._getSize(function(err, original) {
    if (err) return fn(err);

    var imageFits = original.width === destiny.width && original.height === destiny.height;

    original.ratio = original.width / original.height;
    destiny.ratio  = destiny.width / destiny.height;

    if (imageFits) return fn(null, oenyi._image);

    if (isPortrait(original)) {
      if (isSquare(destiny) || isLandscape(destiny)) {
        destiny.width = Math.round(destiny.height * original.ratio)
      } else if (original.ratio < destiny.ratio) {
        destiny.width = Math.round(destiny.height * original.ratio);
      } else {
        destiny.height = Math.round(destiny.width / original.ratio);
      }
    } else if(isSquare(original)) {
      if (destiny.width < destiny.height) {
        destiny.height = destiny.width;
      } else {
        destiny.width = destiny.height;
      }
    } else {
      if (destiny.ratio > original.ratio) {
        destiny.width = Math.round(destiny.height * original.ratio);
      } else {
        destiny.height = Math.round(destiny.width / original.ratio);
      }
    }
    oenyi._calc = {resize: JSON.parse(JSON.stringify(destiny))};
    oenyi._image.resize(destiny.width, destiny.height);
    return fn(null, oenyi._image);
  });
}

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
  this._getFormat(function(err, format) {
    if (formats.indexOf(format.toLowerCase()) < 0) return fn(new CompressionError('can´t compress this format.'));
    oenyi._image.quality(params.quality);
    oenyi._calc.compress = {quality : params.quality};
    fn(null, oenyi._image);
  });
};

Oenyi.prototype._getSize = function(fn) {
  var oenyi = this;
  if (oenyi._size) return fn(null, oenyi._size);

  oenyi._image.size(function(err, size) {
    if (err) return fn(err);
    oenyi._size = {width: size.width, height: size.height}
    fn(null, oenyi._size);
  });
};

Oenyi.prototype._getFormat = function(fn) {
  var oenyi = this;
  if (oenyi._format) return fn(null, oenyi._format);

  oenyi._image.format(function (err, format) {
    if (err) return fn(err);
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
  }

  this._queue.push(wrapperFunction);

  return this;
};

Oenyi.prototype.exec = function(fn) {
  var oenyi = this;

  this._getFormat(function(err, format) {
    async.series(oenyi._queue, function(err, res) {
      if (err) return fn(err);

      var calc = JSON.parse(JSON.stringify(oenyi._calc));
      var ret;

      oenyi._queue = [];
      oenyi._calc = {};
      ret = res.pop();

      ret.toBuffer(oenyi._format, function(err, buff) {
        fn(err, buff, calc);
      });
    });
  });
};

Oenyi.prototype.pipe = function(stream) {
  var oenyi = this;

  return new Promise(function(resolve, reject) {
    oenyi._getFormat(function(err, format) {
      async.series(oenyi._queue, function(err, res) {
        oenyi._queue = [];
        if (err) return reject(err);
        var ret = res.pop();
        ret.stream(oenyi._formatº)
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
