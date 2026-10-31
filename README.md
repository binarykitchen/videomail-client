# videomail-client ✉

[![Test Runner for videomail-client][ci-badge]][ci-workflow]

[![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![Netlify Status][netlify-image]][netlify-url]

[ci-badge]: https://github.com/binarykitchen/videomail-client/actions/workflows/ci.yml/badge.svg
[ci-workflow]: https://github.com/binarykitchen/videomail-client/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/videomail-client.svg?style=flat
[npm-url]: https://npmjs.org/package/videomail-client
[downloads-image]: https://img.shields.io/npm/dm/videomail-client.svg?style=flat
[downloads-url]: https://npmjs.org/package/videomail-client
[netlify-image]: https://api.netlify.com/api/v1/badges/3c9df5b4-8b85-4081-950a-d5df2dbd9926/deploy-status
[netlify-url]: https://app.netlify.com/sites/videomail-client/deploys

Bring Sign Language to your contact forms. ✉

Record webcam videos without browser plugins:

- Capture frames with `navigator.mediaDevices.getUserMedia()`.
- Stream them to Videomail over WebSocket.
- Get an encoded video back.

Made for Deaf users, and for hearing users learning Sign Language. The package includes ESM, CommonJS, UMD, and TypeScript declaration builds.

- [Live demo](#live-demo)
- [Storybook examples](#storybook-examples)
- [Installation](#installation)
- [Options](#options)
- [API](#api)
- [Form submissions](#form-submissions)
- [Privacy and error reporting](#privacy-and-error-reporting)
- [Stored videomail data](#stored-videomail-data)
- [Whitelist](#whitelist)
- [Browser compatibility](#browser-compatibility)
- [Add-ons](#add-ons)
- [Notes](#notes)

## Live Demo

Try it at [videomail-client.netlify.app](https://videomail-client.netlify.app).

### Real-world usage

Try the full experience at [videomail.io](https://videomail.io).

You can also find it on:

- [https://wfdeaf.org/contact](https://wfdeaf.org/contact)
- [https://www.deaf.org.nz/contact](https://www.deaf.org.nz/contact)
- And other sites using the package or its WordPress integration.

## Storybook examples

To try the examples locally:

1. `npm install`
2. `npm run storybook`

Storybook starts an HTTPS development server at `https://localhost:8443` using the certificates in `etc/ssl-certs`.

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

## Options

You can pass options to the `VideomailClient` constructor. See the annotated defaults in [src/options.ts](https://github.com/binarykitchen/videomail-client/blob/master/src/options.ts).

The defaults suit most integrations. Set `whitelistKey` when deploying on your own site; see [Whitelist](#whitelist).

The examples in [src/stories](https://github.com/binarykitchen/videomail-client/tree/master/src/stories) show common configurations.

## Audio

See [docs/AUDIO.md](docs/AUDIO.md) for details on audio recording options and requirements.

## API

- [`new VideomailClient()`](#new-videomailclientoptions)
- [`videomailClient.on()`](#videomailclienton)
- [`videomailClient.show()`](#videomailclientshow)
- [`videomailClient.hide()`](#videomailclienthide)
- [`videomailClient.record()`](#videomailclientrecord)
- [`videomailClient.pause()`](#videomailclientpause)
- [`videomailClient.recoverCamera()`](#videomailclientrecovercamera)
- [`videomailClient.replay()`](#videomailclientreplayvideomail-parentelementid)
- [`videomailClient.startOver()`](#videomailclientstartover)
- [`videomailClient.getByAlias()`](#videomailclientgetbyaliasalias)
- [`videomailClient.getByKey()`](#videomailclientgetbykeykey)
- [`videomailClient.getThreadByAlias()`](#videomailclientgetthreadbyaliasalias)
- [`videomailClient.getThreadByKey()`](#videomailclientgetthreadbykeykey)
- [`videomailClient.unload()`](#videomailclientunload)
- [`videomailClient.isDirty()`](#videomailclientisdirty)
- [`videomailClient.isRecording()`](#videomailclientisrecording)
- [`videomailClient.isBuilt()`](#videomailclientisbuilt)
- [`videomailClient.submit()`](#videomailclientsubmit)
- [`videomailClient.getLogLines()`](#videomailclientgetloglines)
- [`videomailClient.setLimitSeconds()`](#videomailclientsetlimitsecondslimitseconds)

### new VideomailClient([options])

The constructor accepts an optional [options](#options) object:

```ts
const videomailClient = new VideomailClient({
  whitelistKey: "my whitelist key",
});
```

### videomailClient.on()

Use `on()` to listen for events. It returns an unsubscribe function:

```ts
videomailClient.on("FORM_READY", () => {
  // The form is ready for recording.
});

videomailClient.on("SUBMITTED", ({ videomail, response }) => {
  // Handle the submitted video in your app.
});
```

#### Supported events

Check them out at [src/types/events/index.ts](https://github.com/binarykitchen/videomail-client/blob/master/src/types/events/index.ts)

Some events include typed parameters exported by the package.

The client shows errors by default. Listen for `ERROR` to add your own logging or recovery.

Videomail errors extend the native `Error` class with details for troubleshooting.

### videomailClient.show()

Adds the recording form to the page. By default, it uses the element with ID `videomail`. You can change this in the [options](#options).

### videomailClient.record()

Starts recording without requiring the user to press the record button.

### videomailClient.pause()

Pauses a recording or countdown without losing it. Leaves idle cameras and unsent previews alone.

For native apps, pair this with `videomailClient.recoverCamera()` when the app returns to the foreground.

### videomailClient.recoverCamera()

Returns a `Promise<boolean>`: `true` if camera recovery succeeds.

- Restarts playback for live tracks.
- Requests a new stream if camera or microphone tracks have ended.
- Shares pending recovery across duplicate calls.
- Returns `false` without changes if the client is unbuilt, has an unsent preview, is encoding, or is submitting.

Recovery keeps frame dimensions, frame/sample counts, and the audio sample rate. It does **not** resume recording or a countdown on its own. The user chooses Resume, which waits for recovery before sending more frames or restarting a paused countdown.

With automatic pause enabled, hiding the page pauses recording. Returning to it recovers the camera. Native apps should call `pause()` when backgrounded and `recoverCamera()` when foregrounded. Wire these into your app's lifecycle; no Capacitor dependency is needed. Use recovery, not `startOver()`, to keep a paused take.

Recovery events:

- `CAMERA_RECOVERING`: recovery has started.
- `USER_MEDIA_READY` with `recovering: true`: the replacement stream is ready.
- `CAMERA_RECOVERY_FAILED` with an `err`: access, playback, audio setup, or the recovery deadline failed.

The default failure notice keeps the take. Users can retry Resume or stop to keep what they recorded. Stop, reset, unload, and submission cancel pending recovery. Streams that arrive after cancellation are stopped.

Recovery cannot reconnect a lost recording WebSocket or keep a take after the app process ends. Test the camera and microphone on physical devices, too.

### videomailClient.replay(videomail[, parentElementId])

Adds a video player for the supplied videomail.

If `replayParentElementId` is supplied, the player is inserted into that element. Otherwise, the client uses or creates a replay container within the configured container.

If the parent already has a video element like this:

```html
<video class="replay"></video>
```

The client reuses it. No extra element needed.

### videomailClient.startOver()

Resets the client and returns it to the ready state so the same instance can record another videomail.

### videomailClient.getByAlias(alias)

Returns a videomail asynchronously for the given alias. Find the alias in:

1. The `videomail_alias` field sent to your server.
2. The `SUBMITTED` event data.

### videomailClient.getByKey(key)

Returns a videomail asynchronously for its unique key.

### videomailClient.getThreadByAlias(alias)

Returns the videomail thread containing the given alias.

### videomailClient.getThreadByKey(key)

Returns the videomail thread containing the given key.

### videomailClient.unload()

Stops the webcam, closes the active WebSocket connection, and removes all internal event listeners.

### videomailClient.hide()

Hides the UI without unloading it.

### videomailClient.isDirty()

Returns `true` when a recorded video has not been submitted. Use it to warn users before they leave an unsent recording.

### videomailClient.isRecording()

Returns `true` while a video is being recorded.

### videomailClient.isBuilt()

Returns `true` after the client UI has been built and before it is unloaded.

### videomailClient.submit()

Submits the form after client validation succeeds.

With `enableAutoValidation: false`, no client validation event is needed. Your app must validate the form first. This helps when your app provides its own submit button.

### videomailClient.getLogLines()

Returns recent log lines if your logger collects them.

### videomailClient.setLimitSeconds(limitSeconds)

Changes the time limit for further recording.

## Stored videomail data

The `SUBMITTED` event includes a `videomail` object. Its fields may evolve; check the exported `Videomail` type for the current shape.

For new recordings, `width` and `height` describe the captured canvas frames. They are not the viewport or resized preview dimensions. They stay available after the camera stops and are replaced when you record again.

Here's a shortened example:

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

## Form Submissions

See [Form Submissions ✏️](./docs/FORM_SUBMISSIONS.md) to set up submissions, include metadata, and test your integration.

## Privacy and error reporting

Read about our privacy and error reporting practices in [Privacy and error reporting](./docs/PRIVACY_ERROR_REPORTING.md).

## Whitelist

The examples work locally without extra setup. Videomail allows these development origins:

- [https://localhost:8443](https://localhost:8443)
- `https://localhost`
- `https://localhost:443`

Other origins need their own whitelist entry.

For a deployed domain, request access at [videomail.io/whitelist](https://videomail.io/whitelist). You will receive a whitelist key for the approved origins.

## Browser compatibility

Recording needs a secure context (`https://` or localhost), plus:

- `navigator.mediaDevices.getUserMedia()`
- WebSocket
- Canvas
- AudioWorklet, if audio is enabled

Current evergreen desktop and mobile browsers are supported. Internet Explorer is not.

See [Can I Use: Media Capture from DOM Elements](https://caniuse.com/stream) and test the [live demo](#live-demo) in the browsers required by your integration.

## Add-ons

There is also a Videomail WordPress add-on: <https://wordpress.org/plugins/videomail-for-ninja-forms/>

It extends the Ninja Forms form builder with a webcam input and submission integration.

## Notes

### Changelog

No separate changelog. Check `git log` or the [commit history](https://github.com/binarykitchen/videomail-client/commits/master).

### Noise

Videomail in the wild:

- [LimpingChicken](http://limpingchicken.com/2017/06/29/michael-heuberger-ive-created-a-web-form-to-send-emails-in-sign-language/)

### Unfinished Metamorphosis (aka Development)

This is just the beginning. I will add a lot more over time.

There's still work to do on performance, audio, and test coverage. We improve things piece by piece, rather than chase perfection in one big rewrite.

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

Stability and bug fixes come before big rewrites. The code keeps evolving with browser media APIs and the apps that use it.

### Final philosophy

Make Sign Language at home in email and web forms. That's what we're here for.
