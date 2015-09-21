# Oenyi

[![Build Status](https://travis-ci.org/codingpains/oenyi.svg?branch=master)](https://travis-ci.org/codingpains/oenyi)
[![Code Climate](https://codeclimate.com/github/codingpains/oenyi/badges/gpa.svg)](https://codeclimate.com/github/codingpains/oenyi)
[![NPM](https://nodei.co/npm/oenyi.png?mini=true)](https://npmjs.org/package/oenyi)

A very simple wrapper for a few image processing methods that just provides:
 * A convenient and consistent API.
 * Full in memory processing support to reduce i/o and increase speed.
 * Three resizing methods that will make your life easier.

It is designed to chain the transformations you need and execute them in order once you call the `exec` method which gives you a buffer with the image or, if you prefer, when you call the `pipe` method which accepts a stream.

Want to see the technical specification? [Go here](https://github.com/codingpains/oenyi/wiki/Oenyi%20Technical%20Spec)

### Installation

You need to install imagemagick since this library depends on it.

**OSX**
```bash
  $ brew install imagemagick
```

**Ubuntu**
```bash
  $ sudo apt-get install imagemagick
```

Then install the module.
```
  npm install oenyi
```
### Require oenyi

```js
  var oenyi = require('oenyi');
```
### Getting an oenyi image instance.

#### Using a string as path.
```js
  var image = oenyi('/path/to/image');
```

#### Using a buffer
```js
  var fs = require('fs');

  fs.readFile('/path/to/image', function(err, buffer) {
    if (err) {
      console.error(err);
      return;
    }
    var image = oenyi(buffer);
  });
```

### Convert image to jpeg.

```js
  image.toJPG();
```

### Compress image to a given quality.

```js
  image.compress({quality: 90});
```

## Reszing Methods.

Oenyi gives you three resizing methods: Cover, Contain and Fit. They do what they promise.

### Resize by Contain.

It is meant to be used when you want to ensure a maximum size but you want the aspect ratio untouched and if it fits, then the original size as well.
This method will only resize down when the image to resize is bigger than the size provided.

```js
  // original size w:400, h:400
  image.resize({width: 500, height: 255, method: 'contain'}); // => produces size w:255, h:225

  // original size w:3000, h:600
  image.resize({width: 500, height: 255, method: 'contain'}); // => produces size w:500, h:100
```

### Resize by Fit.

So you want to grow or shrink an image to fit an area as best as it can, but want to keep the aspect ratio and the full image visible? Well, use this method.

```js
  // original size w:640, h:2560
  image.resize({width: 1024, height: 1024, method: 'fit'}); // => produces size w:256, h:1024

  // original size w:5000, h:3000
  image.resize({width: 1000, height: 2000, method: 'fit'}); // => produces size w:1000, h:600
```

### Resize by Cover.

Resizes an image to cover or match a size and force a new aspect ratio with no distortion.

```js
  // original size w:640, h:2560
  image.resize({width: 500, height: 500, method: 'cover'}); // => produces size w:500, h:500
```

### Execute all commands and return a buffer with the modified image.

```js
  image.exec(function(err, imageBuffer) {
    // Your code here.
  });
```

### Execute all commands and pipe to a stream.

```js
  var wstream = require('fs').createWriteStream('/path/to/destiny');
  image.pipe(wstream);
```

### Run a complex chained transformation.

Use method chaining to apply many transformations to a single image. Get the image buffer at the end and do with it whatever you want.

```js
  var oenyi = require('oenyi');
  var fs = require('fs');

  oenyi('/path/to/image')
    .toJPG()
    .compress({quality: 80})
    .resize({width: 500, height: 500, method: 'cover'})
    .exec(function(err, imageBuffer) {
      if (err) return console.error(err);

      fs.writeFile('/path/to/destiny', imageBuffer);
    });
```

## FAQ

### Why the silly name?
Because of this creepy video. https://youtu.be/GzobV_qoIcQ
You can blame [javierbyte](http://github.com/javierbyte) for that.

### Why do this wrapper?
At [VoxFeed](http://voxfeed.com) we wanted to remove image processing related logic from our platform, isolate it and
provide a consistent API to make our image related code more bearable...err, readable. So we designed this wrapper.
