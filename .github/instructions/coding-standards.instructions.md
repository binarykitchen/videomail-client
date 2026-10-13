---
applyTo: "**/*.{js,cjs,mjs,ts,tsx}"
description: "Use when: creating or editing JavaScript or TypeScript source files"
---

# Coding Standards

- Before modifying any file, read `eslint.config.js`, `prettier.config.js`, and `tsconfig.json` in the repo root and apply their rules to all output.
- ESLint, Prettier, and TypeScript configuration are the executable source of truth for rules they enforce. These instructions explain preferences that automated tools cannot fully express.
- If prose guidance conflicts with an automated tool, follow the tool and report the outdated guidance.

## Philosophy

Keep it simple. KISS.

- Prefer TypeScript for repository automation scripts. Use JavaScript or MJS only when a tool requires it or TypeScript cannot run in that execution environment.
- Prefer the smallest working change, avoid premature abstraction and optimization.
- Keep functions short and shallow when practical.

### Business logic vs technology-specific code

- Split business logic and technology-specific code as much as possible.
- So that we can switch technologies without having to rewrite the business logic.

### Functions

In general: let's keep them **pure, immutable and reusable**.

Never change function parameters inside the function.

#### One file = one primary job

- Each function should do one thing and do it well.
- If a function is doing more than one thing, split it into focused functions. Use separate files when the functions are independently reusable or the existing folder convention calls for it.
- Add focused tests under the nearest `__tests__` folder when behavior or regression risk warrants them. Use Vitest and name test files `<name>.test.ts`.
- Keep reusable functions self-contained. Local callbacks and closures may remain near their use.
- Never declare a function twice.
- A function may return a value or deliberately perform a side effect.
  - Name accessors with verbs such as `get` and side-effecting operations with verbs that describe the action.
  - If it modifies a parameter, then this is not acceptable. Functions should not have side effects on their parameters. Instead, return a new value and let the caller decide what to do with it.
  - In short, it's about staying pure functional all the way.
- Name functions very well, so that the name clearly describes what the function does.
  - Function names should be verbs, not nouns. For example, `getUser()` is better than `user()`.
  - Keep names concise without sacrificing meaning. A very long name can indicate that the function has too many responsibilities.

Like that, if we fine-grade functions, they become easier to reuse and to test. They also become more readable, because they have a clear purpose and a clear name.

#### Return behaviour

- Prefer returning early, instead of nesting the main logic inside an `if` statement. This reduces indentation and improves readability.
- Return expressions directly when the result is already clear. Introduce a named constant when it clarifies intent or supports debugging.

#### Function declarations over arrow functions

- Prefer `function foo() {}` declarations over `const foo = () => {}` arrow function expressions.
- Prefer declarations for named functions when either form is equally clear.
- Exception: inline callbacks passed directly as arguments (e.g. event handlers, array methods) may use arrow syntax for brevity where no `this` ambiguity exists.
  - The one-primary-job-per-file rule applies to
    - exported or reusable helpers.
    - pure, vanilla functions not related to React components or hooks.

## Comments

- We do not like long comments.
- Keep them concise, the human way, and easy to read. Emojis are encouraged.
- Avoid redundant comments that state the obvious.
- **But** when it's a complicated or non-obvious piece of code, provide a clear and concise explanation.
- For important, non-obvious behavior or complexity like long if-else chains, **always** add a short inline comment explaining intent or consequence.
- When it comes to routine, self-explanatory code, keep it uncommented.
- Add emojis and some humor to make comments more engaging.
- Add line-breaks in between paragraphs to improve readability.
- When it comes to language in comments:
  - Use clear and plain language that is easy to understand.
  - Remember that it's mostly for (tired) human readers, not for machines.
  - Links or ASCII diagrams are welcome whenever they help clarify the intent or behavior of the code.
  - Avoid jargon or overly technical terms unless necessary.

Add a comment when non-obvious intent, constraints, or tradeoffs would otherwise be lost. Do not add comments merely to record that code changed.

## If-else conditions

We have plenty of those and they reflect our business logic which is crucial. At the same time, too many if-else statements can make the code harder to read and maintain. So:

### General

- Avoid deeply nested conditionals.
- Very short ternary expressions are acceptable for simple value choices.
- Put all if-checks in constant expressions whenever possible.
- Avoid early returns unless it's a performance optimization.
  - Because, in an ideal world, each function should only return the value at the end of the function, not before.
  - Also makes debugging easier, as you have a single exit point to inspect.
- Do not compute a value before an if-else if it is needed only in one branch.
- If an if condition comes with more than one check, replace it with a self-descriptive helper function.
  - Why? With a good function name, no comment is needed to explain the condition ;)

### Multi-step branches

- When dealing with multi-step branches, consider breaking them into smaller helper functions to improve readability.
- Or break it down into a switch statement when it makes the logic clearer.
- Keep the main branch logic as linear and straightforward as possible.

## Promises

- Prefer `async`/`await` when it makes asynchronous control flow clearer. Returning an existing promise directly is fine when no additional handling is needed.

### How to write comments

- Keep them very short and to the point.
- Do not sound too stiff, and not too formal.
- Try a more casual, cool, modern tone.
- Include emojis, because this project is for Sign Language users, using visual expressions.
- Replace weak verb + adverb pairs with stronger alternatives.
- Adding emojis is fine, but do not overdo it. Use them only when they add value to the comment.

## Specific rules

### Spreading operators

- Use spread syntax only when it is the clearest immutable operation.
  - But really, we prefer `Object.assign`, `Array.concat`, or `Array.from` when those APIs better express the intended behavior.
  - It is about human readability and understanding, not just code brevity.

### Avoid unnecessary work

- Guard filesystem, network, and other potentially expensive or side-effecting checks with an early return when their input is missing.
- Prefer an explicit guard over hiding the check behind a compound boolean expression.

### Defaults and options

- Do not pass explicit default parameters or options when omitting them keeps the code simpler and the behavior stays the same.
- Prefer the library's built-in defaults unless the code needs to override them for a concrete behavior change.

### Package management

- Never use `npm install --legacy-peer-deps`, `npm uninstall --legacy-peer-deps`, or any other npm command with `--legacy-peer-deps`.
- About `npx`:
  - It is a convenience tool for running binaries from npm packages without installing them globally. However, it can lead to inconsistent behavior and versioning issues.
  - For a starter, always declare project dependencies in `package.json`, install them with `npm ci` or `npm install`, and invoke local binaries from `node_modules/.bin`.
  - For convenience it is okay to use `npx` for one-off commands, but avoid it for project scripts and automation.
- Resolve peer dependency conflicts properly by upgrading, downgrading, replacing, or removing the conflicting packages.
- If a dependency tree cannot be resolved cleanly, stop and report the conflicting packages and versions to the user instead of applying any workaround flag.

### Formatting and validation before handover

- Any file modifications done by an agent must already be properly formatted according to this repository's standards (Prettier, ESLint and TypeScript settings in the root config files).
- Before handover, run relevant validation for touched files, including `eslint --max-warnings 0` on touched files, and resolve all errors and warnings.
- If a touched file already has unrelated ESLint violations, fix them only if trivial; otherwise report them to the user before handover.

### Constants

- Move invariant values outside frequently called functions when doing so improves clarity or avoids repeated work.
- Always uppercase constants with underscores when they represent fixed configuration, e.g. `const MAX_RETRIES = 5`.
