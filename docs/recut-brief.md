# Re-cut brief: sizing by complexity

For agents re-cutting one existing `content/books/v3/<id>.json` to its owner-approved shape (docs/sizing-complexity.md). Read docs/content-brief-v3.md first: every rule there still holds (framing first Point, a Check every 2 to 3 Points, tap and true/false per Lesson, fairness, 2 sentences and 220 characters per Card, en and fa, accuracy, no personalised advice).

## Your job

1. Run `node scripts/validate-book-v3.mjs content/books/v3/<id>.json`. The errors tell you what is off: Lessons per Circle or Points per Lesson for the book's `complexity`.
2. Change the file in place until it validates. Keep everything that already fits.

## How to shrink

- Too many Lessons in a Circle: remove the weakest Lesson (the one whose ideas matter least to the book's core 20 percent). If one or two of its Points carry something essential, move them into a neighbouring Lesson, replacing weaker Points there. Renumber Lesson ids so they stay sequential (`<id>c1l1`, `<id>c1l2`, ...) and update the `id` prefix of every Point and Check inside a renumbered Lesson.
- Too many Points in a Lesson: remove the weakest Points and any Check whose `source` is a removed Point; keep the cadence rule (never more than 3 Points in a row without a Check).
- Update `minutes` to the new number of Points.

## How to grow

- Too few Lessons: add Lessons at the end of the Circle (next sequential id) covering important parts of the book the Circle's theme has not covered yet. Do not repeat existing Points.
- Too few Points: add Points (and Checks to keep the cadence) inside the Lesson, continuing its idea. New Point ids continue the numbering (`...p13`, `...p14`); new Check ids likewise (`...k6`).
- Every new Lesson starts with a framing Point (`"frame": true`).

## Rules

- Keep existing Point ids where the Point stays in its Lesson (bookmarks point at them).
- Do not change `title`, `author`, `year`, `stage`, `must`, `why`, `badge`, `tier`, `complexity`.
- Touch no other file. Validate until OK. Reply with one line: id, circles, lessons, points, validator result, file size in KB.
