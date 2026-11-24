# Project Overview

This public project, videomail-client, is a web-based npm package for use in web applications and the separate [videomail-for-ninja-forms WordPress plugin](https://github.com/binarykitchen/videomail-for-ninja-forms).

Its primary consumer is [Videomail](https://www.videomail.io), which relies on this package and lives in a private repository. Deaf users are the main audience.

The package's core focus is capturing webcam video with `navigator.mediaDevices.getUserMedia()`.

Consult the root README when its usage, API, or browser compatibility details are relevant to the task.

## Folder Structure

- `/.github`: Copilot instructions, agent skills and GitHub workflows
- `/.storybook`: General Storybook settings
- `/.vscode`: VS Code settings and extension recommendations
- `/dist`: Compiled output from [rslib](https://rslib.rs/), the project bundler
- `/docs`: Integration guides on audio, form submissions, privacy and error reporting
- `/etc`: Scripts for SSL certificates and package releases
- `/src`: Source code and unit tests, in `__tests__` subdirectories
- `/src/stories`: Storybook stories, which double as integration examples

## Libraries and Frameworks

- The project runs on Node.js; the version is specified in `.nvmrc`.
- The package is framework-neutral and uses standard browser APIs rather than React.
- Recording captures webcam frames and streams them to [Videomail](https://www.videomail.io) over WebSocket. Videomail compiles the frames into a video for email.
- Most source code is written in TypeScript. `noImplicitAny` is still off and ESLint allows `any`, so tooling won't flag new `any` types. Avoid them anyway.
- Dependency security checks use `audit-ci`.

## Browsers and mobile devices

Browser requirements are listed in the README's [Browser compatibility](../README.md#browser-compatibility) section. Internet Explorer is not supported.

The requested frame rate is an ideal; browser capabilities and connection conditions may limit the actual rate.

The CSS is responsive across mobile screen sizes.

Videos are stored on the Videomail server, not on the browser or mobile device. Recording therefore needs a network connection; offline recording is not supported.

## Bundler

The Rust-based rslib bundler compiles TypeScript to JavaScript and bundles the source for distribution. Its configuration is in the root `rslib.config.ts`.

## Video Recording Specs

Each website passes its own recording options, such as FPS, dimensions and time limit. The package defaults live in [src/options.ts](../src/options.ts) and differ from the settings below. videomail-client sends the video frames to the Videomail server, which encodes them.

The main Videomail website uses these settings:

- FPS: 18
- Resolution: 400x300
- Video format: MP4 and WebM
- Duration: 180 seconds (3 minutes)
- Audio: mono PCM captured with an `AudioWorklet`, off by default in the package. See [docs/AUDIO.md](../docs/AUDIO.md). The server uses ffmpeg to combine audio and video into MP4 and WebM files.
- Subtitles: the server can generate subtitles from audio using [nodejs-whisper](https://github.com/ChetanXpro/nodejs-whisper).

## Performance Metrics

- `npm run build:prod` prints a size table.
  - We do not document exact sizes as they may change with each build.
  - The CJS and UMD builds bundle all dependencies and are minified, so they end up similar in size.
  - The ESM build provides full source code and leaves dependencies to the host app's bundler.
- The [Ninja Forms plugin](https://github.com/binarykitchen/videomail-for-ninja-forms) serves `dist/umd/index.js` unchanged as `index-min.js`, so keep the UMD build minified.

## Tests

### Unit Tests

- Unit tests use [Vitest](https://vitest.dev) with jsdom. `describe`, `it` and `expect` are globals; see [vite.config.ts](../vite.config.ts).
- Vitest was chosen because it is fast, has a great API and is compatible with other testing frameworks like Jest.
- Put tests in a `__tests__` folder next to the source file and name them after it, for example `src/wrappers/__tests__/form.test.ts` for `src/wrappers/form.ts`.
- ESLint allows one `expect` per test (`vitest/max-expects`), so split checks into focused tests.

### Visual Tests

Visual testing uses [Storybook](https://storybook.js.org), configured in `.storybook`, to inspect components and their states.

We also use [Chromatic](https://www.chromatic.com) to catch visual changes between commits.

## Validation

Run `npm run quality` before handover. It runs the unit tests, Prettier, ESLint, the type check and the dependency audit. CI runs the same checks, plus the production build and Chromatic.

`npm run prettier` doesn't cover Markdown. VS Code formats it with Prettier on save; check edited Markdown with `node_modules/.bin/prettier --check <file>`.

## Accessibility

- Accessibility for Deaf users and support for mobile devices are important. Keep interfaces accessible and responsive.

## Error handling

Caught errors are sent to the Videomail server through [`reportError`](../src/resource.ts). The server reports them to developers by email. See [Privacy and error reporting](../docs/PRIVACY_ERROR_REPORTING.md) for what reports contain and how they are filtered.

## Versioning

We follow semver and pin exact npm package versions in `package.json` to keep releases stable and compatible with consumers. The root `.npmrc` sets `save-exact=true`, so `npm install` pins new packages automatically.

## Minor Gaps

- There is no formal API documentation format; the team is small and time is limited.
- There is no separate changelog; see `git log`.
- Development guidelines are intentionally lightweight.

## Goals

- videomail-client aims to bring Sign Language to email.
- The project is made with love for Sign Language. 🤟
