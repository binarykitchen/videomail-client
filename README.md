videomail-client ✉
==================

[![Build Status](https://travis-ci.org/binarykitchen/videomail-client.svg?branch=master)](https://travis-ci.org/binarykitchen/videomail-client)
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/standard.svg?style=flat
[npm-url]: https://npmjs.org/package/videomail-client
[downloads-image]: https://img.shields.io/npm/dm/standard.svg?style=flat
[downloads-url]: https://npmjs.org/package/videomail-client

Finally you can encode any webcam recordings from your browser into MP4 and WebM within seconds. This without the need for Flash, Java nor any other plugins / addons. Just JavaScript.

## Demo / Fully working version

Check out the full version with all its features on [Videomail](https://videomail.io) itself.

That site runs on AngularJS where I only have these two code lines ...

```js
// loads Videomail into global scope
require('videomail-client')

// initialises with defaults into the HTML container with id='videomail'
Videomail.init()
```

... and bundle all that through Browserify. Awesome stuff!

## Examples

To run the examples in the repo in your local browser, just do this:

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
                    debug:          true,
                    disableSubmit:  true
                })
            })
        </script>
    </body>
</html>
```

This will load your webcam, fill that placeholder containing the `id="videomail"` with HTML and CSS code, place buttons such as `record`, `pause`, `stop` and much more. Easy. It does all the hard work for you.

The included JS file `/dist/videomail-client.js` is already browserified and lies in the `dist` folder.

With the `debug` option you see additional information in the console. This to enhance DX. If you remove `disableSubmit` then you will see a submit button to post the video and make it persistent.

## Options

These are the default options:

```js
{
    logger:             console,
    debug:              false,
    timeout:            5000,
    baseUrl:            'https://videomail.io',
    socketUrl:          'wss://videomail.io',
    reconnect:          true,
    cache:              true,
    insertCss:          true,
    enablePause:        true,
    enableAutoPause:    true,
    enableSpace:        true,
    disableSubmit:      false,
    selectors: {
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
        submitButtonClass: 'submit'
    },
    audio: {
        enabled: false
    },
    video: {
        fps:            15,
        limitSeconds:   30,
        countdown:      3,
        width:          320,
        height:         240
    },
    image: {
        quality:    .5,
        types:      ['webp', 'jpeg']
    },
    text: {
        paused:         'Paused',
        processing:     'Processing',
        limitReached:   'Limit reached'
    },
    notifier: {
        entertain:         false,
        entertainClass:    'bg',
        entertainLimit:    7,
        entertainInterval: 15000
    }
}
```

You can change any of these through the `Videomail.init({ ... })` call.

If you look into the `/examples` folder, you'll spot great examples on how to alter these options the correct way.

## API

* <a href="#init">`client.init()`</a>
* <a href="#onEvent">`controller.on()`</a>
* <a href="#isReady">`controller.isReady()`</a>
* <a href="#isValid">`controller.isValid()`</a>

<a name="init"></a>
### client.init([options,] [callback])

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

The Videomail-Client already comes with internal error handling mechanism so there is no need to add code to display errors.

<a name="onEvent"></a>
### controller.on([event,] [callback])

The videomail controller emits lots of useful events for your app. Here an example:

```js
Videomail.init({
    debug: true
}, function(err, controller) {
    controller.on('ready', function() {
        // enable a button somewhere
    })
})
```

Supported events: `connected`, `ready`, `resetting`, `countdown`, `recording`, `progress`, `stopping`, `notifying`, `blocking`, `beginVideoEncoding`, `beginAudioEncoding`, `preview`, `paused`, `resuming`, `submitting` and `submitted`.

<a name="isReady"></a>
### `controller.isReady()`

Tells if the controller is ready to start a recording.

<a name="isValid"></a>
### `controller.isValid()`

Returns a boolean saying whether there are any valid recordings, ready to submit.

## Whitelist

Examples will work right away on [http://localhost:8080](http://localhost:8080). This because localhost is whitelisted on the remote Videomail server.

In other words, if you deploy your piece on your own remote server, it won't work because that URL is not on the Videomail whitelist. To fix that, just reach me at [https://binarykitchen.com/contact](https://binarykitchen.com/contact).

Like that I can make sure that my hard work won't be misused for bad stuff.

## Backward compatibility

Forget IE, Safari and iPhones because they still don't support `getUserMedia()`, *chuckle* - whereas these browsers do work fine like a charm:

* Firefox >= 33
* Chrome >= 31
* Opera >= 26
* Chrome for Android >= 39
* Android Browser >= 37

Source: [http://caniuse.com/#search=getUserMedia](http://caniuse.com/#search=getUserMedia)

## Unfinished Metamorphosis (aka Development)

This is just the beginning. I will add a lot more over time.

It makes heavy use of other npm modules. I try to plug together as many well-known, robust but tiny modules as possible.

Bear with me, there are lots of problems to crack, especially with the audio part and some unit tests are missing. Working on it ...

## Coming soon / Planned

1. `post()`, `delete()`, `get()` and `list()` operations
2. E2E tests
3. Fix audio recording

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

This planet is completely sold. Talk is overrated. My primary goal is not to turn this into a commercial product but to promote a cool language: Sign Language.
