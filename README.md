# videomail-client ✉

[![Test Runner for videomail-client](https://github.com/binarykitchen/videomail-client/actions/workflows/ci.yml/badge.svg)](https://github.com/binarykitchen/videomail-client/actions/workflows/ci.yml)

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![Netlify Status](https://api.netlify.com/api/v1/badges/3c9df5b4-8b85-4081-950a-d5df2dbd9926/deploy-status)](https://app.netlify.com/sites/videomail-client/deploys)

[npm-image]: https://img.shields.io/npm/v/videomail-client.svg?style=flat
[npm-url]: https://npmjs.org/package/videomail-client
[downloads-image]: https://img.shields.io/npm/dm/videomail-client.svg?style=flat
[downloads-url]: https://npmjs.org/package/videomail-client

Record webcam videos in contact forms.

The client captures image frames with `navigator.mediaDevices.getUserMedia()`, streams them to the Videomail service over WebSocket, and receives an encoded video. No browser plugins are required. The package includes ESM, CommonJS, UMD, and TypeScript declaration builds.

- [Live demo](#demo)
- [Storybook examples](#storybook)
- [Installation](#installation)
- [Options](#options)
- [API](#api)
- [Form submissions](#form)
- [Privacy and error reporting](#privacy)
- [Stored videomail data](#whatisstored)
- [Whitelist](#whitelist)
- [Browser compatibility](#compatibility)
- [Add-ons](#addons)
- [Notes](#notes)

<a name="demo"></a>

## Live Demo

Try it at [videomail-client.netlify.app](https://videomail-client.netlify.app).

### Real-world usage

There is a full version with all its features on [videomail.io](https://videomail.io).

And there is more:

- [https://wfdeaf.org/contact](https://wfdeaf.org/contact)
- [https://www.deaf.org.nz/contact](https://www.deaf.org.nz/contact)
- And other sites using the package or its WordPress integration.

<a name="storybook"></a>

## Storybook examples

To check out some examples in your browser locally, just run these two commands:

1. `npm install`
2. `npm run storybook`

Storybook starts an HTTPS development server at `https://localhost:8443` using the certificates in `etc/ssl-certs`.

<a name="installation"></a>

## Installation

```sh
npm install videomail-client
```

```ts
import { VideomailClient } from "videomail-client";

const videomailClient = new VideomailClient({
  whitelistKey: "your-whitelist-key",
});
```

<a name="options"></a>

## Options

You can pass options to the `VideomailClient` constructor. See the annotated defaults in [src/options.ts](https://github.com/binarykitchen/videomail-client/blob/master/src/options.ts).

The defaults suit most integrations. Set `whitelistKey` when deploying on your own site; see [Whitelist](#whitelist).

The examples in [src/stories](https://github.com/binarykitchen/videomail-client/tree/master/src/stories) show common configurations.

### Audio recording

Audio is disabled by default. When enabled, the client samples mono PCM using
`AudioWorklet`. The `audio.bufferSize` option accepts `"auto"` or a power of two
between 256 and 16384; `audio.volume` must be between 0 and 1.

Deploy the complete `dist` output, including `pcm-processor.worklet.js`. The
ESM, CommonJS, and UMD builds emit the processor under `static/assets`. The hosting origin and Content Security Policy must
permit the browser to load that module. Browsers without `AudioWorklet` cannot
record audio; video-only recording remains available.

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
- <a href="#getThreadByAlias">`videomailClient.getThreadByAlias()`</a>
- <a href="#getThreadByKey">`videomailClient.getThreadByKey()`</a>
- <a href="#unload">`videomailClient.unload()`</a>
- <a href="#isDirty">`videomailClient.isDirty()`</a>
- <a href="#isRecording">`videomailClient.isRecording()`</a>
- <a href="#isBuilt">`videomailClient.isBuilt()`</a>
- <a href="#submit">`videomailClient.submit()`</a>
- <a href="#getLogLines">`videomailClient.getLogLines()`</a>
- <a href="#setLimitSeconds">`videomailClient.setLimitSeconds()`</a>

<a name="constructor"></a>

### new VideomailClient([options])

The constructor accepts an optional [options](#options) object:

```ts
const videomailClient = new VideomailClient({ whitelistKey: "my whitelist key" });
```

<a name="on"></a>

### videomailClient.on([event,] [callback])

`VideomailClient` provides an event-emitter-style API. `on()` returns an unsubscribe function:

```ts
videomailClient.on("FORM_READY", () => {
  // The form is ready for recording.
});

videomailClient.on("SUBMITTED", ({ videomail, response }) => {
  // Continue with application-specific submission handling.
});
```

#### Supported events

Check them out at [src/types/events/index.ts](https://github.com/binarykitchen/videomail-client/blob/master/src/types/events/index.ts)

Some events include typed parameters exported by the package.

The client includes default visual error handling. Applications can also subscribe to the `ERROR` event for custom logging or recovery.

Videomail errors extend the native `Error` class and include additional diagnostic data.

<a name="show"></a>

### videomailClient.show()

Automatically fills the DOM with a form for video recording. By default the HTML element with the ID `videomail` will be filled, see options.

<a name="record"></a>

### videomailClient.record()

Starts recording without requiring the user to press the record button.

<a name="replay"></a>

### videomailClient.replay(videomail[, parentElementId])

Adds a video player for the supplied videomail.

If `replayParentElementId` is supplied, the player is inserted into that element. Otherwise, the client uses or creates a replay container within the configured container.

Also note that, when the parent element already contains a video container like this

```html
<video class="replay"></video>
```

the client reuses it instead of creating another DOM element.

<a name="startOver"></a>

### videomailClient.startOver()

Resets the client and returns it to the ready state so the same instance can record another videomail.

<a name="getByAlias"></a>

### videomailClient.getByAlias(alias)

Returns a videomail asynchronously for the given alias. You can obtain the alias from:

1. The form submission to your own server has it under `videomail_alias` in the form body.
2. The `SUBMITTED` event payload.

<a name="getByKey"></a>

### videomailClient.getByKey(key)

Returns a videomail asynchronously for its unique key.

<a name="getThreadByAlias"></a>

### videomailClient.getThreadByAlias(alias)

Returns the videomail thread containing the given alias.

<a name="getThreadByKey"></a>

### videomailClient.getThreadByKey(key)

Returns the videomail thread containing the given key.

<a name="unload"></a>

### videomailClient.unload()

Manually unloads the webcam and all other internal event listeners.

<a name="hide"></a>

### videomailClient.hide()

Hides all the visuals (but does not unload anything).

<a name="isDirty"></a>

### videomailClient.isDirty()

Returns `true` when a video has been recorded but not submitted. This can be used before navigation to warn about an unsent recording.

<a name="isRecording"></a>

### videomailClient.isRecording()

Returns `true` while a video is being recorded.

<a name="isBuilt"></a>

### videomailClient.isBuilt()

Returns `true` after the client UI has been built and before it is unloaded.

<a name="submit"></a>

### videomailClient.submit()

Manually triggers submission when the client and form are valid. This is useful when another UI layer owns the visible submit control.

<a name="getLogLines"></a>

### videomailClient.getLogLines()

Returns the recently collected log lines when the configured logger supports collection.

<a name="setLimitSeconds"></a>

### videomailClient.setLimitSeconds(limitSeconds)

Updates the recording time limit for subsequent recording activity.

<a name="whatisstored"></a>

## Stored videomail data

The `SUBMITTED` event includes a `videomail` object. The exact response can evolve, but its shape follows the exported `Videomail` type. A shortened example is shown below:

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
  "whitelistKey": "videomail-client-demo",
  "alias": "some-subject-183622500964",
  "dateCreated": 1541130589811,
  "url": "https://videomail.io/videomail/some-subject-150322500964",
  "key": "11e8-de52-55ac2630-b22b-71959562a989",
  "expiresAfter": 1541134189811,
  "expiresAfterIso": "2018-11-02T04:49:49.811Z",
  "expiresAfterServerPretty": "Nov 2, 2018, 5:49 PM",
  "siteName": "Videomail Client Example",
  "webm": "https://videomail.io/videomail/some-subject-183622500964/type/webm/",
  "poster": "https://videomail.io/videomail/some-subject-183622500964/poster/",
  "dateCreatedServerPretty": "Nov 2, 2018, 4:49 PM",
  "replyUrl": "https://videomail.io/reply/some-subject-183622500964",
  "sending": false,
  "versions": {
    "videomailClient": "15.7.14"
  }
}
```

You can also retrieve this data with `videomailClient.getByKey()`.

<a name="form"></a>

## Form Submissions

By default, the client prevents the initial form submission and submits the videomail to the Videomail server first. After the server returns the alias and metadata, the client submits the original form.

If this does not work, verify that the configured selectors identify the form and its submit button:

```ts
selectors: {
  formId: undefined,
  submitButtonId: undefined,
  submitButtonSelector: undefined,
}
```

When these values are `undefined` (the defaults), the client detects the nearest form and a button with `type="submit"` automatically.

### Include videomail meta data in Form Submissions

Enable `submitWithVideomail` to include videomail metadata in the submission to your server. Otherwise the form body contains the videomail alias, which can later be resolved with `videomailClient.getByAlias(alias)`.

<a name="privacy"></a>

## Privacy and error reporting

Recording sends webcam frames, and audio samples when enabled, to the configured Videomail service for encoding. The package does not provide offline recording.

The `reportErrors` option defaults to `true`. When an error occurs, the client can send the error, recent client logs, browser and operating-system details, page location, screen and orientation data, supported media constraints, and enumerated media-device information to the configured API. Set `reportErrors: false` if your privacy policy requires local-only error handling.

<a name="whitelist"></a>

## Whitelist

Examples work at [https://localhost:8443](https://localhost:8443) because localhost is allowed by the remote Videomail server. `https://localhost` and `https://localhost:443` are also available for local development. Other origins require their own whitelist entry.

For a deployed domain, request access at [videomail.io/whitelist](https://videomail.io/whitelist). You will receive a whitelist key for the approved origins.

<a name="compatibility"></a>

## Browser compatibility

Recording requires a secure context (`https://` or localhost) and support for `navigator.mediaDevices.getUserMedia()`, WebSocket, Canvas, and `AudioWorklet` when audio is enabled. Current evergreen desktop and mobile browsers are supported. Internet Explorer is not supported.

See [Can I Use: Media Capture from DOM Elements](https://caniuse.com/stream) and test the [live demo](#demo) in the browsers required by your integration.

<a name="addons"></a>

## Add-ons

There is also a Videomail WordPress add-on:
<https://wordpress.org/plugins/videomail-for-ninja-forms/>

It extends the Ninja Forms form builder with a webcam input and submission integration.

<a name="notes"></a>

## Notes

### Changelog

A separate changelog is not maintained. Use `git log` or the [commit history](https://github.com/binarykitchen/videomail-client/commits/master).

### Noise

Videomail in the wild:

- [LimpingChicken](http://limpingchicken.com/2017/06/29/michael-heuberger-ive-created-a-web-form-to-send-emails-in-sign-language/)

### Unfinished Metamorphosis (aka Development)

This is just the beginning. I will add a lot more over time.

Bear with me, there are lots of problems to crack, especially with the performance, audio part and some unit tests are missing. I do not want to waste too much time on perfection unless it's proven to work then I rewrite piece by piece.

### Credits

These people helped inspire the project:

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

The project prioritizes stability and bug fixes over large rewrites. Its implementation has evolved several times as browser media APIs and integration requirements have changed.

### Final philosophy

The primary goal is to make Sign Language easier to use in email and web forms.
