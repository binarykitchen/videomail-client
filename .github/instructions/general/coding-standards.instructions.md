---
description: "Use when: creating or editing JavaScript or TypeScript source files"
---

# Coding Standards

- Before editing code, inspect the repository's configured formatter, linter, and type checker, and apply their rules to your changes.
- Automated tooling is the source of truth for rules it enforces. These instructions cover preferences the tools do not express.
- If prose guidance conflicts with an automated tool, follow the tool and report the outdated guidance.

## Philosophy

Keep it simple. KISS.

- Prefer TypeScript for automation scripts when the repository supports it. Use JavaScript or MJS when a tool requires it or TypeScript cannot run in that environment.
- Prefer the smallest working change, avoid premature abstraction and optimization.
- Keep functions short and shallow when practical.

### Functions

In general: let's keep them **pure, immutable and reusable**.

Never change function parameters inside the function.

- Keep each module focused on a primary responsibility. Keep small, cohesive helpers near their callers; extract a helper into its own module when reuse, complexity, or ownership makes that clearer.
- Keep callbacks and closures local when only their owning function uses them. Do not create files solely for inline callbacks.
- Keep constants near their use unless they are shared or represent configuration that belongs in a dedicated module.
- Add focused tests when behavior changes or regression risk warrants them; follow the repository's unit test guidance for test placement and naming.
- Keep reusable functions self-contained.
- Put shared code in the repository's established shared module and keep other helpers in the layer that owns them. Check for an existing suitable module before creating one; ask when ownership is unclear.
- A function may return a value or deliberately perform a side effect.
  - Name accessors with verbs such as `get` and side-effecting operations with verbs that describe the action.
  - If it modifies a parameter, then this is not acceptable. Functions should not have side effects on their parameters. Instead, return a new value and let the caller decide what to do with it.
  - In short, it's about staying pure functional all the way.
- Name functions very well, so that the name clearly describes what the function does.
  - Function names should be verbs, not nouns. For example, `getUser()` is better than `user()`.
  - Keep names concise without sacrificing meaning. A very long name can indicate that the function has too many responsibilities.

This makes functions easier to reuse and test. They are also easier to read when each has a clear purpose and name.

#### Function naming conventions

- If it returns a boolean, always start with `is`, `has`, `can`, or `should`.
- Otherwise if it returns a value, name it according to what it represents.
  - For example, `getUser()` should return a user object, and `calculateTotal()` should return a total value.
  - Prefixing with a verb is always a great idea.

#### Return behaviour

- Return simple expressions directly.
- Use a named constant when it clarifies intent or helps with debugging.

#### Function declarations over arrow functions

- Prefer `function foo() {}` declarations over `const foo = () => {}` arrow function expressions.
- Prefer declarations for named functions when either form is equally clear.
- Use arrow functions for inline callbacks when they are clearer and do not create `this` ambiguity.

#### Function parameters

- Keep parameter lists small. Group related values in a named object only when it clarifies the function's contract.
- Too many parameters can signal that a function has too many responsibilities; consider splitting it into focused helpers.
- Do not remove obsolete function parameters.
  - But prefix them with an underscore (_) to indicate that they are obsolete.
  - Because they might become necessary again in the future or are required for backward compatibility.
  - Also because we humans do not always remember the full context, and keeping the parameter helps maintain clarity and intent.

## If-else conditions

We have plenty of those and they reflect our business logic which is crucial. At the same time, too many if-else statements can make the code harder to read and maintain. So:

### Business logic

Move out **every** if-else inline conditions to separate functions with descriptive names and comments about their purpose.

Really, every inline if-else condition should be moved out.

Why? It's about splitting down business logic into smaller pieces. In the long run, this will enable us to simplify the main flow and make the business logic easier to understand and maintain.

### General

- Avoid deeply nested conditionals.
- Keep each `if` condition understandable at a glance, by:
  - a good self-explanatory function name or variable name that makes the condition clear without needing to mentally combine multiple rules.
  - Extract complex decisions into clearly named boolean helpers (`should...`, `can...`, `is...`, or `has...`), or use named boolean variables for a one-off local decision.
  - Keep simple guards and obvious combinations inline; do not add a helper for every operator.
- Very short ternary expressions are acceptable for simple value choices.
- Use guard clauses when they reduce nesting or avoid unnecessary work.
- Do not compute a value before an if-else if it is needed only in one branch.
- Extract compound conditions into a clearly named helper when that improves readability.
  - Why? With a good function name, no comment is needed to explain the condition ;)

### Multi-step branches

- When dealing with multi-step branches, consider breaking them into smaller helper functions to improve readability.
- Or break it down into a switch statement when it makes the logic clearer.
- Keep the main branch logic as linear and straightforward as possible.

## Promises

- Prefer `async`/`await` when it makes asynchronous control flow clearer. Returning an existing promise directly is fine when no additional handling is needed.

## Specific rules

### Spreading operators

- Use spread syntax when it clearly expresses an immutable copy.
- Prefer an explicit API such as `Object.assign` or `Array.from` when it better communicates intent.

### Avoid unnecessary work

- Guard filesystem, network, and other potentially expensive or side-effecting checks with an early return when their input is missing.
- Prefer an explicit guard over hiding the check behind a compound boolean expression.

### Defaults and options

- Do not pass explicit default parameters or options when omitting them keeps the code simpler and the behavior stays the same.
- Prefer the library's built-in defaults unless the code needs to override them for a concrete behavior change.

### Formatting and validation before handover

- Any file modifications done by an agent must be properly formatted according to the repository's configured standards.
- Before handover, run relevant configured validation for touched files, such as linting, formatting checks, or type checking, and resolve new errors and warnings.
- If a touched file already has unrelated lint violations, fix them only if trivial; otherwise report them to the user before handover.

### Constants

- Move invariant values outside frequently called functions when doing so improves clarity or avoids repeated work.
- Always uppercase constants with underscores when they represent fixed configuration, e.g. `const MAX_RETRIES = 5`.
- Always give constants very self-explanatory names that clearly indicate their purpose and usage.
  - If they represent unit values, include the unit in the constant name, e.g., `const TIMEOUT_MS = 5000`.
