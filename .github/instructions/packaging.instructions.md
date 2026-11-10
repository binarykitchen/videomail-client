---
description: "Use when: managing npm dependencies, package manifests, or peer dependency conflicts"
applyTo: "**/package.json"
---

# Package management

- Never use `npm install --legacy-peer-deps`, `npm uninstall --legacy-peer-deps`, or any other npm command with `--legacy-peer-deps`.
- About `npx`:
  - It is a convenience tool for running binaries from npm packages without installing them globally. However, it can lead to inconsistent behavior and versioning issues.
  - For a starter, always declare project dependencies in `package.json`, install them with `npm ci` or `npm install`, and invoke local binaries from `node_modules/.bin`.
  - For convenience it is okay to use `npx` for one-off commands, but avoid it for project scripts and automation.
- Resolve peer dependency conflicts properly by upgrading, downgrading, replacing, or removing the conflicting packages.
- If a dependency tree cannot be resolved cleanly, stop and report the conflicting packages and versions to the user instead of applying any workaround flag.
