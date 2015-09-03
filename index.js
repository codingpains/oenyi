var Oenyi = require('./lib/oenyi');
var BadArgumentError = require('./lib/errors').BadArgumentError;

module.exports = function(pathOrBuffer) {
  if (!pathOrBuffer || typeof pathOrBuffer === 'string' || pathOrBuffer instanceof Buffer) {
    return new Oenyi(pathOrBuffer);
  } else {
    throw new BadArgumentError('argument must be a string, a buffer or empty');
  }
};
