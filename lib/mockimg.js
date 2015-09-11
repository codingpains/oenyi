function MockImg() {}

MockImg.prototype.size = function(fn) {
  'use strict';
  fn(null, {});
};

MockImg.prototype.toBuffer = function(type, fn) {
  'use strict';
  type = 'mock';
  fn(null, new Buffer(1));
};

MockImg.prototype.resize = function(w, h) {
  'use strict';
  w = 0;
  h = 0;
  return this;
};

MockImg.prototype.crop = function(w, h, x, y) {
  'use strict';
  x = 0;
  h = 0;
  x = 0;
  y = 0;
  return this;
};

MockImg.prototype.format = function(fn) {
  'use strict';
  var formats = ['jpg', 'jpeg', 'png'];
  var format = formats[Math.round(Math.random() * (formats.length - 1))];
  fn(null, format);
};

MockImg.prototype.quality = function(max) {
  'use strict';
  max = 0;
  return this;
};

MockImg.prototype.flatten = function() {
  'use strict';
  return this;
};

MockImg.prototype.scene = function() {
  'use strict';
  return this;
};

MockImg.prototype.coalesce = function() {
  'use strict';
  return this;
};

module.exports = function(filePath) {
  'use strict';
  return new MockImg(filePath);
};
