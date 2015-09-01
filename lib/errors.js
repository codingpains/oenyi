/**
 * Contains the potential errors thrown by a command.
 */

var util = require('util');

/**
 * The constructor for a CompressionError. Thrown or returned when an image.
 * can't be compressed
 * @constructor
 * @extends Error
 *
 * @param {string} message The message to assign the error
 */
function CompressionError(message) {
  Error.captureStackTrace(this, CompressionError);
  this.name = 'CompressionError';
  this.message = message;
}

util.inherits(CompressionError, Error);

exports.CompressionError = CompressionError;
