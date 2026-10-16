---
applyTo: "**/*.{ts,tsx}"
description: "Use when: creating or editing TypeScript or TSX files"
---

# TypeScript

- The root `./tsconfig.json` covers all the TS configuration.

## Type safety

- Keep TypeScript strict and type-safe at all times; do not silently loosen types.
- Avoid introducing explicit or implicit `any`. Use `unknown` or proper type annotations instead.
- Prefer inference for local values and contextually typed callbacks.
- Add parameter types to standalone functions when their parameters cannot be inferred.
- Keep `unknown` for genuinely untrusted input, caught errors, and unspecified external data. Narrow or validate it before use; do not replace it with a guessed type or assertion.
- Do not use `as`, `as const`, angle-bracket type assertions, or `satisfies` in production code. The only exception is a necessary assertion for a unit-test mock, not ordinary test fixtures. Use annotated values, inference, narrowing, or runtime validation instead.
- Add explicit parameter types where inference is unavailable or a public boundary benefits from a stable contract. Always infer function return types when possible.
- Do not annotate callback parameters when the receiving API already defines them. Prefer `emails.map((email, index) => ...)`; improve the source type if inference is wrong.
- Type API request and response boundaries, including library generics that otherwise default to `any`. Static payload types do not replace runtime validation of untrusted input.
- Prefer public types exported by a direct dependency. Avoid coupling to transitive or lower-level type packages when a type can be derived from the public API signature.
- Prefer simple named types and literal unions for known shapes and closed sets of values. Avoid deeply nested types or generic abstractions without a concrete need.
- When a contract is unclear or would need a larger refactor, leave a concise `TODO(types)` describing the missing contract or validation instead of hiding the gap with an assertion.
- Likewise, fixing function parameter types using `&` to intersect with a more specific type it not allowed. Put them in a new type or interface instead, above the function definition.
  - Like that, this improves overall readability for developers.
  - Also, because it might be reused in multiple places, creating a new type or interface ensures consistency and maintainability.
- Avoid too many `typeof` checks; prefer narrowing with type guards or utility functions from `type-fest` for better readability and maintainability.

## Functions

- Give them nice, cool names, easily to remember for us humans.
- Don’t add function return annotations on function level. For example if it's a `sum` function, you shall not annotate it as `function sum(a: number, b: number): number`. Let TypeScript infer the return type.
- Describe function parameters by the fields the function actually consumes. Use `Pick` or a small named interface when a helper needs only part of a larger request, response, or model; use the full type when the function relies on its full contract.

## Useful libraries

- Reuse the installed [type-fest](https://github.com/sindresorhus/type-fest) utilities instead of handwritten mapped types when they describe the contract accurately.
- Useful examples include `Except`, `SetOptional`, `SetRequired`, `PartialDeep`, `ValueOf`, and `EmptyObject`. Use `Jsonify` only for values actually transported as JSON.
- Prefer the simplest accurate utility. Do not stack helpers merely to make a type look stricter.

## Validation

- Run `npm run types` after cross-stack typing changes so both projects check shared contracts.
- Run focused tests when narrowing or validation changes runtime behaviour, and format and lint touched files according to the coding standards.

## Duplicate types

- Avoid duplicating type definitions across different layers of the application. Centralize shared types in a common location and reference them using `import type`.
- When creating new types, check if an existing type can be reused or extended instead of defining a new one.
