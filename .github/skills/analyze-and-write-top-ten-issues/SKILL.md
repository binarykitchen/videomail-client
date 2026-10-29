---
name: analyze-and-write-top-ten-issues
description: "Analyze the code and write the top ten issues"
disable-model-invocation: true
---

# Top Ten Issues Analysis Instructions

When analyzing all tracked project files, like code, documentation, workflow, configuration, stories, instructions, basically _everything_ in this repository, follow these guidelines:

1. Re-read the existing `TODO.md` document when it exists, to understand the current state of identified issues.
2. Start the review by re-reading all relevant files and documentation to get a comprehensive understanding of the current state.

   - to identify potential issues, including bugs, performance problems, accessibility issues, security vulnerabilities, and code smells.
   - figure if parts can be replaced with a well-maintained library
   - consider merging duplicate code to a new single function for reuse.
   - check for outdated dependencies and suggest updates if necessary.

3. Prioritize the issues based on their impact and severity.
4. In a `TODO.md` document, which is ignored by git, document the identified issues following these guidelines:

   - write a concise description for each issue, explaining why it is a problem and how it can be fixed.
   - include references to the relevant files, lines of code, or documentation sections where the issue occurs.
   - include checkboxes for each issue to track their resolution
   - use emojis to visually indicate the type, the severity, and the time effort required for each issue separately (one emoji for each aspect)

5. Limit that TODO list to the top ten most significant issues.
6. Order it by impact and severity.

   - The only exception is: when it is a low hanging fruit that can be quickly fixed, move it to the top of the list.

7. Ensure that the issues are clearly understandable and actionable step by step.

## Details

- For any new issue, add a new empty checkbox in the `TODO.md` document to track their resolution.
- Ensure that the `TODO.md` document remains concise and only contains the top ten most significant issues at any given time.
- `TODO.md` is ignored by git for a good reason:
  - it is meant to be a temporary and dynamic list of issues that can change frequently as the project evolves.
  - it varies by environments and machine setups, so it should not be relied upon as a permanent record.
- Regarding completed TODO items:
  - stay in the list as completed items, remain flagged as completed with a checkbox and skip them.
  - it is up to us humans humans to decide based on the context and relevance of the issues.
