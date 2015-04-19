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

Finally you can encode any webcam recordings from your browser into MP4 and WebM within seconds. This without the need for Flash, Java nor any other plugins / addons. Just JavaScript.

* <a href="#examples">Examples</a>
* <a href="#demo">Demo / Fully working version</a>
* <a href="#options">Options</a>
* <a href="#api">API</a>
* <a href="#whitelist">Whitelist</a>
* <a href="#compatibility">Backward compatibility</a>
* <a href="#changes">Breaking changes (Changelog)</a>
* <a href="#notes">Notes</a>

<a name="examples"></a>
## Examples

To run the examples in your browser, just do this:

1. `npm install`
2. `gulp examples` which will ignite a static server and
3. open `http://localhost:8080` in your browser

## Dead simple example (just record and replay)

```html
<html>
  <body>
    <div id="videomail"></div>
    <script src="/dist/videomail-client.js"></script>
    <script>
      var VideomailClient = require('videomail-client'), // load the videomail client package
          videomailClient = new VideomailClient({        // instantiate with some options
            debug:         true,                         // debug prints additional info to console
            disableSubmit: true                          // disable submissions to keep example simple
      })

      // this will load your webcam, fill the placeholder containing
      // the `id="videomail"` with HTML and CSS code, place buttons and much more.
      videomailClient.form()
    </script>
  </body>
</html>
```

The included JS file `/dist/videomail-client.js` is already browserified and lies in the `dist` folder.

If you remove `disableSubmit` then you will see a submit button to post the video and make it persistent. This requires a little more code, see examples directory.

<a name="demo"></a>
## Demo / Fully working version

