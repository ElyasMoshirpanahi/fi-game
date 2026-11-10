# Content brief: v3 book files (Sections of Circles of Lessons)

For content agents writing `content/books/v3/<id>.json`. Read GLOSSARY.md (Section, Circle, Lesson, Point, Check, Fare) and docs/adr/0010-lessons-loaded-on-demand.md first. The two pilots `content/books/v3/b04.json` (low tier) and, once present, `content/books/v3/b01.json` (high tier) show the exact shape; match them.

## Inputs

- The book's existing content: `content/books/<id>.json` and `content/books/<id>-apply.json`. Reuse those Cards inside the new Lessons (new ids; light edits allowed).
- Copy `title`, `author`, `year`, `stage`, `must`, `why`, `badge` exactly from `content/books/<id>.json`. Set `tier` as given in your task.

## Shape

```json
{ "id": "b05", "title": "...", "author": {"en": "...", "fa": "..."}, "year": 2011, "stage": 1, "must": false,
  "why": {"en": "...", "fa": "..."}, "badge": {"en": "...", "fa": "..."}, "tier": "low",
  "circles": [
    { "id": "b05c1", "title": {"en": "...", "fa": "..."},
      "lessons": [
        { "id": "b05c1l1", "title": {"en": "...", "fa": "..."}, "minutes": 12,
          "items": [
            {"kind": "card", "id": "b05c1l1p1", "frame": true, "text": {"en": "...", "fa": "..."}},
            {"kind": "card", "id": "b05c1l1p2", "text": {"en": "...", "fa": "..."}},
            {"kind": "check", "id": "b05c1l1k1", "type": "tap", "source": "b05c1l1p2", "prompt": {"en": "...", "fa": "..."},
             "options": [{"en": "...", "fa": "..."}, {"en": "...", "fa": "..."}, {"en": "...", "fa": "..."}], "answer": 0}
          ] } ] } ] }
```

## Sizing (decisions 31 and 35)

| tier | Circles | Lessons per Circle | Points per Lesson |
|------|---------|--------------------|-------------------|
| high | exactly 3 | 4 (3 to 5 allowed) | 10 to 15, 12 typical |
| mid  | exactly 2 | 4 (3 to 5 allowed) | 10 to 15, 12 typical |
| low  | exactly 1 | 3 (3 to 5 allowed) | 10 to 15, 12 typical |

The 20/80 rule: the Circles cover the 20 percent of the book that carries 80 percent of its value. Name each Circle for a theme and each Lesson for the idea or chapters it distils. `minutes` is about one per Point.

## Rules the validator enforces

- The first Point of every Lesson has `"frame": true` and says what part of the book this Lesson distils and why it matters to the player.
- A Check after every 2 to 3 Points: never more than 3 Points in a row without a Check; total Checks between floor(points/3) and ceil(points/2).
- At least one tap and one true/false Check per Lesson; `order` Checks only for real sequences.
- A Check's `source` Card comes before it in the same Lesson.
- Fairness: for a tap Check, every word of 4+ letters in the correct option's English text appears (same first 4 letters) in the source Card's English text; same for every option of an order Check.
- Wrong options plausible but clearly wrong; never trick questions.
- Cards at most 2 sentences and 220 English characters.
- Every string has non-empty `en` and `fa`. Natural Farsi, Persian digits in Farsi, Latin script for the title, author names and technical terms (ETF, DCF, cap table, MVP).
- Ids: Circles `<id>c1..`, Lessons `<id>c1l1..`, Points `<id>c1l1p1..`, Checks `<id>c1l1k1..`.

## The player

A software engineer or CTO with Iranian citizenship, about €40k capital, moving to the Netherlands (BSN, then a broker such as Interactive Brokers or DEGIRO). The roadmap: wealth is built by ownership (startup equity with a written cap table and vesting, a small AI product people pay for, first goal €100 of ownership income) and kept with index investing (core-satellite, 80 percent index ETFs such as VWCE / IWDA); target capital 25 times annual expenses; 1 hour of reading a day, a decision journal, a quarterly net-worth log, a mentor, sleep. Use this in framing Points and in a few applied Points per Circle; most Points teach the book.

## Accuracy and tone

Be accurate to the book: real chapter ideas, real examples, real names. Do not invent claims the book does not make. Educational, second person where applied, never personalised investment advice ("buy X now").

## Validate and report

Run `node scripts/validate-book-v3.mjs content/books/v3/<id>.json` from the repo root and fix until it prints OK. Do not touch any other file. Reply with one line: id, circles, lessons, points, validator result, file size in KB.
