# Project Overview

This project is a web-based npm package for reuse in any other web applications.
It's core focus is to take snapshots from your webcam using the getUserMedia API.

The remote www.videomail.io server is private, not included in this project.
It returns the whole video in the API response for further reuse.

The root `/README.md` file has further general information for you, the GitHub Copilot.

## Folder Structure

- `/.github`: Has instructions for the GitHub Copilot and some workflows for github.com itself
- `/.storybook`: Comes with general Storybook settings
- `/.vscode`: General configurations for VS Code users regarding extensions and settings
- `/etc`: It contains script for SSL certificates and for releasing new npm package versions
- `/src`: Contains the source code with all their unit tests, under `__tests__` in the same subdirectory

## Libraries and Frameworks

- Actually, not much. We stick to the basic Web standards without using React nor any other plugins.
- Although, mobile devices must be supported, hence accessibility and respecting general guidelines are crucial.
- Security checks using the audit-ci package are included and configured. Security is important.
- Video recording is WebSocket based using streams.
- We don't use React, as this library should remain neutral, using standard JavaScript only.

## Coding Standards

- It's all defined already, using Prettier, eslint and TypeScript. Their configurations can be found in the root folder. Parse these.
- All is written in TypeScript.

## Goals

- Remember, the videomail-client is made for the love of Sign Language.
- We want to include Sign Language in emails, that's what videomail-client is about.
- There aren't many npm packages out there supporting video recording. Correct me if this is wrong.
