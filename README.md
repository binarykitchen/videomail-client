videomail-client
================

[![Build Status](https://travis-ci.org/binarykitchen/videomail-client.svg?branch=master)](https://travis-ci.org/binarykitchen/videomail-client)

A revolutionary node.js module which enables you to record videos directly in the browser, wohooo!

Finally you can encode any webcam recordings into MP4 and WebM within seconds. This without the need for Flash, Java nor any other crap.

## Demo / Fully working version

Check out the full version with all its features on https://videomail.io itself.

That site runs on AngularJS where I just `require('videomail-client')`, initialise it with `Videomail.init()` and bundle all that through Browserify. Awesome stuff!

## Examples

To run the examples in your local browser, just do this:

1. `npm install`
2. Ignite static server with `gulp examples` and
3. Open `http://localhost:8080` in your browser

## Dead simple example

```html
<html>
    <body>
        <!--Placeholder for the webcam video, will be automatically filled-->
        <div id="videomail"></div>

        <!--Include the browserified version of this library-->
        <script async src="/dist/videomail-client.js"></script>

        <script>
            window.addEventListener('load', function() {
                Videomail.init({
                    debug: true
                })
            })
        </script>
    </body>
</html>
```

This will load your webcam, fill the placeholder with HTML and CSS code, place buttons such as `record`, `pause`, `stop` and much more. Easy.

## Options

These are the default options:

```js
{
    logger:         console,
    debug:          false,
    timeout:        6000,
    baseUrl:        'https://videomail.io',
    socketUrl:      'wss://videomail.io',
    reconnect:      true,
    cache:          true,
    insertCss:      true,
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
    },
    audio: {
        enabled: false
    },
    video: {
        fps:            15,
        limitSeconds:   60,
        countdown:      3,
        width:          320,
        height:         240
    },
    image: {
        quality:    .8,
        types:      ['webp', 'jpeg']
    },
    text: {
        paused: 'Paused'
    }
}
```

You can change any of these through the `Videomail.init({ ... })` call.

## Whitelist

Examples will work right away on localhost at port 8080. This because localhost is whitelisted on the remote Videomail server.

In other words, if you deploy your piece on your own remote server, it won't work because that URL is not on the Videomail whitelist. To fix that, just reach me at https://binarykitchen.com/contact

Like that I can make sure that my hard work won't be misused for bad stuff.

## Backward compatibility

Forget IE, Safari and iPhones because they still doesn't support `getUserMedia()`, *chuckle* - whereas these browsers do work fine like a charm:

* Firefox >= 33
* Chrome >= 31
* Opera >= 26
* Chrome for Android >= 39
* Android Browser >= 37

## Development

This is just the beginning. I will add a lot more over time.

Bear with me, there are lots of problems to crack, especially the audio part. Working on it ...

## Credits

These guys helped and/or inspired me for this mad project:

* Heath Sadler
* Isaac Johnston
* Dominic Tarr
* Sonia Pivac
* Daniel Noelpp
* Nicholas Buchanan
* Kelvin Wong
