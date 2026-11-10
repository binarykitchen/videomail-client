# Project Overview

This public project, videomail-client, is a web-based npm package for use in web applications and the separate [videomail-for-ninja-forms WordPress plugin](https://github.com/binarykitchen/videomail-for-ninja-forms).

Its primary consumer is [Videomail](https://www.videomail.io), which relies on this package and lives in a private repository. Videomail aims to bring sign language to email. Deaf users are the main audience.

The package's core focus is capturing webcam video with `navigator.mediaDevices.getUserMedia()`.

Consult the root README when its usage, API, or browser compatibility details are relevant to the task.

## Folder Structure

- `/.github`: Copilot instructions and GitHub workflows
- `/.storybook`: General Storybook settings
- `/.vscode`: VS Code settings and extension recommendations
- `/dist`: Compiled output from [rslib](https://rslib.rs/), the project bundler
- `/etc`: Scripts for SSL certificates and package releases
- `/src`: Source code and unit tests, in `__tests__` subdirectories

## Libraries and Frameworks

- The project runs on Node.js; the version is specified in `.nvmrc`.
- The package is framework-neutral and uses standard browser APIs rather than React.
- Recording captures webcam frames and streams them to [Videomail](https://www.videomail.io) over WebSocket. Videomail compiles the frames into a video for email.
- Most source code is written in TypeScript.
- Dependency security checks use `audit-ci`.

## Browsers and mobile devices

The minimum browser support is browsers that provide `navigator.mediaDevices.getUserMedia()`. Internet Explorer is not supported. See [Can I Use](https://caniuse.com/stream) for compatibility details.

The requested frame rate is an ideal; browser capabilities and connection conditions may limit the actual rate.

The CSS is responsive across mobile screen sizes.

Videos are stored on the Videomail server, not on the browser or mobile device.

Recording requires a network connection; offline recording is not supported.

## Bundler

The Rust-based rslib bundler compiles TypeScript to JavaScript and bundles the source for distribution. Its configuration is in the root `rslib.config.ts`.

## Video Recording Specs

Recording specifications are configured on the Videomail server and vary by website. videomail-client sends video frames to the server.

The main Videomail website uses these defaults:

- FPS: 18
- Resolution: 400x300
- Video format: MP4 and WebM
- Duration: 180 seconds (3 minutes)
- Audio: PCM sampled with the AudioContext API. The server uses ffmpeg to combine audio and video into MP4 and WebM files.
- Subtitles: the server can generate subtitles from audio using [nodejs-whisper](https://github.com/ChetanXpro/nodejs-whisper).

## Performance Metrics

- The rslib bundle is around 50 kB gzipped.
- The package uses modern JavaScript and TypeScript and aims for low-latency recording.
- WebSocket reconnection strategies help recording recover from temporary connection loss.

## Tests

### Unit Tests

- Unit tests use [Vitest](https://vitest.dev).
- Vitest was chosen because it is fast, has a great API and is compatible with other testing frameworks like Jest.
- Unit tests are in `__tests__` subdirectories within `src`.

### Visual Tests

Visual testing uses [Storybook](https://storybook.js.org), configured in `.storybook`, to inspect components and their states.

We also use [Chromatic](https://www.chromatic.com) to catch visual changes between commits.

## Accessibility

- Accessibility for Deaf users and support for mobile devices are important. Keep interfaces accessible and responsive.

## Error handling

Caught errors are sent to the Videomail server through [`reportError`](../src/resource.ts). The server reports them to developers by email.

## Versioning

We follow semver and pin exact npm package versions in `package.json` to keep releases stable and compatible with consumers.

## Minor Gaps

- There is no formal API documentation format; the team is small and time is limited.
- There is no separate changelog. See the README's Notes section or `git log`.
- Development guidelines are intentionally lightweight.

## Goals

- videomail-client aims to bring sign language to emails.
- The project is made with love for sign language. 🤟
