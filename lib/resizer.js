var deepcopy = require('deepcopy');
var isPortrait;
var isSquare;
var isLandscape;
var resizeFromPortrait;
var resizeFromSquare;
var resizeFromLandscape;
var resizeUpOrDown;
var calculateCropArea;

module.exports = exports = {};

exports.resizeByCover = function(original, destiny) {
  var calc = {};
  var crop;

  destiny.ratio = destiny.width / destiny.height;
  original.ratio = original.width / original.height;

  if (original.ratio !== destiny.ratio) {
    crop = calculateCropArea(original, destiny);
    calc.crop = deepcopy(crop);
  }

  calc.resize = deepcopy(destiny);

  return calc;
};

exports.resizeByFitOrContain = function(original, destiny, fits) {
  var calc = {};

  if (fits) return {resize: deepcopy(original)};

  calc.resize = resizeUpOrDown(original, destiny);
  return calc;
};

isPortrait = function(size) {
  return size.height > size.width;
};

isSquare = function(size) {
  return size.height === size.width;
};

isLandscape = function(size) {
  return size.width > size.height;
};

resizeFromPortrait = function(original, destiny) {
  if (isSquare(destiny) || isLandscape(destiny) || original.ratio < destiny.ratio) {
    destiny.width = Math.round(destiny.height * original.ratio);
  } else {
    destiny.height = Math.round(destiny.width / original.ratio);
  }
  return destiny;
};

resizeFromSquare = function(original, destiny) {
  if (destiny.width < destiny.height) {
    destiny.height = destiny.width;
  } else {
    destiny.width = destiny.height;
  }
  return destiny;
};

resizeFromLandscape = function(original, destiny) {
  if (destiny.ratio > original.ratio) {
    destiny.width = Math.round(destiny.height * original.ratio);
  } else {
    destiny.height = Math.round(destiny.width / original.ratio);
  }
  return destiny;
};

resizeUpOrDown = function(original, destiny) {
  original.ratio = original.width / original.height;
  destiny.ratio = destiny.width / destiny.height;

  if (isPortrait(original)) return resizeFromPortrait(original, destiny);
  if (isSquare(original)) return resizeFromSquare(original, destiny);

  return resizeFromLandscape(original, destiny);
};

calculateCropArea = function(original, destiny) {
  var crop = {x: 0, y: 0, height: original.height, width: original.width};
  if (original.ratio > destiny.ratio) {
    crop.width = Math.round(original.height * destiny.ratio);
    crop.x = Math.round((original.width - crop.width) / 2);
  } else {
    crop.height = Math.round(original.width / destiny.ratio);
    crop.y = Math.round((original.height - crop.height) / 2);
  }

  return crop;
};
