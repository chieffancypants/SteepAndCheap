#!/usr/bin/env node

var request  = require('request'),
    fs       = require('fs'),
    growl    = require('growl'),
    util     = require('util');

var previousItems = {},
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
  var endpoints = {
    steepandcheap: {name: 'SteepAndCheap', url: 'http://www.steepandcheap.com/steepcheap/sac/jsdata.js' }
    , chainlove: {name: 'Chainlove', url: 'http://www.chainlove.com/chainlove/cl/jsdata.js' }
    , whiskeymilitia: {name: 'WhiskeyMilitia', url: 'http://www.whiskeymilitia.com/wm/wm/jsdata.js' }
  };

  var desiredSites;
  if (process.env.SITES) {
    desiredSites = process.env.SITES.split(',');
  } else {
    desiredSites = ['steepandcheap'];
  }

  desiredSites.forEach(function (site) {
    var endpoint = endpoints[site].url;
    request.get(endpoint, function (err, resp, body) {
      if (err) throw(err);

      if (!err && resp.statusCode == 200) {
        // Don't notify unless it's a new item
        if (body.currentItem.skuClass === previousItems[site]) {
          return;
        }
        previousItems[site] = body.currentItem.skuClass;

        // Grab the first image
        for (var image in body.currentItem.variants) break;
        image = body.currentItem.variants[image].images.smallImage;
        var r = request(image).pipe(fs.createWriteStream(__dirname + '/data/' + site + '.jpg'));

        // Once we're done saving the image, display the notification:
        r.on('close', function() {
          var message = body.currentItem.productTitle +
          ' - ' + body.currentItem.price +
          ' (' + body.currentItem.percentOff +'% off)';
        growl(message, {title: endpoints[site].name, image: __dirname + '/data/' + site + '.jpg'});
        });
      }
    });
  });
};

poll();
setInterval(poll, pollFrequency);
