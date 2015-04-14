videomail-client ✉
==================

[![Build Status](https://travis-ci.org/binarykitchen/videomail-client.svg?branch=master)](https://travis-ci.org/binarykitchen/videomail-client)
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/videomail-client.svg?style=flat
[npm-url]: https://npmjs.org/package/videomail-client
[downloads-image]: https://img.shields.io/npm/dm/videomail-client.svg?style=flat
[downloads-url]: https://npmjs.org/package/videomail-client

Finally you can encode any webcam recordings from your browser into MP4 and WebM within seconds. This without the need for Flash, Java nor any other plugins / addons. Just JavaScript.

## Demo / Fully working version

Check out the full version with all its features on [videomail.io](https://videomail.io) itself.

That site runs on AngularJS where I only have these two code lines ...

```js
// loads Videomail into global scope
require('videomail-client')

// initialises the client with defaults
// inside the HTML container with the ID 'videomail'
Videomail.init()
```

... and bundle all that through Browserify. Enough said.

## Examples

To run the examples in your browser, just do this:

1. `npm install`
2. Ignite static server with `gulp examples` and
3. Open `http://localhost:8080` in your browser

## Dead simple example (just record and replay)

```html
<html>
    <body>
        <div id="videomail"></div>
        <script async src="/dist/videomail-client.js"></script>
        <script>
            window.addEventListener('load', function() {
                Videomail.init({
                    debug:         true, // outputs interesting stuff into the console
                    disableSubmit: true  // submissions disabled to keep example simple
                })
            })
        </script>
    </body>
</html>
```

This will load your webcam, fill that placeholder containing the `id="videomail"` with HTML and CSS code, place buttons such as `record`, `pause`, `stop` and much more. Easy. It does all the hard work for you.

The included JS file `/dist/videomail-client.js` is already browserified and lies in the `dist` folder.

With the `debug` option you see additional information in the console. This to enhance DX. If you remove `disableSubmit` then you will see a submit button to post the video and make it persistent. This requires a little more code, see examples directory.

## Options

These are the default options:

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

You can change any of these through the `Videomail.init({ ... })` call.

If you look into the `/examples` folder, you'll spot great examples on how to use these options the correct way.

## API

* <a href="#init">`Videomail.init()`</a>
* <a href="#onEvent">`controller.on()`</a>
* <a href="#unload">`controller.unload()`</a>
* <a href="#addReplay">`controller.addReplay()`</a>

<a name="init"></a>
### Videomail.init([options,] [callback])

The init function accepts a JSON with options and its optional callback returns either an error or an instance of the videomail controller.

Both arguments are optional.

Example:

```js
Videomail.init({
    debug: true
}, function(err, controller) {
    ...
})
```

The Videomail-Client already comes with internal error handling mechanism however depending on your app logic you might want to process errors further.

<a name="onEvent"></a>
### controller.on([event,] [callback])

The videomail controller emits lots of useful events for your app. Here's a quick example:

```js
Videomail.init({
    debug: true
}, function(err, controller) {
    controller.on('ready', function() {
        // enable a button somewhere
    })

    controller.on('submitted', function(videomail, response) {
        // continue with your own app logic
    })
})
```

#### Supported events: 
`connected`, `ready`, `resetting`, `countdown`, `recording`, `progress`, `stopping`, `notifying`, `blocking`, `beginVideoEncoding`, `beginAudioEncoding`, `validating`, `preview`, `paused`, `resuming`, `submitting`, `submitted`, `previewShown` and `replayShown`.

Some of these events have parameters.

<a name="unload"></a>
### `controller.unload()`

Manually unloads the webcam and all other internal event listeners. Can be used in conjunction with AngularJS' destroy event, for example:

```js
$scope.$on('$destroy', controller.unload.bind(controller))
```

<a name="addReplay"></a>
### `controller.addReplay(parentElement, videomail)`

Manually adds a video container for the given videomail inside the parent element. This is mostly called after a successfull submission.

If the parent element already contains a video container like this

```html
<video class="replay"></video>
```

then this will be used instead of adding a new dom element.

For a full example how to use addReplay() properly, check out the `submit.html` inside the examples directory.

## Whitelist

Examples will work right away on [http://localhost:8080](http://localhost:8080). This is because localhost is whitelisted on the remote Videomail server.

In other words, if your web server is connected through a domain besides localhost, the web client is restricted from sending the media packets to binarykitchen server which is responsible for storing video mails. To fix that, please reach me at [https://binarykitchen.com/contact](https://binarykitchen.com/contact) and you will get a new site name and a list of whitelisted URLs for your own usage.

## Backward compatibility

Forget IE, Safari and iPhones because they still don't support `getUserMedia()`, *chuckle* - whereas these browsers work like a charm:

* Firefox >= 33
* Chrome >= 31
* Opera >= 26
* Chrome for Android >= 39
* Android Browser >= 37

Source: [http://caniuse.com/#search=getUserMedia](http://caniuse.com/#search=getUserMedia)

## Unfinished Metamorphosis (aka Development)

This is just the beginning. I will add a lot more over time.

Bear with me, there are lots of problems to crack, especially with the audio part and some unit tests are missing. Working on it ...

## Coming soon / Planned

1. `delete()`, `get()` and `list()` operations
2. Audio recording
3. E2E tests

## Credits

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

## Final philosophy

This planet is completely sold. Talk is overrated. My primary goal is not to turn this into a commercial product but to promote a cool but underestimated language: Sign Language.
