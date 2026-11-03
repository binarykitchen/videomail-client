---
description: "Use when: creating or editing Markdown documentation, READMEs, or instructions"
---

# Documentation

All must be written in Markdown format.

## Preferences

- Documentation shall be more like a welcoming, entertaining way for:
  - guidance for new developers rather than exhaustive technical references.
  - coming with a collection of useful links and advices.
  - simple steps to figure out this or that problem etc.
  - explain important decisions made during development for historical context.
- Generally, we do not want to bloat up documentation. Humans hate too much documentation ;)
- Anything else should be documented inline, inside the code base itself, close to the relevant code.
  - The only exception is that if it's being repeated too much in the code base, move it to documentation instead.

## Outdated/Duplicate contents

- Regularly review documentation under `docs/` to remove outdated content.
- If existing documentation could replace instructions under `.github/instructions`, do not bloat up instructions but rather reference the existing documentation.
- Merge duplicate content into a single, coherent section.
- Raise when chapters are structured poorly or lack clarity.

## Language

- Keep it simple and clear. Avoid complex sentences and jargon.
- Break them down into smaller, digestible parts for better understanding.
- Use active voice and present tense whenever possible.
- Adding a fun, sarcastic, or humorous tone is encouraged.
- Use emojis and text style to make the documentation more approachable and fun.

## Style

- Keep paragraphs semantically **fluid**. Do not hard-wrap prose to fit editor width.
- Use headings and subheadings to structure the content.
- Consider alerts (e.g., `> **Note:**`, `> **Warning:**`) to highlight important information.

### Line-breaks

- Separate paragraphs with a blank line. Keep structural line breaks for headings, lists, tables, and code fences.
- One paragraph only can contain two sentences.
  - If more information is needed, reconsider the following:
    - For example a diagram which replaces more than thousands of words.
    - Splitting content into further sub-chapters and bullet points.

### Lists

- Use `-` for unordered lists.
- Indent sub-items with two spaces.
- Use numbers for ordered lists.
  - For parent-child numbered sections, continue the nested numbering style:
    - Example: 1.1, 1.2, 1.3, etc.

### Paragraphs

- They give structure and readability to the content, making it easier for readers to follow along.
- Separate paragraphs with a single line break to maintain clarity and flow.

### Length

We all are tired and busy, right? So let's keep things short and sweet, by:

- Keep documentation concise and to the point.
- Avoid unnecessary verbosity and filler content.
- Visualise complex concepts with diagrams, images, or examples where appropriate.
- If a chapter exceeds a reasonable length, consider splitting it into smaller sub-chapters for better readability.

### Headings

Keep them short, to the point.

- Spice them up with some humor 😄
- Amend with some emojis 🎉

## Markdown

### Format

- Plain structured sections/lists for cleaner raw edit readability are preferred over markdown tables. That said, avoid table layouts and convert them to edit-friendly plain sections.
- Use bullets for naturally list-shaped content; do not split prose into bullets just to reduce editor line length.

### Validation

When changing markdown files, run markdown linting or the repo's markdown formatter before handover so documentation changes do not introduce markdownlint errors.

## External Libraries

If external libraries used in this repository already have documentation, link to it instead of duplicating content here. This keeps our documentation concise and avoids redundancy.
