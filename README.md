# oenyim

A wrapper for a few gm methods that just provides a convenient and consistent API.

It is built to chain all transformations you need and execute them once you call the `exec` method, returning the modified image as a `Stream`.

### Getting an oenyim image instance.


```
  var oenyim = require('oenyim');
  var image = oenyim('/path/to/image');
```

### Convert image to jpeg.


```
  image.toJPG();
```

### Compress image to a given quality.


```
  var quality = 90;
  
  image.compress(quality);
```


### Resize image respecting the original aspect ratio.

Keeps aspect ratio and just scales up or down the image until it fits the provided sizes.

```
  image.resize({width: 500, height: 255, method: 'contain'});
```

### Resize and crop image to match size and aspect ratio.

Crops and resizes the image to fit the provided sizes and the aspect ratio given by such sizes.

```
  
  image.resizeAndcrop({width: 500, height: 500, method: 'cover'});
``

### Execute all commands and return the Buffer with the modified image.

```
	image.exec(function(err, imagebuf) {
	  // Your code here.
	});
```

### Execute all commands and pipe to a WritableStream;

```
  var wstream = require('fs').createWriteStream('/path/to/destiny');
  
  image.pipe(wstream);
```

### Run a complex chained transformation.

Use method chaining to apply many transformations to a single image. Get the image stream at the end and do with it whatever you want.

```
  var oenyim = require('oenyim');
  var fs = require('fs);
  
  oenyim('/path/to/image')
    .toJPG()
    .compress(80)
    .resizeAndCrop(500,500)
    .exec(function(err, image) {
  	  if (err) return console.error(err);
  	  
  	  fs.writeFile('/path/to/destiny', image)
    });
```