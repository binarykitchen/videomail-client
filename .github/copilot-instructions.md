# Project Overview

This public project is a web-based npm package for reuse in any other web applications.

The most important consumer of this package is (Videomail)[https://www.videomail.io] itself which heavily relies on this package and resides in another, but private repository. Videomail's goal is to enable Sign Language in emails. Deaf users are our main audience.

Another important consumers are those who use the WordPress plugin of this package, videomail-client, which is called (videomail-for-ninja-forms)[https://github.com/binarykitchen/videomail-for-ninja-forms].

It's core focus is to take snapshots from the webcam using the getUserMedia API.
The root `/README.md` file has further general information for you, the GitHub Copilot.

## Folder Structure

- `/.github`: Has instructions for the GitHub Copilot and some workflows for github.com itself
- `/.storybook`: Comes with general Storybook settings
- `/.vscode`: General configurations for VS Code users regarding extensions and settings
- `/dist`: Anything compiled by rslib goes in here. (rslib)[https://rslib.rs/] is our bundler.
- `/etc`: It contains script for SSL certificates and for releasing new npm package versions
- `/src`: Contains the source code with all their unit tests, under `__tests__` in the same subdirectory

## Libraries and Frameworks

- All runs on Node.js, the used version is defined in the `.nvmrc` file. Presently it's v22
- All source code is plain JavaScript, written in TypeScript.
- We do not use React nor any frameworks. All is raw, in Vanilla JavaScript.
- For video recording, we grab images with the deprecated getUserMedia API, send them through WebSocket streams, using the [websocket-stream package](https://www.npmjs.com/package/websocket-stream) and once the user presses the stop button, the server side which is [Videomail](https://www.videomail.io) itself, compiles these image frames into a video and sends them out within an email. That's the big idea.
- There are no plans yet to migrate the deprecated getUserMedia API to the new MediaDevices.getUserMedia API, but it is planned for the future.
- Most source code is written in TypeScript.
- Security checks using the audit-ci package are included and configured. Security is important.
- Video recording is WebSocket based using streams.
- We don't use React, as this library should remain neutral, using standard JavaScript only.
- For unit tests we use the next generation [Vitest](https://vitest.dev/) framework.

## Browsers and mobile devices

We should try to support as many browsers and mobile devices as possible.

# Bundler

It's rslib, which is a Rust-based bundler. It compiles TypeScript to JavaScript and bundles the source code into a single file for distribution.

Its configuration file can be found in the root folder at rslib.config.ts.

## Accessibility

- Because this invention is made for Deaf people, we should care about top-notch accessibility for Deaf people.
- Then, mobile devices must be supported. Therefore, ensure all HTML and styles are responsive for iPhones and Android.

## Coding Standards

- It's all defined already, using Prettier, eslint and TypeScript. Their configurations can be found in the root folder. Parse these.

## Goals

- Remember, the videomail-client is made for the love of Sign Language.
- We want to include Sign Language in emails, that's what videomail-client is about.
- There aren't many npm packages out there supporting video recording. Correct me if this is wrong.
