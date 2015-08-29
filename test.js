var oenyim = require('./index');
var fs = require('fs');

oenyim('/Users/voxfeed_1/Desktop/gusortiz.jpeg')
  .resize({width : 1000, height: 400, method: 'cover'})
  .exec(function(err, buff) {
    console.log('Err, res', err, buff);
    fs.writeFile('/Users/voxfeed_1/Desktop/gusortiz-resized.jpg', buff);
  });
