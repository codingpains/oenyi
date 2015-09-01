# Oenyi

[![Build Status](https://travis-ci.org/codingpains/oenyi.svg?branch=master)](https://travis-ci.org/codingpains/oenyi)

A wrapper for a few gm methods that just provides a convenient and consistent API.

It is built to chain all transformations you need and execute them once you call the `exec` method, returning the modified image as a `Stream`.

### Getting an oenyi image instance.


```
  var oenyi = require('oenyi');
  var image = oenyi('/path/to/image');
```

### Convert image to jpeg.


```
  image.toJPG();
```

### Compress image to a given quality.


```
  image.compress({quality: 90});
```


### Resize image respecting the original aspect ratio.

Keeps aspect ratio and just scales up or down the image until it fits the provided sizes.

```
  image.resize({width: 500, height: 255, method: 'contain'});
```

### Resize image to cover or match size and force aspect ratio with no distortion.

Crops and resizes the image to fit the provided sizes and the aspect ratio given by such sizes.

```

  image.resize({width: 500, height: 500, method: 'cover'});
```

### Execute all commands and return the Buffer with the modified image.

```
	image.exec(function(err, imageBuffer) {
	  // Your code here.
	});
```

### Execute all commands and pipe to a WritableStream;

```
  var wstream = require('fs').createWriteStream('/path/to/destiny');

  image.pipe(wstream);
```

### Run a complex chained transformation.

Use method chaining to apply many transformations to a single image. Get the image buffer at the end and do with it whatever you want.

```
  var oenyi = require('oenyi');
  var fs = require('fs);

  oenyi('/path/to/image')
    .toJPG()
    .compress({quality: 80})
    .resize({width: 500, height: 500, method: 'cover'})
    .exec(function(err, imageBuffer) {
  	  if (err) return console.error(err);

  	  fs.writeFile('/path/to/destiny', imageBuffer)
    });
```
