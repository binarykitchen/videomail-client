---
applyTo: "**/*.{js,cjs,mjs,jsx,ts,tsx}"
description: "Use when: creating or editing JavaScript or TypeScript classes"
---

# Classes

Object-oriented programming (OOP) is welcome where it fits, although we prefer functional programming and composition over heavy class hierarchies.

## Class names

- Name classes in PascalCase.
- Follow the existing file-naming convention; class and file names do not need to match.

## Class attributes

- Define them first. Public first, protected ones next and private ones last.
- Use the `readonly` modifier whenever possible to indicate immutability.

## Class constructor

- Keep the constructor simple and focused on initializing the class attributes.
- Avoid putting complex logic or side effects in the constructor.
- If initialization requires asynchronous operations, consider using an `init` method instead of doing it in the constructor.

## Class methods

- Keep methods focused on a single responsibility.
- The naming convention for functions applies to class methods as well.
- If there are functions, utilities doing the same job, ensure the method delegates to them rather than duplicating logic.
- Extract complex conditional logic into private methods when that improves clarity. Keep straightforward conditions in place.
- If a public method is nowhere else used, consider making it private to limit the class's public API surface.
- Prefer composition over inheritance; favor small, focused classes that can be combined rather than large hierarchies.
