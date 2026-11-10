---
status: accepted
---
# One self-contained index.html

The game ships as a single `index.html` with inline CSS and JavaScript, no build step, no framework, no bundler. The only allowed external request is Google Fonts (Vazirmatn, Inter). We chose this so the file can be opened from disk, hosted on GitHub Pages with zero configuration, and inspected whole by the owner, who is the main player. The cost is that the engine, content, store and render code live in one file; the codebase design note keeps them separable for testing.

## Consequences

- No external scripts, ever. A test asserts this.
- Total size stays under 200 KB. Amendment 2026-11-09 (owner decision 19): with 28 Book Units (decision 18) the cap is 400 KB; GitHub Pages gzips, so the wire size stays near 70 KB.
- Development tooling (vitest, node) exists only in the repo, never in the shipped file.
- Amendment 2026-11-10 (ADR-0010, owner decision 30): book Lessons live in same-origin JSON files under content/books/v3/ and load on demand. Still no external scripts and no third-party requests. The page opened from disk plays Basics only.
- Amendment 2026-11-10 (spec 5, owner decision 38): the game is one page plus same-origin files beside it: the book JSON files, a web app manifest, icons, and a service worker (`sw.js`). The worker is registered by the page's own script, not loaded by a script tag; it imports nothing and requests nothing from another origin. Still no external scripts. Opened from disk the page registers no worker and plays as before.
