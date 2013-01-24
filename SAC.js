#!/usr/bin/env node

var request = require('request'),
	exec    = require('child_process').exec,
	fs      = require('fs'),
	util    = require('util')

var pollFrequency = 1 * 60 * 1000,
	previousItem;


// set header information:
request = request.defaults({
	'json': true,
	'headers': {
		'User-Agent': 'SteepAndCheap Linux App (https://github.com/chieffancypants/SteepAndCheap)'
	}
});


// Log any potential errors:
process.__defineGetter__('stdout', function() {
	return fs.createWriteStream(__dirname + '/logfile.log', {'flags': 'a'})
});
process.on('uncaughtException', function (err) {
	util.log('Caught exception: ' + err.message);
});

var poll = function() {
	request.get('http://www.steepandcheap2.com/steepcheap/sac/jsdata.js', function (err, resp, body) {
		if (err) throw(err);

		if (!err && resp.statusCode == 200) {			
			// Don't notify unless it's a new item
			if (body.currentItem.skuClass === previousItem) {
				return;
			}
			previousItem = body.currentItem.skuClass;

			// Grab the first image
			for (image in body.currentItem.variants) break;
			var image = body.currentItem.variants[image].images.smallImage;
			var r = request(image).pipe(fs.createWriteStream(__dirname + '/data/image.jpg'));
			
			// Once we're done saving the image, display the notification:
			r.on('close', function() {
				var message = 'SteepAndCheap "' + body.currentItem.productTitle +
					' - ' + body.currentItem.price +
					' (' + body.currentItem.percentOff +'% off)" -i ' + __dirname + '/data/image.jpg';					
				exec('notify-send ' + message, function (err, stdout, stderr) {
					// console.log(err, stdout, stderr);
				});
			});
			
		}
	});
}

poll();
setInterval(poll, pollFrequency);
