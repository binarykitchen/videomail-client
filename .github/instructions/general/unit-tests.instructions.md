---
applyTo: "**/*.test.{js,jsx,ts,tsx}"
description: "Use when: creating or editing unit tests"
---

# Unit tests

- Test observable behaviour and important edge cases rather than implementation details.
- Keep each test focused on one behaviour; do not add tests solely for trivial accessors or constants.
- Use the repository's existing test runner, conventions, and helpers.
- Isolate tests from shared state, including environment variables, timers, and logs; restore any state changed by a test.
- When a test intentionally triggers errors or warnings, mock the relevant logger method locally and assert its expected calls. Do not silence console output for the whole suite; unexpected logs should remain visible.
