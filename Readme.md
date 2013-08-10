
# SteepAndCheap.com Notifications

This is a tiny node.js app for SteepAndCheap.com notifications.  When using Mac or PC, it uses Growl, when using Linux, it uses notify-send (libnotify) to display the alerts.


## Requirements:

- Node.js (obviously)

#### Mac OS X:
- install [growlnotify(1)](http://growl.info/extras.php#growlnotify). On OS X 10.8, [Notification Center](https://github.com/alloy/terminal-notifier) is supported using terminal-notifier. To install:

     $ sudo gem install terminal-notifier

#### Windows:
- Download and install [Growl for Windows](http://www.growlforwindows.com/gfw/default.aspx)
- Download [growlnotify](http://www.growlforwindows.com/gfw/help/growlnotify.aspx) - IMPORTANT : Unpack growlnotify to a folder that is present in your path!

#### Linux (Ubuntu):
This should just work out of the box.  If for some reason you don't have libnotify, install it:

     $ sudo apt-get install libnotify-bin


## Installation

Download this app:

```
$ wget https://github.com/chieffancypants/SteepAndCheap/archive/master.zip
$ unzip master.zip
$ cd SteepAndCheap*
$ npm install
```

## Running the program:

```
$ node sacd.js
```
or simply:

```
$ ./sacd.js
```

## License

(The MIT License)

Copyright (c) 2013 Wes Cruver &lt;chieffancypants@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
