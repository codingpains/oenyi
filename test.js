var oenyim = require('./index');
var fs = require('fs');

oenyim('/Users/voxfeed_1/Desktop/gusortiz.jpeg')
  .resize({width : 1000, height: 400, method: 'cover'})
  .exec(function(err, buff) {
    console.log('Err, res', err, buff);
    fs.writeFile('/Users/voxfeed_1/Desktop/gusortiz-cover.jpg', buff);
  });

oenyim('/Users/voxfeed_1/Desktop/gusortiz.jpeg')
  .resize({width : 200, height: 1250, method: 'contain'})
  .exec(function(err, buff) {
    console.log('Err, res', err, buff);
    fs.writeFile('/Users/voxfeed_1/Desktop/gusortiz-contain.jpg', buff);
  });
