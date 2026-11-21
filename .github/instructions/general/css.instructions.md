---
description: "Use when: changing CSS styles or similar languages like Stylus, Less and more"
applyTo: "**/*.css, **/*.styl, **/*.less"
---

# CSS

## Keep the cascade predictable

- Prefer semantic `camelCase` classes, not appearance-based utility classes.
  - Preserve class names supplied by external libraries.
- Use IDs sparingly for page scope
- **Never allow `!important`** as they break the cascade and make styles harder to maintain.
- Use `0` instead of `0px`, without changing units on non-zero lengths.
- Keep existing hover, focus, disabled, responsive, print and reduced-motion behaviour when refactoring.
