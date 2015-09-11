var Oenyi = require('./lib/oenyi');
var BadArgumentError = require('./lib/errors').BadArgumentError;

var isPath = function(path) {
  'use strict';
  return typeof path === 'string';
};

var isBuffer = function(buffer) {
  'use strict';
  return buffer instanceof Buffer;
};

module.exports = function(input) {
  'use strict';
  if (!input || isPath(input) || isBuffer(input)) {
    return new Oenyi(input);
  } else {
    throw new BadArgumentError('argument must be a string, a buffer or empty');
  }
};