Check out the full version with all its features on [videomail.io](https://videomail.io) itself. My aim is to turn this into a stable product in the near future with some external assistance.

That site runs on AngularJS where I just include `require('videomail-client')` in the app logic and bundle all that through Browserify.

<a name="options"></a>
## Options

These are the default options, located under `/src/options.js`:

```js
{
    logger:                 console,                // define logging instance
    debug:                  false,                  // set true to log more info
    baseUrl:                'https://videomail.io', // leave as it, permanent url to post videos
    socketUrl:              'wss://videomail.io',   // leave as it, permanent url to send frames
    siteName:               'videomail-client-demo',// Required for the API. If you change it, contact me
    reconnect:              true,                   // automatically reconnects
    cache:                  true,                   // reduces GET queries when loading videos
    insertCss:              true,                   // inserts predefined CSS, see examples
    enablePause:            true,                   // enable pause/resume button
    enableAutoPause:        true,                   // automatically pauses when window becomes inactive
    enableSpace:            true,                   // hitting space can pause recording
    disableSubmit:          false,                  // set this to true if you do not want to submit videos,
                                                    // but just want to record and replay these temporarily
    enableAutoValidation:   true,                   // automatically validates all form inputs if any exist

    selectors: {                                    // default CSS selectors you can alter, see examples
        containerId:    'videomail',
        replayClass:    'replay',
        userMediaClass: 'userMedia',
        visualsClass:   'visuals',
        buttonsClass:   'buttons',

        recordButtonClass: 'record',
        pauseButtonClass:  'pause',
        resumeButtonClass: 'resume',
        stopButtonClass:   'stop',
        backButtonClass:   'back',
        submitButtonClass: 'submit',

        submitButtonId:    'submitBtn',
        formId:            null
    },
    audio: {
        enabled: false                              // experimental, not working properly yet
    },
    video: {
        fps:            15,                         // depends on your connection
        limitSeconds:   30,                         // recording automatically stops after that limit
        countdown:      3,                          // set it to 0 or false to disable it
        width:          320,
        height:         240
    },
    image: {
        quality:    .5,
        types:      ['webp', 'jpeg']                // recommended settings to make most of all browsers
    },
    text: {
        paused:         'Paused',                   // alter these text if you have internationalisation
        processing:     'Processing',
        limitReached:   'Limit reached'
    },
    notifier: {
        entertain:         false,                   // when true, user is entertained while waiting, see examples
        entertainClass:    'bg',
        entertainLimit:    7,
        entertainInterval: 15000
    },
    timeouts: {
        userMedia:  7e3,                            // increase if you want user give more time to enable webcam
        connection: 1e4                             // increase if connection is slow
    },
    displayErrors:    true,                         // show errors inside the container?
    fakeUaString:     null                          // just for testing purposes to simulare VM on diff browsers
}
```

You can change any of these with your own and pass these onto the VideomailClient constructor:

```js
var videomailClient = new VideomailClient({siteName: 'my site name'})
```

Looking at the examples in the `/examples` folder should give you some ideas how to use these.

<a name="api"></a>
## API

* <a href="#constructor">`new VideomailClient()`</a>
* <a href="#on">`videomailClient.on()`</a>
* <a href="#form">`videomailClient.form()`</a>
* <a href="#unload">`videomailClient.unload()`</a>
* <a href="#replay">`videomailClient.replay()`</a>
* <a href="#startOver">`videomailClient.startOver()`</a>
* <a href="#get">`videomailClient.get()`</a>

<a name="constructor"></a>
### new VideomailClient([options])

The constructor accepts a JSON with optional <a href="#options">options</a>.

<a name="on"></a>
### videomailClient.on([event,] [callback])

The VideomailClient class is inherited from EventEmitter and emits lots of useful events for your app. Here an example:

```js
videomailClient.on('formReady', function() {
    // form is ready for recording
})

videomailClient.on('submitted', function(videomail, response) {
    // continue with your own app logic
})
```

#### Supported events:
`formReady`, `connected`, `userMediaReady`, `resetting`, `countdown`, `recording`, `progress`, `stopping`, `notifying`, `blocking`, `beginVideoEncoding`, `beginAudioEncoding`, `validating`, `preview`, `paused`, `resuming`, `submitting`, `submitted`, `previewShown` and `replayShown`.

They should be self-explanatory. If not, ask for better documentation. Then, some of these events have parameters.

The videomail client already comes with internal error handling mechanism so there is no need to add code to display errors. But depending on your app logic you might want to process errors further with your own error listeners.

<a name="form"></a>
### videomailClient.form()

Automatically fills the DOM with a form for video recording. If a HTML element exist with the ID defined under options `{ selectors.containerId }`, that placeholder will be filled.

By default `{ selectors.containerId }` is set to `videomail`.

<a name="unload"></a>
### videomailClient.unload()

Manually unloads the webcam and all other internal event listeners. Can be used in conjunction with single page apps, for example with AngularJS' destroy event:

```js
$scope.$on('$destroy', videomailClient.unload.bind(videomailClient))
```

<a name="replay"></a>
### videomailClient.replay(parentElement, videomail)

Manually adds a video container for the given videomail inside the parent element. This is mostly called after a successfull submission. See `/examples/submit.html` for some inspiration.

If the parent element already contains a video container like this

```html
<video class="replay"></video>
```

then this will be used instead of adding a new dom element.

<a name="startOver"></a>
### videomailClient.startOver()

Start all over again, resets everything and go back to the ready state. Useful if you want to submit another videomail within the same instance.

<a name="get"></a>
### videomailClient.get(key, cb)

Queries a videomail (JSON) by a given key. When submitted, you get the key from the `submitted` event and can use that for storage and future queries of videomails.

<a name="whitelist"></a>
## Whitelist

Examples will work right away on [http://localhost:8080](http://localhost:8080). This is because localhost is whitelisted on the remote Videomail server.

In other words, if your web server is connected through a domain besides localhost, the Videomail-Client is restricted from sending the media packets to the remote Videomail server which is responsible for storing and sending video mails. To fix that, please reach me at [https://binarykitchen.com/contact](https://binarykitchen.com/contact) and you will get a new site name and a list of whitelisted URLs for your own usage.

<a name="compatibility"></a>
## Backward compatibility

Forget IE, Safari and iPhones because they still don't support `getUserMedia()`, *chuckle* - whereas these browsers work like a charm:

* Firefox >= 33
* Chrome >= 31
* Opera >= 26
* Chrome for Android >= 39
* Android Browser >= 37

Source: [http://caniuse.com/#search=getUserMedia](http://caniuse.com/#search=getUserMedia)

<a name="changes"></a>
## Breaking changes (Changelog)

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

They all deserve lots of love.

### Final philosophy

This planet is completely sold. And talk is overrated. that's why my primary goal is not to turn this into a commercial product but to promote a cool but underestimated language: Sign Language.
