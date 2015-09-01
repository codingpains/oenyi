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
  var formats = ['jpg', 'png', 'gif'];
  fn(null, Math.random() * formats);
};

module.exports = function(filePath) {
  return new MockImg(filePath);
};
