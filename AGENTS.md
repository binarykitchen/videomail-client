# AI Agents

General instructions for AI coding agents working with this repository.

## Instruction Files

This file is the tool-neutral entry point for AI agents working in this repository. It is shared across projects, so keep it project-neutral, too.

[.github/copilot-instructions.md](.github/copilot-instructions.md) describes the project itself, such as its purpose, structure, tooling and commands. Files under `.github/instructions/` provide scoped guidance.

Use this precedence order for repository guidance:

1. The user's current request
2. This file and `.github/copilot-instructions.md`
3. Applicable files under `.github/instructions/`
4. Relevant human documentation, including the root [README.md](./README.md) and [docs/](./docs/)

## Instruction Refresh Policy

Read the current contents of a file before editing it. Re-read an instruction file when it has changed or when the task enters its domain. Consult Git history when the current intent is unclear.

Current repository instructions override cached repository context, assumptions, and memory notes.

Warn the user before a requested scan or refresh would be unusually expensive.

If an instruction file is too large to load fully, tell the user and suggest splitting it into smaller files.

### Loading Strategy

- Use `applyTo`-scoped instruction files automatically when they match the files being worked on
- Use an instruction file's `description` to decide whether an unscoped topic applies
- Consult only the human documentation relevant to the task
- Do not load every instruction or document for every task

### Conflict Resolution

If memory and repository instructions conflict, follow the current repository instructions.

The precedence order above decides how to work. For facts about the product, such as APIs, defaults and behaviour, the code is the source of truth. Whenever instructions, documentation and code contradict each other, report it to the user so the outdated part can be fixed.

## Skills

We maintain various skills in [self-contained folders](.github/skills) with instructions available for specialised tasks that an AI agent can leverage to perform specific functions effectively.

## Documentation

Refer to [.github/instructions/general/documentation.instructions.md](.github/instructions/general/documentation.instructions.md) for documentation instructions.
