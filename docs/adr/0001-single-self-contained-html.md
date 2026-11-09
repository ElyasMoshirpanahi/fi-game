---
status: accepted
---
# One self-contained index.html

The game ships as a single `index.html` with inline CSS and JavaScript, no build step, no framework, no bundler. The only allowed external request is Google Fonts (Vazirmatn, Inter). We chose this so the file can be opened from disk, hosted on GitHub Pages with zero configuration, and inspected whole by the owner, who is the main player. The cost is that the engine, content, store and render code live in one file; the codebase design note keeps them separable for testing.

## Consequences

- No external scripts, ever. A test asserts this.
- Total size stays under 200 KB.
- Development tooling (vitest, node) exists only in the repo, never in the shipped file.
