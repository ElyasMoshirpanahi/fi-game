# Step 9: code review since the first commit

Date: 2026-11-09. Fixed point `2d0c0be` (Step 0), 21 commits, 60 files. Spec: `docs/decisions-grill.md`, `GLOSSARY.md`, `docs/research/roadmap-facts.md`, `docs-prompts.md` Part 2. Standards: the ADRs in `docs/adr/`. Two reviewers ran in parallel; their reports follow, lightly cleaned, not merged.

## Standards

Hard (documented standard):

- ADR-0002, render: `aria-label="Language"` hard-coded. Screen-reader text is player-visible. Move to `ui`.
- ADR-0006 (FA digits only in FA), render: `${b.year}` raw in the shelf and the book header, literal `+1` in the coin float. Latin digits leak into FA mode. Wrap with `num()`.
- ADR-0008 contract drift, engine: events `fare` and `reset` are not in the listed event set; action `OPEN_TOOLS` and the `UI_*` family are outside the listed actions. `mount` attaches two listeners, the ADR says one delegated listener. `test/rtl.test.mjs` loads `render` in node, the ADR says render is never loaded in unit tests. `t()`, `num()`, `disclaimer()` read the `FI.content` global while `render(root, state, content)` already gets content as a parameter. Either amend ADR-0008 or align the code.
- GLOSSARY, Station, Avoid "unit": `openUnit`, `replayUnit`, `bookUnit` ("Open unit", "Book unit"). Decision 18 coined "Book Unit" but GLOSSARY.md was never updated, so the term is currently banned by the glossary.
- ADR-0004 adjacent: `ui.stationLocked` is dead and named against the ADR and the Avoid "unlocked" entry. Delete.

Compliant: ADR-0001 (no `src=`, only Google Fonts, test enforces), ADR-0003 (one key, try/catch everywhere, run slice per amendment), ADR-0005 (source HTML untouched, decisions table in roadmap-facts.md), ADR-0004 (no lock logic), ADR-0006 EN default and EN-led Both.

Judgement (baseline smells):

- Shotgun Surgery: durable fields listed three times (`initial()`, the HYDRATE loop, store `DURABLE`). Commit 91bd522 ("persist milestone and farePassed, bug from play-test") is exactly this smell firing. Let store export `DURABLE` and have HYDRATE iterate it.
- Duplicated Code: `durable` and `load` share the pick loop; slider math (`income`, `target`, `pct`) in `slidersWidget` and `patch`; `['toread','reading','read']` vs `engine.SHELF_STATES`; stage list `['all','1','2','3','5','6']` vs `[1,2,3,5,6]` in scripts/validate-book.mjs.
- Duplicated Code, tests: `R` helper in four files, `fakeStorage` in two, the Fare walker in three. Extract `test/helpers.mjs`.
- Data Clump / Feature Envy: render `WIDGETS` map re-states which Stations own widgets; content already carries `{ kind:'widget', widget }` items. Derive from content.
- Mysterious Name: `allStations()` returns path Stations only, excluding books; `same` (deepEqual); `one` (primary mode); `A`.
- Repeated Switches: the three-way `mode === 'FA' / 'EN' / else` cascade appears in content `text`, render `pair` and `disclaimer`. One shared resolver.

## Spec

Tests: 347 green. index.html 262 KB.

(a) Missing or partial:

- Decision 16: "Pointer drag reorders as a progressive enhancement." No pointerdown, draggable or dragstart anywhere in index.html. Order Checks are tap-only.
- Prompt 3, Station 2: "five stage cards with topic, resources, '2 to 3 months' chip" and "Keep the BSN / broker note as a callout." Stages are plain Cards (s2c2 to s2c8) with no chip; the broker note (s2c9, s2c12) is a plain Card, no callout.
- Prompt 0: "Preserve every ... caveat." Source note sentence "بخش «هر جای دنیا» عملاً از روز رسیدن به هلند شروع می‌شود" has no Card.
- Research owner decision 4: "ind.nl covers the residence permit (highly skilled migrant thresholds)." s2c14 says only "ind.nl (residence permit)".
- Research decisions 6 to 10: "Add all omitted co-authors ... in the EN copy." s2c8 EN still says "Venture Deals (Feld)".
- Decisions 1, 14, 15: "Published on GitHub Pages", "Pages URL live", public repo. `git remote -v` is empty.

(b) Not asked for:

- `MILESTONE_XP = 100` (TOGGLE_CHECK adds XP). Glossary Milestone is "the single final reward"; no spec gives it XP, and it inflates `totalXp`.
- Station 5 uses `hints: 'short'` ("Look again at card N"). Glossary Hint: "The source line, in both languages." Prompt 3 only exempts Station 6 ("shows fewer hints").
- Library badge "Reading order", book badge names (for example "Blindfolded monkey"), replay button: owner-approved by decisions 18 and 20 in spirit, but badge names are invented, not "named from the Station's source content" (Glossary Badge).

(c) Implemented but looks wrong:

- Prompt 3, Station 4: "weekly habit tracker." `habits[id][day]` has no week identity, so ticks never roll over; last week's ticks show as "This week".
- b22 Paul Graham Essays `year: 2005`. Research table says "ongoing". Invented year.
- s3c4: "Brazil, 2020 study: 97 percent ... more than 300 days". Research: 97 percent is the 2019 version with "at least 300 days"; the 2020 abstract gives 1.1 percent. Cite is the SSRN URL the research says returned 403 (RePEc was used).
- s2c9 cite `interactivebrokers.com/en/accounts/countries.php`; research URL is `open-account-country-list.php`. s1c2 cite is a UBS page not in the research (jbs.cam.ac.uk and the UBS PDF were).
- Executor decision: "Latin digits in EN and Both modes." In Both mode the Farsi under-line is the raw FA string with Persian digits; `pair()` does not convert.
- Spec docs themselves: decisions-grill facts and Glossary Shelf say 30 books; source has 28 (coverage test asserts 28).
- Decision 10 "Nothing stored": store DURABLE includes `run.returning`; harmless since HYDRATE resets it, but it is stored.

## Summary

Standards: 5 hard findings, 6 judgement calls; worst: ADR-0008 contract drift. Spec: 6 missing or partial, 3 not asked for, 7 look wrong; worst: the weekly habit tracker never rolls over.

## Disposition (executor, same day)

Fixed in the follow-up commit: all five standards hard items (ADR-0008 amended where the code is right, code aligned where the ADR is right); Shotgun Surgery on durable fields; shelf states and widget ownership derived from engine and content; drag reorder on Order Checks; Stage chips and the broker callout; the "anywhere in the world" caveat Card; ind.nl wording; "Venture Deals (Feld and Mendelson)"; Station 5 full hints; weekly rollover with an ISO week key carried by the action; b22 year; Brazil wording and citation; IBKR and UBS citations; 28 books in the docs; `run.returning` not stored; the Both-mode digits note corrected in decisions-grill (the FA line keeps Persian digits). Left as judgement calls, noted: test helper extraction, the mode cascade, the names `A`, `one`, `same`. For the owner in the final report: Milestone XP (keep or drop) and the invented book badge names.
