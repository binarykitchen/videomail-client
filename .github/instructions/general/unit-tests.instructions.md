---
applyTo: "**/*.test.{js,jsx,ts,tsx}"
description: "Use when: creating, editing, moving, or locating unit tests or Node.js diagnostic checks"
---

# Unit Tests

## Philosophy

- Be paranoid. Paranoia is reality seen on a finer scale ;) (Quote from Strange Days, 1995)
- Test observable behavior and important edge cases rather than implementation details.
- Keep each test focused on one behavior; do not add tests solely for trivial accessors or constants.
- Isolate tests from shared state, including environment variables, timers, and logs; restore any state changed by a test.

## Library

- Vitest is the preferred library for unit tests in this project.

## Structure

- Place unit tests in the nearest `__tests__` directory.
- Name tests after the source file with a `.test.ts` or `.test.tsx` suffix as appropriate.

## Skills

- Follow the repository's unit-test generation skill at `.github/skills/generate-unit-tests-for-selected-file/SKILL.md`.

## Mocking

- Keep tests from polluting logs. Mock the logger when a test needs to verify logging or avoid expected output.
- Avoid blanket logger mocks; each test should set up only the logging behavior it needs.
- When a test intentionally triggers errors or warnings, mock the relevant logger method locally and assert its expected calls. Do not silence console output for the whole suite; unexpected logs should remain visible.
- Reset mocks and any altered state after each test to prevent cross-test contamination.
