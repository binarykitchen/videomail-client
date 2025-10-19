# Project Overview

This public project, called videomail-client, is a web-based npm package for reuse in any other web applications and also in a separate WordPress plugin, see (videomail-for-ninja-forms)[https://github.com/binarykitchen/videomail-for-ninja-forms].

The most important consumer of this package is (Videomail)[https://www.videomail.io] itself which heavily relies on this package and resides in another, but private repository. Videomail's goal is to enable Sign Language in emails. Deaf users are our main audience.

Another important consumers are those who use the WordPress plugin of this package, videomail-client, which is called (videomail-for-ninja-forms)[https://github.com/binarykitchen/videomail-for-ninja-forms].

It's core focus is to take snapshots from the webcam using the getUserMedia API.
The root `/README.md` file has further general information for you, the GitHub Copilot. Please also parse this README and add it to the context of this file.

## Folder Structure

- `/.github`: Has instructions for the GitHub Copilot and some workflows for github.com itself
- `/.storybook`: Comes with general Storybook settings
- `/.vscode`: General configurations for VS Code users regarding extensions and settings
- `/dist`: Anything compiled by rslib goes in here. (rslib)[https://rslib.rs/] is our bundler.
- `/etc`: It contains script for SSL certificates and for releasing new npm package versions
- `/src`: Contains the source code with all their unit tests, under `__tests__` in the same subdirectory

## Libraries and Frameworks

- All runs on Node.js, the used version is defined in the `.nvmrc` file. Presently it's v22
- We do not use React nor any frameworks. All is raw, in Vanilla JavaScript.
- For video recording, we grab images with the deprecated getUserMedia API, send them through WebSocket streams, using the (websocket-stream package)[https://www.npmjs.com/package/websocket-stream] and once the user presses the stop button, the server side which is (Videomail)[https://www.videomail.io] itself, compiles these image frames into a video and sends them out within an email. That's the big idea.
- We are aware that the getUserMedia API is deprecated, but we have no time to migrate this to the new MediaDevices API. All still works well, so we can ignore this for now.
- Most source code is written in TypeScript.
- Security checks using the audit-ci package are included and configured. Security is important.
- Video recording is WebSocket based using streams.
- We don't use React, as this library should remain neutral, using standard JavaScript only.

## Browsers and mobile devices

The bare minimum is to support those browsers who support the getUserMedia API. Not the older ones. To check if a browser supports this API, you can use the (caniuse.com)[https://caniuse.com/?search=getUserMedia] website.

Regarding network issues, we already have mechanisms in place to lower the FPS before encoding these videos on the Videomail server side.

For mobile devices, there are no minimum screen size requirements, as all the CSS is written to be responsive for any sizes.

For video storage, there are no concerns on browser of mobile side, as all is being stored on videomail.io, the Videomail server side.

Of course, when it goes offline, then video recording will be aborted. We don't support an offline mode.

## Bundler

It's rslib, which is a Rust-based bundler. It compiles TypeScript to JavaScript and bundles the source code into a single file for distribution.
Its configuration file can be found in the root folder at rslib.config.ts.

## Video Recording Specs

These are configured on the Videomail server side and vary from website to website. The videomail-client package is just a client which sends the video frames to the Videomail server.

But here are the default specs for the main Videomail website itself:
- FPS: 18
- Resolution: 400x300
- Video format: MP4 and WebM
- Duration: 180 seconds (3 minutes)
- Audio: we sample PCM from the AudioContext API, which is the default audio format for the Videomail server. On the Videomail server side we use ffmpeg to merge the audio, the images, both into two video files, one in MP4 and one in WebM format.
- Subtitles: another reason to include audio is to allow the Videomail server to generate subtitles for the video. This is done using the (nodejs-whisper package)[https://github.com/ChetanXpro/nodejs-whisper], which is configured on the Videomail server side.

## Performance Metrics

- Thanks to the rslib bundler, the videomail-client package is very small, around 50kB gzipped.
- The package is optimized for performance, using the latest JavaScript features and TypeScript.
- The package is designed to be fast and responsive, with minimal latency when recording videos.
- There are WebSocket reconnection strategies in place to ensure that video recording continues even if the connection is temporarily lost.

## Tests

### Unit Tests

- For unit tests we use the next generation (Vitest)[https://vitest.dev] framework.
- Vitest was chosen because it is fast, has a great API and is compatible with other testing frameworks like Jest.
- The unit tests are located in the `__tests__` subdirectory of each source code

### Visual Tests

For visual tests, we use (Storybook)[https://storybook.js.org]. It is configured in the `.storybook` folder. The Storybook is used to visually test components and their states.

In addition, we also use (Chromatic)[https://www.chromatic.com] to catch any visual differences between git commits.

## Accessibility

- Because this invention is made for Deaf people, we should care about top-notch accessibility for Deaf people.
- Then, mobile devices must be supported. Therefore, ensure all HTML and styles are responsive for iPhones and Android.

## Coding Standards

- It's all defined already, using Prettier, eslint and TypeScript. Their configurations can be found in the root folder. Parse these.

## Error Handling

- Any errors caught are being sent over the API to the remote Videomail server.
- The function which does it is called reportError in src/resource.ts
- The remote Videomail server receives these and reports them to the developers via email.

## Versioning

We honour the semver versioning strategy and pinpoint exact versions of any npm package in the `package.json` file. This is important to ensure that the videomail-client package remains stable and compatible with other packages.

## Minor Gaps

- There is no API documentation format specified by intention as time is lacking and we are a small team.
- As already mentioned in the README, under notes, there is no changelog format defined. We just stick to the old fashioned git log for now.
- For the development process, we have no strict guidelines to keep it simple for now.

## Goals

- Remember, the videomail-client is made for the love of Sign Language.
- We want to include Sign Language in emails, that's what videomail-client is about.
- There aren't many npm packages out there supporting video recording. Correct me if this is wrong.
