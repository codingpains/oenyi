var gm = require('gm');
var async = require('async');
var Promise = require('bluebird');

var Oenyim = function Oenyim(fileName) {
  return this.init.call(this, fileName);
};

var doResize;
var resizeByCover;
var resizeByContain;
var calculateCropArea;
var isPortrait;

Oenyim.prototype._queue = null;
Oenyim.prototype._image = null;
Oenyim.prototype._mime = null;
Oenyim.prototype._size = null;
Oenyim.prototype._calc = null;

Oenyim.prototype.init = function(fileName) {
  var oenyim = this;
  this._queue = [];
  this._calc = {};
  this._image = gm(fileName);
  return this;
};

isPortrait = function(size) {
  return size.height > size.width;
};

isSquare = function(size) {
  return size.height === size.width;
};

calculateCropArea = function(original, destiny) {
  var crop = {x: 0, y: 0, height: original.height, width: original.width};
  if (original.ratio > destiny.ratio) {
      crop.width = Math.round(original.height * destiny.ratio);
      crop.x = (original.width - crop.width) / 2;
  } else {
      crop.height = Math.round(original.width / destiny.ratio);
      crop.y = (original.height - crop.height) / 2;
  }

  return crop;
};

doResize = function(params, fn) {
  var args = {width: params.width, height: params.height};

  if (params.method === 'cover') return resizeByCover.call(this, args, fn);
  return resizeByContain.call(this, args, fn);
};

resizeByCover = function(params, fn) {
  var oenyim = this;
  var destiny = params;
  var crop;

  destiny.ratio = destiny.width / destiny.height;

  oenyim._getSize(function(err, original) {
    if (err) return fn(err);
    original.ratio = original.width / original.height;

    if (original.ratio === destiny.ratio) {
      oenyim._image.resize(destiny.width, destiny.height);
    } else {
      crop = calculateCropArea(original, destiny);
      oenyim._image
        .crop(crop.width, crop.height, crop.x, crop.y)
        .resize(destiny.width, destiny.height);
    }

    fn(null, oenyim._image);
  });
};

resizeByContain = function(params, fn) {
  var oenyim = this;
  var destiny = params;

  this._getSize(function(err, original) {
    if (err) return fn(err);

    var imageFits = original.width === destiny.width && original.height === destiny.height;

    original.ratio = original.width / original.height;
    destiny.ratio  = destiny.width / destiny.height;

    if (imageFits) return fn(null, oenyim._image);

    if (isPortrait(original)) {
      original.ratio = original.height / original.width;
      destiny.width = Math.round(destiny.height / original.ratio);
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
    oenyim._calc = {resize: JSON.parse(JSON.stringify(destiny))};
    oenyim._image.resize(destiny.width, destiny.height);
    return fn(null, oenyim._image);
  });
}

doConvertToJPG = function(fn) {
  fn(null, this._image);
};

doCompress = function(max, fn) {
  fn(null, this._image);
};

Oenyim.prototype._getSize = function(fn) {
  var oenyim = this;
  if (oenyim._size) return fn(null, oenyim._size);

  oenyim._image.size(function(err, size) {
    if (err) return fn(err);
    oenyim._size = {width: size.width, height: size.height}
    fn(null, oenyim._size);
  });
};

Oenyim.prototype._getFormat = function(fn) {
  var oenyim = this;
  if (this._mime) return fn(null, this._mime);
  this._image.format(function (err, format) {
    if (err) return fn(err);
    oenyim._mime = format;
    fn(format);
  });
};

Oenyim.prototype._enqueue = function(process, args) {
  var oenyim = this;
  var wrapperFunction = function(fn) {
    args.push(fn);
    process.apply(oenyim, args);
  }

  this._queue.push(wrapperFunction);

  return this;
};

Oenyim.prototype.exec = function(fn) {
  var oenyim = this;

  this._getFormat(function(err, format) {
    async.series(oenyim._queue, function(err, res) {
      if (err) return fn(err);

      var calc = JSON.parse(JSON.stringify(oenyim._calc));
      var ret;

      oenyim._queue = [];
      oenyim._cals = {};
      ret = res.pop();

      ret.toBuffer(oenyim._mime, function(err, buff) {
        fn(err, buff, calc);
      });
    });
  });
};

Oenyim.prototype.pipe = function(stream) {
  var oenyim = this;

  return new Promise(function(resolve, reject) {
    oenyim._getFormat(function(err, format) {
      async.series(oenyim._queue, function(err, res) {
        oenyim._queue = [];
        if (err) return reject(err);
        var ret = res.pop();
        console.log('Format ', oenyim._mime);
        ret.stream(oenyim._mime)
        .pipe(stream);

        return resolve(stream);
      });
    });
  });
};

Oenyim.prototype.resize = function(args) {
  return this._enqueue(doResize, [args]);
};

Oenyim.prototype.toJPG = function() {
  return this._enqueue(doConvertToJPG);
};

Oenyim.prototype.compress = function(max) {
  return this._enqueue(doCompress, [max]);
};


module.exports = Oenyim;
