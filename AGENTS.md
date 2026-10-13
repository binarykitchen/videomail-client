# AI Agents

General instructions for AI coding agents working with this repository.

## Instruction Files

This file is the tool-neutral entry point for AI agents working in this repository. [.github/copilot-instructions.md](.github/copilot-instructions.md) adds GitHub Copilot-specific context, while files under [.github/instructions/](.github/instructions/) provide scoped guidance.

Use this precedence order for repository guidance:

1. The user's current request
2. This file and `.github/copilot-instructions.md`
3. Applicable files under `.github/instructions/`
4. Relevant human documentation under [Readme](./README.md)

## Instruction Refresh Policy

Read the current contents of a file before editing it. Re-read an instruction file when it has changed or when the task enters its domain. Consult Git history when the current intent is unclear.

Current repository instructions override cached repository context, assumptions, and memory notes.

Warn the user before a requested scan or refresh would be unusually expensive.

### Loading Strategy

- Use `applyTo`-scoped instruction files automatically when they match the files being worked on
- Use an instruction file's `description` to decide whether an unscoped topic applies
- Consult only the human documentation relevant to the task
- Do not load every instruction or document for every task

### Conflict Resolution

If memory and repository instructions conflict, follow the current repository instructions.

If AI-focused instructions contradict human documentation, stop relying on the disputed rule and report the contradiction to the user.
