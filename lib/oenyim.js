var gm = require('gm');
var async = require('async');
var Promise = require('bluebird');

var Oenyim = function(fileName) {
  return this.init.call(this, fileName);
};

Oenyim.prototype._queue = null;
Oenyim.prototype._image = null;

Oenyim.prototype.init = function(fileName) {
  this._queue = [];
  this._image = gm(fileName);
  return this;
};

Oenyim.prototype._enqueue = function(process, args) {
  var oenyim = this;
  var wrapperFunction = function(fn) {
    args.push(fn);
    process.apply(oenyim, args);
  }

  this._queue.push(wrapperFunction);
};

Oenyim.prototype.exec = function(fn) {
  var processor = this;
  async.series(processor._queue, function(err, res) {
    if (err) return fn(err);
    var ret = res.pop();
    ret.toBuffer(fn);
  });
};

module.exports = Oenyim;
