# videomail-client ✉

[![Test Runner for videomail-client](https://github.com/binarykitchen/videomail-client/actions/workflows/ci.yml/badge.svg)](https://github.com/binarykitchen/videomail-client/actions/workflows/ci.yml)

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![Netlify Status](https://api.netlify.com/api/v1/badges/3c9df5b4-8b85-4081-950a-d5df2dbd9926/deploy-status)](https://app.netlify.com/sites/videomail-client/deploys)

[npm-image]: https://img.shields.io/npm/v/videomail-client.svg?style=flat
[npm-url]: https://npmjs.org/package/videomail-client
[downloads-image]: https://img.shields.io/npm/dm/videomail-client.svg?style=flat
[downloads-url]: https://npmjs.org/package/videomail-client

Record videos in contact forms!

Finally you can encode any webcam recordings from modern browsers and mobiles into MP4 + WebM within seconds.
This without the need for Flash, Java nor any other plugins / addons. Just TypeScript, compiled into ESM (ES2022) with their declarations.

- <a href="#storybook">Storybook (examples)</a>
- <a href="#demo">Demo / Fully working version</a>
- <a href="#options">Options</a>
- <a href="#api">API</a>
- <a href="#form">Form Submissions</a>
- <a href="#whatisstored">What gets stored on the videomail server?</a>
- <a href="#whitelist">Whitelist</a>
- <a href="#compatibility">Backward compatibility</a>
- <a href="#addons">Addons</a>
- <a href="#notes">Notes</a>

<a name="storybook"></a>

## Storybook (examples)

To check out some examples in your browser, just run these two commands:

1. `npm install`
2. `npm run storybook`

That's it. Easy as apple pie.

<a name="demo"></a>

## Demo

A mirror of latest videomail-client can be seen on [videomail-client.netlify.com](https://videomail-client.netlify.com/)

### Real world usages

Check out the full version with all its features on [videomail.io](https://videomail.io) itself. Aim is to turn this into a stable product in the near future with some external assistance.

On that site I just include `import { VideomailClient}  from "videomail-client"` in the app logic.

Another live example would be https://seeflow.co.nz/contact or https://www.deaf.org.nz/contact
There are plenty if you just ask us. And way more will follow, we are rolling ...

<a name="options"></a>

## Options

There are many options you can pass onto the VideomailClient constructor. Check out the annotated source code at [src/options.ts](https://github.com/binarykitchen/videomail-client/blob/master/src/options.ts)

In most cases, these defaults are good enough. But `siteName` should be changed when you deploy your own site, see <a href="#whitelist">Whitelist</a>.

Looking at the examples in the `/src/stories` folder should give you some ideas how to use these options.

<a name="api"></a>

## API

- <a href="#constructor">`new VideomailClient()`</a>
- <a href="#on">`videomailClient.on()`</a>
- <a href="#show">`videomailClient.show()`</a>
- <a href="#hide">`videomailClient.hide()`</a>
- <a href="#record">`videomailClient.record()`</a>
- <a href="#replay">`videomailClient.replay()`</a>
- <a href="#startOver">`videomailClient.startOver()`</a>
- <a href="#getByAlias">`videomailClient.getByAlias()`</a>
- <a href="#getByKey">`videomailClient.getByKey()`</a>
- <a href="#unload">`videomailClient.unload()`</a>
- <a href="#hide">`videomailClient.hide()`</a>
- <a href="#isDirty">`videomailClient.isDirty()`</a>
- <a href="#isRecording">`videomailClient.isRecording()`</a>
- <a href="#isBuilt">`videomailClient.isBuilt()`</a>
- <a href="#submit">`videomailClient.submit()`</a>
- <a href="#getLogLines">`videomailClient.getLogLines()`</a>
- <a href="#setLimitSeconds">`videomailClient.setLimitSeconds()`</a>

<a name="constructor"></a>

### new VideomailClient([options])

The constructor accepts a JSON with optional <a href="#options">options</a>. Example:

```ts
const videomailClient = new VideomailClient({ siteName: "my site name" });
```

<a name="on"></a>

### videomailClient.on([event,] [callback])

The VideomailClient class is inherited from EventEmitter and emits lots of useful events for your app. Here an example:

```ts
videomailClient.on("FORM_READY", () => {
  // form is ready for recording
});

videomailClient.on("SUBMITTED", ({ videomail, response }) => {
  // continue with your own app logic in your javascript code if you want to process
  // something else further after form submission.
});
```

#### Supported events:

Check them out at [src/types/events/index.ts](https://github.com/binarykitchen/videomail-client/blob/master/src/types/events/index.ts)

They should be self-explanatory. If not, ask for better documentation. Then, some of these events may come with parameters.

The videomail client already comes with internal error handling mechanism so there is no need to add code to display errors. But depending on your app logic you might want to process errors further with your own error listeners.

By the way, all videomail errors are instances of `VideomailError`, inherited from the native Error class and come with additional attributes, useful for debugging weird errors.

<a name="show"></a>

### videomailClient.show()

Automatically fills the DOM with a form for video recording. By default the HTML element with the ID `videomail` will be filled, see options.

<a name="record"></a>

### videomailClient.record()

Forcefully starts recording without the need to press on a record button. Useful for special situations.

<a name="replay"></a>

### videomailClient.replay(videomail[, parentElementId])

Manually adds a video container for the given videomail inside the parent element. See stories for some inspiration.

If the `parentElement` is an ID (string), then it will be resolved into a DOM element internally. If no parent element is given, then a replay container within the containerId is automatically generated.

Also note that, when the parent element already contains a video container like this

```html
<video class="replay"></video>
```

then this will be used instead of adding a new dom element.

<a name="startOver"></a>

### videomailClient.startOver()

Start all over again, resets everything and go back to the ready state. Useful if you want to submit another videomail within the same instance.

<a name="getByAlias"></a>

### videomailClient.getByAlias(alias)

Queries a videomail (JSON) asynchronously by a given alias for further queries or processing. There are two ways to get the alias:

1. The form submission to your own server has it under `videomail_alias` in the form body.
2. Get the alias from the `submitted` event and use it further within your code.

<a name="unload"></a>

### videomailClient.unload()

Manually unloads the webcam and all other internal event listeners.

<a name="hide"></a>

### videomailClient.hide()

Hides all the visuals (but does not unload anything).

<a name="isDirty"></a>

### videomailClient.isDirty()

Returns true when a video has been recorded and a form exists. Useful when checking something before closing the window, i.E. this use case: show a window confirmation dialog to make sure the user didn't forget to submit the recorded video.

<a name="isRecording"></a>

### videomailClient.isRecording()

Returns true when a video is currently being recorded.

<a name="submit"></a>

### videomailClient.submit()

For advanced use only: especially when the submit button is covered with other HTML layers and the videomail client fails to process the click event.
Calling this function will manually trigger a submission of the recorded videomail. But only when everything else is valid. Nothing will happen when invalid.

<a name="getLogLines"></a>

### videomailClient.getLogLines()

For advanced use only: returns you a collection of log lines that show what code has been covered recently. Useful if you want to debug something tricky.

<a name="setLimitSeconds"></a>

### videomailClient.setLimitSeconds()

For advanced use only: sets the recording time limit in seconds. Useful if you want to dynamically change the recording duration.

<a name="whatisstored"></a>

## What gets stored on the videomail server?

Here is an example JSON showing what videomail meta data exists, gets stored on the server and you can grab yourself for further use.
It's emitted in the SUBMITTED event under the videomail object:

```json
{
  "subject": "some subject",
  "from": "some@sender.com",
  "body": "A text body",
  "recordingStats": {
    "avgFps": 15.151515151515152,
    "wantedFps": 15,
    "avgInterval": 62.09090909090909,
    "wantedInterval": 66.66666666666667,
    "intervalSum": 683,
    "framesCount": 11,
    "videoType": "webm",
    "waitingTime": 192
  },
  "width": 320,
  "height": 240,
  "videomailClientVersion": "2.4.11",
  "siteName": "videomail-client-demo",
  "alias": "some-subject-183622500964",
  "dateCreated": 1541130589811,
  "url": "https://videomail.io/videomail/some-subject-150322500964",
  "key": "11e8-de52-55ac2630-b22b-71959562a989",
  "expirationPretty": "1 hour",
  "expiresAfter": 1541134189811,
  "siteTitle": "Videomail Client Example",
  "webm": "https://videomail.io/videomail/some-subject-183622500964/type/webm/",
  "poster": "https://videomail.io/videomail/some-subject-183622500964/poster/",
  "dateCreatedPretty": "Nov 2, 2018, 4:49 PM",
  "expiresAfterPretty": "Nov 2, 2018, 5:49 PM",
  "expiresAfterIso": "2018-11-02T04:49:49.811Z"
}
```

You also can get all the above using the `videomailClient.getByKey()` API call.

<a name="form"></a>

## Form Submissions

By default the videomail-client interrupts the form submission with `e.preventDefault()` and submits the videomail itself to the videomail server first. The videomail server replies with useful data, such as the videomail alias, other meta data and only then the real form submission is resumed.

If this doesn't seem to work on your side, then this is mostly because the form and the submit button couldn't be found and the submission event is fired too late. To fix this, you'll need to correct the selectors under options. Here are the important ones regarding forms:

```ts
selectors: {
  "formId": null,
  "submitButtonId": null,
  "submitButtonSelector": null
},
```

When these are null (defaults), the videomail-client tries to detect these automatically. But it can happen that detection fails because the form is somewhere else under the DOM or the submit button does not have the `type=submit` etc.

### Include videomail meta data in Form Submissions

If you want to include videomail meta data in the form submission to your own server, enable the `submitWithVideomail` option.
Otherwise only the videomail alias is in the form body and will have to call `videomail.getByAlias(alias)` to retrieve these later on.

<a name="whitelist"></a>

## Whitelist

Examples will work right away on [https://localhost:8443](https://localhost:8443). This is because localhost is whitelisted on the remote Videomail server. `https://localhost` and `https://localhost:443` are whitelisted too for local development. Other IP addresses won't work. If this is a problem, contact me and I can whitelist more.

In other words, if your web server is connected through a domain besides localhost, the Videomail-Client is restricted from sending the media packets to the remote Videomail server which is responsible for storing and sending videomails. To fix that, just lodge a whitelist request at [https://videomail.io/whitelist](https://videomail.io/whitelist). Then you should get a new site name and a list of whitelisted URLs for your own usage pretty fast (within less than 48 hours).

<a name="compatibility"></a>

## Backward compatibility

Forget the old IE, Safari below version 11 and ancient iPhones/iPads because they don't support `getUserMedia()`. Do not blame me but Apple + Microsoft _chuckle_ - for now, these browsers work like a charm:

- Firefox >= 34
- Google Chrome >= 32
- Microsoft Edge >= 12
- Internet Explorer >= 12
- Opera >= 26
- Chrome for Android >= 39
- Android Browser >= 37
- Safari >= 11

Source: [http://caniuse.com/#search=getUserMedia](http://caniuse.com/#search=getUserMedia)

PS: On Safari and iPhones/iPads you can play the videomails fine without any issues. Repeating: there is just no recording functionality for them yet until Apple made a move.

<a name="addons"></a>

## Addons

There is a Videomail WordPress addon, wicked!
https://wordpress.org/plugins/videomail-for-ninja-forms/

It's an extension of the popular form builder called Ninja Forms. When the videomail addon is installed, then you can just drag and drop a live webcam input into the form! And tell what should happen upon submission. So easy.

<a name="notes"></a>

## Notes

### Changelog

Too hard to maintain. Just do `git log` or look here
https://github.com/binarykitchen/videomail-client/commits/master

### Noise

Here some noise about Videomail in the wild:

- [LimpingChicken](http://limpingchicken.com/2017/06/29/michael-heuberger-ive-created-a-web-form-to-send-emails-in-sign-language/)

### Unfinished Metamorphosis (aka Development)

This is just the beginning. I will add a lot more over time.

Bear with me, there are lots of problems to crack, especially with the performance, audio part and some unit tests are missing. I do not want to waste too much time on perfection unless it's proven to work then I rewrite piece by piece.

### Credits

These guys helped inspired me for this awesome project. Thank you so much:

- Heath Sadler (Designer)
- Stefan Weber (Designer)
- Zack Best (Jurist)
- Sonia Pivac (Designer)
- Dominic Tarr (Boat Builder)
- Daniel Ly (Developer)
- Nicholas Buchanan (No idea)
- Kelvin Wong (Gamer)
- Isaac Johnston (Consultant)

They all deserve lots of love in return. Thank you so much.

### Code quality

I admit, code isn't top notch and needs lots of rewrites. Believe me or not, I already rewrote about three times in the last four years. Good example that software hardly can be perfect. And since I am already honest here, I think stability and bug fixes come first before perfection otherwise you'll loose users. Reality you know.

### Final philosophy

This planet is completely sold. And talk is overrated. That's why my primary goal is not to turn this into a commercial product, yet to promote a cool but underestimated language: Sign Language.
