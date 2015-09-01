function MockImg(filePath) {
};

MockImg.prototype.size = function(fn) {
  fn(null, {});
};

MockImg.prototype.toBuffer = function(type, fn) {
  fn(null, new Buffer(1));
};

MockImg.prototype.resize = function(w, h) {
  return this;
};

MockImg.prototype.crop = function(w, h, x, y) {
  return this;
};

MockImg.prototype.format = function(fn) {
  var formats = ['jpg', 'jpeg', 'png'];
  fn(null, formats[Math.round(Math.random() * formats.length)]);
};

MockImg.prototype.quality = function(max) {
  return this;
};

MockImg.prototype.flatten = function() {
  return this;
};

MockImg.prototype.scene = function() {
  return this;
};

MockImg.prototype.coalesce = function() {
  return this;
};

module.exports = function(filePath) {
  return new MockImg(filePath);
};
