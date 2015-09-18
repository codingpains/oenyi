var deepcopy = require('deepcopy');
var isPortrait;
var isSquare;
var isLandscape;
var widthByRatio;
var heightByRatio;
var getMiddlePosition;
var resizeFromPortrait;
var resizeFromSquare;
var resizeFromLandscape;
var resizeUpOrDown;
var calculateCropArea;

module.exports = exports = {};

exports.resizeByCover = function(original, destiny) {
  'use strict';
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
  'use strict';
  var calc = {};

  if (fits) return {resize: deepcopy(original)};

  calc.resize = resizeUpOrDown(original, destiny);
  return calc;
};

isPortrait = function(size) {
  'use strict';
  return size.height > size.width;
};

isSquare = function(size) {
  'use strict';
  return size.height === size.width;
};

isLandscape = function(size) {
  'use strict';
  return size.width > size.height;
};

widthByRatio = function(height, ratio) {
  'use strict';
  return Math.round(height * ratio);
};

heightByRatio = function(width, ratio) {
  'use strict';
  return Math.round(width / ratio);
};

getMiddlePosition = function(startSize, endSize) {
  'use strict';
  return Math.round((startSize - endSize) / 2);
};

resizeFromPortrait = function(original, destiny) {
  'use strict';
  var isRatioSmaller = original.ratio < destiny.ratio;
  if (isSquare(destiny) || isLandscape(destiny) || isRatioSmaller) {
    destiny.width = widthByRatio(destiny.height, original.ratio);
  } else {
    destiny.height = heightByRatio(destiny.width, original.ratio);
  }
  return destiny;
};

resizeFromLandscape = function(original, destiny) {
  'use strict';
  if (destiny.ratio > original.ratio) {
    destiny.width = Math.round(destiny.height * original.ratio);
  } else {
    destiny.height = Math.round(destiny.width / original.ratio);
  }
  return destiny;
};

resizeFromSquare = function(original, destiny) {
  'use strict';
  if (destiny.width < destiny.height) {
    destiny.height = destiny.width;
  } else {
    destiny.width = destiny.height;
  }
  return destiny;
};

resizeUpOrDown = function(original, destiny) {
  'use strict';
  original.ratio = original.width / original.height;
  destiny.ratio = destiny.width / destiny.height;

  if (isPortrait(original)) return resizeFromPortrait(original, destiny);
  if (isSquare(original)) return resizeFromSquare(original, destiny);

  return resizeFromLandscape(original, destiny);
};

calculateCropArea = function(original, destiny) {
  'use strict';
  var crop = {x: 0, y: 0, height: original.height, width: original.width};
  var res = {};
  if (original.ratio > destiny.ratio) {
    crop.width = widthByRatio(original.height, destiny.ratio);
    crop.x = getMiddlePosition(original.width, crop.width);
  } else {
    crop.height = heightByRatio(original.width, destiny.ratio);
    crop.y = getMiddlePosition(original.height, crop.height);
  }

  return crop;
};
