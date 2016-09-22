videomail-client ✉
==================

[![Build Status](https://travis-ci.org/binarykitchen/videomail-client.svg?branch=master)](https://travis-ci.org/binarykitchen/videomail-client)
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![gratipay][gratipay-image]][gratipay-url]

[npm-image]: https://img.shields.io/npm/v/videomail-client.svg?style=flat
[npm-url]: https://npmjs.org/package/videomail-client

[downloads-image]: https://img.shields.io/npm/dm/videomail-client.svg?style=flat
[downloads-url]: https://npmjs.org/package/videomail-client

[gratipay-url]: https://gratipay.com/binarykitchen/
[gratipay-image]: https://img.shields.io/gratipay/binarykitchen.svg

Record videos in contact forms!

Finally you can encode any webcam recordings from modern browsers and mobiles into MP4 + WebM within seconds. This without the need for Flash, Java nor any other plugins / addons. Just JavaScript.

* <a href="#examples">Examples</a>
* <a href="#demo">Demo / Fully working version</a>
* <a href="#options">Options</a>
* <a href="#api">API</a>
* <a href="#whitelist">Whitelist</a>
* <a href="#compatibility">Backward compatibility</a>
* <a href="#super-fast-cdn">Super fast global CDN</a>
* <a href="#changes">Breaking changes (Changelog)</a>
* <a href="#notes">Notes</a>

<a name="examples"></a>
## Examples

To run the examples in your browser with Gulp, just do:

1. `npm install`
2. `gulp examples` to ignite a static server and
3. open `https://localhost:8080` in your browser

(just ignore the invalid certificate warning, this will be fixed soon)

Best is to study `/examples/contact_form_json.html` which demonstrates how easy it is to integrate the videomail client into your own contact form.

## Dead simple example (just record and replay)

```html
<html>
  <body>
    <div id="videomail"></div>
    <script src="/dist/videomail-client.js"></script>
    <script>
      var VideomailClient = require('videomail-client'), // load videomail client package
          videomailClient = new VideomailClient({        // instantiate with some options
            verbose:       true,                         // prints additional info to console
            disableSubmit: true                          // disable submissions to keep example simple
          })

      // this will load your webcam, fill the placeholder containing
      // the `id="videomail"` with HTML and CSS code, place buttons and much more.
      videomailClient.show()
    </script>
  </body>
</html>
```

The included JS file `/dist/videomail-client.js` is already browserified and lies in the `dist` folder.

If you remove `disableSubmit`, then you will see a submit button to post the video and make it persistent. This requires a bit more code, see examples directory.

<a name="demo"></a>
## Demo / Fully working version

Check out the full version with all its features on [videomail.io](https://videomail.io) itself. Aim is to turn this into a stable product in the near future with some external assistance.

That site runs on AngularJS where I just include `require('videomail-client')` in the app logic and bundle all that through Browserify.

More live examples are coming.

<a name="options"></a>
## Options

There are many options you can pass onto the VideomailClient constructor. Check out the annotated source code at [src/options.js](https://github.com/binarykitchen/videomail-client/blob/master/src/options.js)

In most cases, these defaults are good enough. But `siteName` should be changed when you deploy your own site, see <a href="#whitelist">Whitelist</a>.

Looking at the examples in the `/examples` folder should give you some ideas how to use these options.

<a name="api"></a>
## API

* <a href="#constructor">`new VideomailClient()`</a>
* <a href="#on">`videomailClient.on()`</a>
* <a href="#show">`videomailClient.show()`</a>
* <a href="#build">`videomailClient.build()`</a>
* <a href="#replay">`videomailClient.replay()`</a>
* <a href="#startOver">`videomailClient.startOver()`</a>
* <a href="#get">`videomailClient.get()`</a>
* <a href="#canRecord">`videomailClient.canRecord()`</a>
* <a href="#unload">`videomailClient.unload()`</a>
* <a href="#hide">`videomailClient.hide()`</a>
* <a href="#isDirty">`videomailClient.isDirty()`</a>
* <a href="#submit">`videomailClient.submit()`</a>

<a name="constructor"></a>
### new VideomailClient([options])

The constructor accepts a JSON with optional <a href="#options">options</a>. Example:

```js
var videomailClient = new VideomailClient({siteName: 'my site name'})
```

<a name="on"></a>
### videomailClient.on([event,] [callback])

The VideomailClient class is inherited from EventEmitter and emits lots of useful events for your app. Here an example:

```js
videomailClient.on('FORM_READY', function() {
    // form is ready for recording
})

videomailClient.on('SUBMITTED', function(videomail, response) {
    // continue with your own app logic
    // check out /examples/contact_form.html on how to integrate into your contact form
})
```

#### Supported events:

Check them out at [src/events.js](https://github.com/binarykitchen/videomail-client/blob/master/src/events.js)

They should be self-explanatory. If not, ask for better documentation. Then, some of these events may come with parameters.

The videomail client already comes with internal error handling mechanism so there is no need to add code to display errors. But depending on your app logic you might want to process errors further with your own error listeners.

By the way, all videomail errors are instances of `VideomailError`, inherited from the native Error class and come with additional attributes, useful for debugging weird errors.

<a name="show"></a>
### videomailClient.show()

Automatically fills the DOM with a form for video recording. By default the HTML element with the ID `videomail` will be filled, see options.

<a name="replay"></a>
### videomailClient.replay(videomail[, parentElement])

Manually adds a video container for the given videomail inside the parent element. This is mostly called after a successfull submission. See `/examples/direct_submit.html` or `/examples/contact_form_json.html` for some inspiration.

If the `parentElement` is an ID (string), then it will be resolved into a DOM element internally. If no parent element is given, then a replay container within the containerId is automatically generated.

Also note that, when the parent element already contains a video container like this

```html
<video class="replay"></video>
```

then this will be used instead of adding a new dom element.

Furthermore the `replay()` method also detects whether the parent element has placeholders to fill with form data. To understand this better, check out how the subject in the `/examples/direct_submit.html` example is being displayed upon replay.

<a name="startOver"></a>
### videomailClient.startOver()

Start all over again, resets everything and go back to the ready state. Useful if you want to submit another videomail within the same instance.

<a name="get"></a>
### videomailClient.get(key, cb)

Queries a videomail (JSON) by a given key. When submitted, you get the key from the `submitted` event and can use that for storage and future queries of videomails.

<a name="canRecord"></a>
### videomailClient.canRecord()

An utility function which returns true if the current browser is capable of webcam recording. It returns false for <a href="#compatibility">incompatible</a> browsers.

<a name="unload"></a>
### videomailClient.unload()

Manually unloads the webcam and all other internal event listeners. Can be used in conjunction with single page apps, for example with AngularJS' destroy event:

```js
$scope.$on('$destroy', videomailClient.unload.bind(videomailClient))
```

<a name="hide"></a>
### videomailClient.hide()

Hides all the visuals (but does not unload anything).

<a name="isDirty"></a>
### videomailClient.isDirty()

Returns true when a video has been recorded and a form exists. Useful when checking something before closing the window, i.E. this use case: show a window confirmation dialog to make sure the user didn't forget to submit the recorded video.

<a name="submit"></a>
### videomailClient.submit()

For advanced use only: especially when the submit button is covered with other HTML layers and the videomail client fails to process the click event.

Calling this function will manually trigger a submission of the recorded videomail. But only when everything else is valid. Nothing will happen when invalid.

<a name="whitelist"></a>
## Whitelist

Examples will work right away on [http://localhost:8080](http://localhost:8080). This is because localhost is whitelisted on the remote Videomail server. `127.0.0.1:8080` is whitelisted too for local development. Other IP addresses won't work.

In other words, if your web server is connected through a domain besides localhost, the Videomail-Client is restricted from sending the media packets to the remote Videomail server which is responsible for storing and sending video mails. To fix that, please reach me at [https://binarykitchen.com](https://binarykitchen.com) and you will get a new site name and a list of whitelisted URLs for your own usage.

<a name="compatibility"></a>
## Backward compatibility

Forget the old IE, Safari and iPhones/iPads because they still don't support `getUserMedia()`. Do not blame me but Apple + Microsoft *chuckle* - but these browsers work like a charm:

* Firefox >= 34
* Google Chrome >= 32
* Microsoft Edge >= 1 (is that IE 12?)
* Internet Explorer >= 12
* Opera >= 26
* Chrome for Android >= 39
* Android Browser >= 37

Source: [http://caniuse.com/#search=getUserMedia](http://caniuse.com/#search=getUserMedia)

PS: On Safari and iPhones/iPads you can play the videomails fine without any issues. Repeating: there is just no recording functionality for them.

<a name="super-fast-cdn"></a>
## Super fast global CDN

You can grab the already browserified videomail-client JS file through GitHub's rawgit server which is proxied by [MaxCDN's](http://www.maxcdn.com/) super fast global CDN:
```
https://cdn.rawgit.com/binarykitchen/videomail-client/<version number>/dist/videomail-client.js
```
For example for version 1.10.21, use this in your production site:
https://cdn.rawgit.com/binarykitchen/videomail-client/1.10.21/dist/videomail-client.min.js

If for whatever reason that GitHub CDN doesn't meet your standard, here's another CDN to try:
https://cdnjs.com/libraries/videomail-client

<a name="changes"></a>
## Breaking/Hot Changes (Changelog)

### v1.18.0 (2016-08-28)

- **VideomailClient:** New functiion `submit()` to manually submit a videomail

### v1.9.0 (2016-03-12)

- **VideomailClient:** Removed the `containerId` option in `show()` - define it in the constructor under options instead.

### v1.8.0 (2016-02-26)

- **VideomailClient:** Very long pauses are now possible. This thanks to pings to keep connection to server alive.

### v1.7.0 (2015-12-5)

- **VideomailClient:** New option to switch audio recording on or off `options.audio.switch`
- **VideomailClient:** Removed Flash solution for good

### v1.6.0 (2015-09-20)

- **VideomailClient:** Changed order of arguments `VideomailClient.replay(parentElement, videomail)` to `VideomailClient.replay(videomail[, parentElement])`

### v1.5.0 (2015-08-18)

Minor change:
- **VideomailClient:** Renamed `options.buttons.stopButtonClass` to `options.buttons.previewButtonClass`

### v1.4.0 (2015-08-11)

Minor change:
- **VideomailClient:** Renamed `options.buttons.backButtonClass` to `options.buttons.recordAgainButtonClass`
- **VideomailClient:** Merged `back` and `record` button actions to `recordAgain`

### v1.3.0 (2015-07-03)

Minor change:
- **VideomailClient:** Renamed `options.debug` to `options.verbose`

### v1.2.0 (2015-05-17)

- **VideomailClient:** Renamed `VideomailClient.form()` to `VideomailClient.show()`

### v1.1.0 (2015-04-18)

- **VideomailClient:** Do not initialize the client in the global scope but return an object. Replace `VideomailClient.init()` with `new VideomailClient()`
  ([#3](https://github.com/binarykitchen/videomail-client/issues/3))

<a name="notes"></a>
## Notes

### Unfinished Metamorphosis (aka Development)

This is just the beginning. I will add a lot more over time.

Bear with me, there are lots of problems to crack, especially with the performance, audio part and some unit tests are missing. I do not want to waste too much time on perfection unless it's proven to work then I rewrite piece by piece.

### Credits

These guys helped and/or inspired me for this mad project:

* Heath Sadler
* Zack Best
* Sonia Pivac
* Isaac Johnston
* Dominic Tarr
* Daniel Ly
* Nicholas Buchanan
* Kelvin Wong

They all deserve lots of beer and love. That order is irrelevant.

### Code quality

I admit, code isn't top notch and needs lots of rewrites. Believe me or not, I already rewrote about three times in the last four years. Good example that software hardly can be perfect. And since I am already honest here, I think stability and bugfixes come first before perfection otherwise you'll loose users. Reality you know.

Anyway, on the next rewrite I'd probably pick [React](https://facebook.github.io/react/) or better [re-frame](https://github.com/Day8/re-frame) because the Videomail-Client depends heaviliy on application states.

### Final philosophy

This planet is completely sold. And talk is overrated. That's why my primary goal is not to turn this into a commercial product but to promote a cool but underestimated language: Sign Language.
