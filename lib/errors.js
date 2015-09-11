/**
 * Contains the potential errors thrown by a command.
 */

var util = require('util');

/**
 * The constructor for a CompressionError.
 * Thrown or returned when an image.
 * can't be compressed
 * @constructor
 * @extends Error
 *
 * @param {string} message The message to assign the error
 */
function CompressionError(message) {
  'use strict';
  Error.captureStackTrace(this, CompressionError);
  this.name = 'CompressionError';
  this.message = message;
}

util.inherits(CompressionError, Error);

/**
 * The constructor for a BadArgumentError.
 * Thrown or returned when an and argument is
 * of an invalid type.
 * @constructor
 * @extends Error
 *
 * @param {string} message The message to assign the error
 */
function BadArgumentError(message) {
  'use strict';
  Error.captureStackTrace(this, BadArgumentError);
  this.name = 'BadArgumentError';
  this.message = message;
}

util.inherits(BadArgumentError, Error);

exports.CompressionError = CompressionError;
exports.BadArgumentError = BadArgumentError;
