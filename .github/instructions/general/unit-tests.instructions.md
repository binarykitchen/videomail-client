---
description: "Use when: creating or editing unit tests"
---

# Unit tests

- Test observable behavior and important edge cases rather than implementation details.
- Keep each test focused on one behavior; do not add tests solely for trivial accessors or constants.
- Use the repository's existing test runner, conventions, and helpers.
- Isolate tests from shared state, including environment variables, timers, and logs; restore any state changed by a test.
