#!/usr/bin/env node

var request  = require('request'),
    execFile = require('child_process').execFile,
    fs       = require('fs'),
    util     = require('util');

var previousItem,
  pollFrequency = 1 * 60 * 1000,

// set header information:
request = request.defaults({
  'json': true,
  'headers': {
    'User-Agent': 'SteepAndCheap Linux App (https://github.com/chieffancypants/SteepAndCheap)'
  }
});


// Log any potential errors:
var writeStream = fs.createWriteStream(__dirname + '/logfile.log', {'flags': 'a'});
process.__defineGetter__('stdout', function() {
  return writeStream;
});
process.on('uncaughtException', function (err) {
  util.log('Caught exception: ' + err.message);
});

var poll = function() {
  request.get('http://www.steepandcheap.com/steepcheap/sac/jsdata.js', function (err, resp, body) {
    if (err) throw(err);

    if (!err && resp.statusCode == 200) {
      // Don't notify unless it's a new item
      if (body.currentItem.skuClass === previousItem) {
        return;
      }
      previousItem = body.currentItem.skuClass;

      // Grab the first image
      for (var image in body.currentItem.variants) break;
      image = body.currentItem.variants[image].images.smallImage;
      var r = request(image).pipe(fs.createWriteStream(__dirname + '/data/image.jpg'));

      // Once we're done saving the image, display the notification:
      r.on('close', function() {
        var message = body.currentItem.productTitle +
          ' - ' + body.currentItem.price +
          ' (' + body.currentItem.percentOff +'% off)';
        execFile('notify-send', ['SteepAndCheap', message, '-i', __dirname + '/data/image.jpg'], function (err, stdout, stderr) {
          // console.log(err, stdout, stderr);
        });
      });

    }
  });
};

poll();
setInterval(poll, pollFrequency);
