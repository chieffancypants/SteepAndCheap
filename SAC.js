#!/usr/bin/env node

var request = require('request'),
	exec = require('child_process').exec,
	fs = require('fs');

var pollFrequency = 1 * 60 * 1000,
	previousItem;


var poll = function() {
	request.get('http://www.steepandcheap.com/steepcheap/sac/jsdata.js', function(err, resp, body) {
		if (!err && resp.statusCode == 200) {
			body = JSON.parse(body);
			
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
