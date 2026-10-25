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

Record webcam videos in contact forms.

The client captures image frames with `navigator.mediaDevices.getUserMedia()`, streams them to the Videomail service over WebSocket, and receives an encoded video. No browser plugins are required. The package includes ESM, CommonJS, UMD, and TypeScript declaration builds.

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

There is a full version with all its features on [videomail.io](https://videomail.io).

And there is more:

- [https://wfdeaf.org/contact](https://wfdeaf.org/contact)
- [https://www.deaf.org.nz/contact](https://www.deaf.org.nz/contact)
- And other sites using the package or its WordPress integration.

## Storybook examples

To check out some examples in your browser locally, just run these two commands:

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

### Audio

Audio recording is experimental and disabled by default. Set `audio.enabled` to `true` to enable it.

`audio.volume` controls recording gain from `0` (silence) to `1` (unchanged microphone level, the default). It does not control playback volume or enable audible microphone monitoring.

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

### videomailClient.show()

Automatically fills the DOM with a form for video recording. By default the HTML element with the ID `videomail` will be filled, see options.

### videomailClient.record()

Starts recording without requiring the user to press the record button.

### videomailClient.pause()

Pauses an active recording or countdown without discarding it. Idle cameras and unsent previews are left alone. Useful for native applications. To resume, refer to the next function `videomailClient.recoverCamera()`.

### videomailClient.recoverCamera()

Returns a `Promise<boolean>` indicating whether camera recovery succeeds. It restores playback for live tracks or requests a replacement stream when camera or microphone tracks have ended. Duplicate calls share the pending recovery. An unbuilt client, unsent preview, encoding, or submission is left alone and returns `false`.

Recovery preserves captured frame dimensions, frame/sample counters, and the audio sample rate. Foreground recovery never resumes capture or a countdown automatically. The user must explicitly choose Resume; that action waits for recovery before sending more frames.

With automatic pause enabled, browser visibility changes pause capture and recover the camera on return. Native hosts should call `pause()` on background and `recoverCamera()` on foreground through their own lifecycle integration. The client has no Capacitor dependency. Do not call `startOver()` to recover a paused take.

`CAMERA_RECOVERING` signals the start of recovery. `USER_MEDIA_READY` includes `recovering: true` after a replacement stream is initialized. `CAMERA_RECOVERY_FAILED` provides an `err` when access, playback, audio initialization, or the recovery deadline fails. The default notification does not reset the take; the user can retry Resume or stop to keep the recorded part. Stop, reset, unload, and submission cancel pending recovery, and late streams are stopped.

This does not reconnect a lost recording WebSocket or survive process termination. Physical-device camera and microphone validation remains necessary.

### videomailClient.replay(videomail[, parentElementId])

Adds a video player for the supplied videomail.

If `replayParentElementId` is supplied, the player is inserted into that element. Otherwise, the client uses or creates a replay container within the configured container.

Also note that, when the parent element already contains a video container like this

```html
<video class="replay"></video>
```

the client reuses it instead of creating another DOM element.

### videomailClient.startOver()

Resets the client and returns it to the ready state so the same instance can record another videomail.

### videomailClient.getByAlias(alias)

Returns a videomail asynchronously for the given alias. You can obtain the alias from:

1. The form submission to your own server has it under `videomail_alias` in the form body.
2. The `SUBMITTED` event payload.

### videomailClient.getByKey(key)

Returns a videomail asynchronously for its unique key.

### videomailClient.getThreadByAlias(alias)

Returns the videomail thread containing the given alias.

### videomailClient.getThreadByKey(key)

Returns the videomail thread containing the given key.

### videomailClient.unload()

Manually unloads the webcam, closes the active WebSocket connection, and removes all internal event listeners.

### videomailClient.hide()

Hides all the visuals (but does not unload anything).

### videomailClient.isDirty()

Returns `true` when a video has been recorded but not submitted. This can be used before navigation to warn about an unsent recording.

### videomailClient.isRecording()

Returns `true` while a video is being recorded.

### videomailClient.isBuilt()

Returns `true` after the client UI has been built and before it is unloaded.

### videomailClient.submit()

Manually triggers submission when the client and form are valid. This is useful when another UI layer owns the visible submit control.

### videomailClient.getLogLines()

Returns the recently collected log lines when the configured logger supports collection.

### videomailClient.setLimitSeconds(limitSeconds)

Updates the recording time limit for subsequent recording activity.

## Stored videomail data

The `SUBMITTED` event includes a `videomail` object. The exact response can evolve, but its shape follows the exported `Videomail` type. A shortened example is shown below:

For new recordings, submitted `width` and `height` describe the captured canvas frames, not the browser viewport or the resized preview. These dimensions survive stopping the camera and are replaced when recording again.

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

How to configure, inject meta data and test form submissions with the Videomail client can be found in [Form Submissions ✏️](./docs/FORM_SUBMISSIONS.md).

## Privacy and error reporting

Read about our privacy and error reporting practices in [Privacy and error reporting](./docs/PRIVACY_ERROR_REPORTING.md).

## Whitelist

Examples work at [https://localhost:8443](https://localhost:8443) because localhost is allowed by the remote Videomail server. `https://localhost` and `https://localhost:443` are also available for local development. Other origins require their own whitelist entry.

For a deployed domain, request access at [videomail.io/whitelist](https://videomail.io/whitelist). You will receive a whitelist key for the approved origins.

## Browser compatibility

Recording requires a secure context (`https://` or localhost) and support for `navigator.mediaDevices.getUserMedia()`, WebSocket, Canvas, and Web Audio when audio is enabled. Current evergreen desktop and mobile browsers are supported. Internet Explorer is not supported.

See [Can I Use: Media Capture from DOM Elements](https://caniuse.com/stream) and test the [live demo](#live-demo) in the browsers required by your integration.

## Add-ons

There is also a Videomail WordPress add-on: <https://wordpress.org/plugins/videomail-for-ninja-forms/>

It extends the Ninja Forms form builder with a webcam input and submission integration.

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
