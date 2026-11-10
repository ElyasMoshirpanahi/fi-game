# Code review: Sections of Circles of Lessons (feat/lessons)

Date: 2026-11-10. Fixed point `main`. Spec: the owner's Task 2 request, decisions 30 to 37, ADR-0010, GLOSSARY.md, docs/content-brief-v3.md. Standards: ADR-0001 to 0010, GLOSSARY.md. Two reviewers in parallel.

## Standards (summary)

Hard: ADR-0003 had no amendment for a non-additive in-place migration; ADR-0008 lacked the `circle` event, the content loader seam (`registerBook`, `isLoaded`, `bookUrl`, `circleOf`, XP constants), the new `UI_*` actions and render's `setLoading` / `setError`; the "~" glyph was hard-coded (ADR-0002). Judgement: `units` field kept for Lesson ids after Unit was retired; dead v2 strings, icons and `unitStop` book branches; `registerBook` did not check the file's id; unused `circleStop` parameter; `setError(msg)` value ignored; no guard on `circle` in `bookHeader`; duplicated test helpers; fairness and parity tests skip unloaded books (covered by books-v3.test for English only).

## Spec (summary)

- Sizing is a fixed template per tier (3x4, 2x4, 1x3; Points 11 to 13, almost all 12). The request asked for variation by value, complexity and points; only value varies. Owner decision needed.
- Fairness in practice: tap options were never shuffled; 15 books had every correct answer first. The correct option is also the longest in 363 of 546 tap Checks.
- Personalised advice in b12c1l3p12, b12c2l5p1, b06c3l4p12; a misreading of Taleb's barbell in b25c2l1p10; an overclaim in b06c1l1p1.
- Migration missed a document whose only legacy trace is a book bookmark.
- Met: framing Point and time box (decision 36), 10/25/50 XP (decision 37), load failure leaves the app usable.

## Disposition

Fixed: all five Cards rewritten (en and fa) and the brief tightened; tap options shuffled deterministically by Check id at register time, answer remapped, tested for spread; `registerBook(json, expectedId)`; migration detects bookmarks and runs; ADR-0003, 0008 and 0010 amended; "~" moved to i18n; dead strings, icons and branches removed; `sec.units` renamed `sec.runs`; `lang()` helper for aria labels; `bookHeader` guard; shared `test/helpers.mjs` (new tests use it); a render smoke test, added after the rename broke `pathScreen` while every engine test stayed green (proven red with the bug reintroduced).

Open: the fixed sizing template (owner decision); "correct option is the longest" bias (content rewrite); fairness on the Farsi text is not machine-checked; older test files keep their local helper copies.
