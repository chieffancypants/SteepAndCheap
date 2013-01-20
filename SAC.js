#!/usr/bin/env node
var request = require('request'),
	exec = require('child_process').exec,
	fs = require('fs');

var pollFrequency = 1 * 60 * 1000,
	previousItem;


var poll = function() {
	request.get('http://www.steepandcheap.com/steepcheap/sac/jsdata.js', function(err, resp, body) {
		if (resp.statusCode == 200) {
			body = JSON.parse(body);
			
			if (body.currentItem.skuClass === previousItem) {
				return;
			}

			previousItem = body.currentItem.skuClass;

			for (image in body.currentItem.variants) break;
			var image = body.currentItem.variants[image].images.smallImage;
			var r = request(image).pipe(fs.createWriteStream('data/image.jpg'));
			
			r.on('close', function() {
				var message = 'SteepAndCheap "' + body.currentItem.productTitle +
					' - ' + body.currentItem.price +
					' (' + body.currentItem.percentOff +'% off)" -i ' + __dirname + '/data/image.jpg';
					
				console.log(message);
				exec('notify-send ' + message, function (err, stdout, stderr) {
					// console.log(err, stdout, stderr);
				});
			})
		}
	});
}

poll();
setInterval(poll, pollFrequency);
