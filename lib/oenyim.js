var gm = require('gm');
var async = require('async');
var Promise = require('bluebird');

var Oenyim = function(fileName) {
  return this.init.call(this, fileName);
};

var doResize;
var resizeByCover;
var resizeByContain;
var calculateCropArea;

Oenyim.prototype._queue = null;
Oenyim.prototype._image = null;

Oenyim.prototype.init = function(fileName) {
  this._queue = [];
  this._image = gm(fileName);
  return this;
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

  oenyim._image.size(function(err, original) {
    if (err) return fn(err);
    original.ratio = original.width / original.height;

    if (original.ratio === destiny.ratio) {
      oenyim._image.resize(destiny.width, destiny.height);
    } else {
      crop = calculateCropArea(original, destiny);
      console.log('Crop ', crop);
      console.log('destiny ', destiny);
      oenyim._image
        .crop(crop.width, crop.height, crop.x, crop.y)
        .resize(destiny.width, destiny.height);
    }

    fn(null, oenyim._image);
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
  var processor = this;
  async.series(processor._queue, function(err, res) {
    if (err) return fn(err);
    var ret = res.pop();
    ret.toBuffer(fn);
  });
};

Oenyim.prototype.resize = function(args) {
  return this._enqueue(doResize, [args]);
};

module.exports = Oenyim;
