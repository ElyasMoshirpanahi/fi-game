# Code review: Sections on the Path (feat/sections)

Date: 2026-11-10. Fixed point `main`, one feature commit, 40 files. Spec: decisions 22 to 29 in `docs/decisions-grill.md`, ADR-0009, GLOSSARY.md, the prototype verdict, the Unit 3 content brief. Standards: ADR-0001 to 0009, GLOSSARY.md. Two reviewers in parallel; reports lightly cleaned, not merged.

## Standards

Hard (documented standard):

1. engine `migrateV1` + `light`: new reducer event `section`; ADR-0008 lists events explicitly and `section` is missing there and in ADR-0009. Doc drift, amend ADR-0008.
2. app block, `store.save(storage, state)` after HYDRATE: in-place rewrite of `fi-roadmap-v1` with the migrated shape. ADR-0003 says "never an in-place rewrite". ADR-0009 overrides, but ADR-0003 carries no amendment. Add one.
3. `scripts/build-books.mjs` `badge3: apply.badge`: written 28 times into BOOKS, never read. Dead bytes in a 394 KB file against the 400 KB cap (ADR-0001). Drop or use.
4. GLOSSARY.md Station entry still says "section (reserved for the source HTML)" while Section is now a game term. Internal contradiction.
5. Render `sectionHeader`: " ✓" and the picker " ▾" are hard-coded glyphs in markup (ADR-0002). `ICONS.check` already exists; ▾ should be an icon or i18n key. ⭐/○ in the banner duplicate the pre-existing bookCard pattern (judgement, same rule).
6. `unitNode` aria-label always English, also in FA mode. ADR-0006 says FA is a full right-to-left rendering; pre-existing pattern, extended here.

Compliant: no external scripts; `yr` uses FA digits only in FA, Latin in Both (ADR-0006); engine `migrateV1` and `light` touch only state and content (ADR-0008); Units always openable (ADR-0004); section ids `sec-bNN`, unit ids `bNNuN`, xp 20/30, `fareSize = min(3, checks)`, migration rules all match ADR-0009; `store.save` swallows errors (ADR-0003).

Smells (judgement calls):

- Duplicated Code: `/^b\d\d$/` in `isBook` and again in the HYDRATE run check. Reading-order lit count repeated in `unitNode`, `shelfWidget` and `light`. `doneOf(sec) === sec.units.length` four times. `passUnit` in `test/sections.test.mjs` copies `passStation` and drops its guard throw.
- Primitive Obsession / Shotgun Surgery: id scheme rebuilt outside content: `` s.lit[`sec-${b.id}`] `` in `bookCard`, `'sec-' + action.value` in `UI_JUMP`, `k + 'u1'` in `migrateV1`. Use `content.sectionOf(id)`. The `'__none__'` sentinel in `ui.openSection`; `handleUi` return protocol grows to full, partial, path and the app dispatches `BACK_TO_PATH` for a `UI_*` action (ADR-0008 glue drifting).
- Speculative Generality: `sectionOfUnit` exported, unused; `unitNode(..., idx)` unused; `sectionHeader(s, content, ...)` content unused.
- Feature Envy: `litBooks` computed per node in `unitNode`, used only for s6.
- Mysterious Name: Shelf button carries class `bookmarks-btn`; `unitNode` names a Unit with its Avoid word.
- Magic numbers in tests: `3 * 20`, `books.length * 30` while `SECTION_XP` exists.
- `build-books.mjs` deleted the U+2028 / `</script` escape comment with no code change.

## Spec

Tests: 537 pass. index.html 394,493 bytes.

(a) Missing or partial:

1. Decision 23: "Unit 1 and 2 split the existing Book Unit (3 Cards and 2 Checks each)". `split()` assigns Checks by source Card, so 6 of 28 books come out uneven: b09 gives u1 3c/1k, u2 3c/3k; b16, b17, b21, b26, b28 give u1 3c/3k, u2 3c/1k. Those 1-Check Units get a one-question Fare. b22 (5 Cards) splits 3c/2k + 2c/2k. ADR-0009 only promises a two-question Fare; a one-question Fare is undocumented. `test/sections.test.mjs` asserts `checks >= 1`, so the test does not guard decision 23.
2. Decision 25: "A section picker at the top of the Path". Shipped as a fixed bottom button (decision 29 bottom sheet). Decision 29 wins, but 25 was never amended.

(b) Not asked for:

- `BOOKS` carries `badge3` for all 28 books; no reads. Dead bytes 6 KB under cap.
- `bookHeader()` dropped "Stage N", replaced by the Unit name. Not in any decision.
- New Shelf button in the Path foot (play-test bug 2). Reasonable, but decision 28 says Shelf stays under Library Tools.
- `.node > button` restyled to `.node > .ubtn` (pre-existing bug 4), `yr()` formatter, pull-out now fires for book Units, bookmark kicker adds the Unit name.
- `ui.en.openUnit` / `replayUnit` strings now unused.

(c) Implemented, checked:

- Migration: lit and farePassed bNN become u1 and u2, rings recounted from awarded, bookmarks moved to the holder Unit (fallback u1), run in a book nulled and skipped in resume, XP kept. Matches ADR-0009. One-time by the save after boot HYDRATE; `migrateV1` is idempotent. OK.
- Library rule over the ten Sections; the Shelf count agrees. A v1 player with `lit.s6` keeps it although no Section is complete after migration (Unit 3 everywhere unlit). Decision 27 does not say to revoke; acceptable, noted: the Library can show 0/10 beneath a lit Library node.
- Section banner: cover mark, title, author · year, why, count, badge when lit. Matches decision 29.
- Rewards: Unit 20 XP, Section 30 on all three lit, Basics untouched; the result panel sums 50 on completion. OK.
- Order: `rank = stage * 2 + (must ? 0 : 1)`, tie by id, after readingOrder. OK.
- Unit 3 content (b02, b07, b13, b17, b25 spot-checked): 4 Cards, 3 Checks, 158 to 199 characters, second person, each names its idea. Closest to advice: b02a3 "one all-world ETF such as VWCE or IWDA" and b25a3 "remove ... the broker app on your phone". Educational framing holds; the apply note renders on every Unit 3 Card.

## Summary

Standards: 6 hard, 7 judgement; worst: the ADR-0003 in-place rewrite without an amendment. Spec: 2 missing or partial, 5 not asked for, 0 wrong; worst: six books with a one-question Fare against decision 23.

## Disposition (executor, same day)

Fixed in the follow-up commit: balanced Card split so every Unit 1 and 2 has at least two Checks (test now asserts it; no book needed the fallback); ADR-0003 and ADR-0008 amended; `badge3` dropped; glossary Station entry corrected; check icon and a chevron icon replace the glyphs; aria labels follow the Language Mode; `V1_BOOK` pattern defined once; ids taken from `content.sectionOf`; `litReadingOrder` and `isComplete` helpers; unused export and params removed; `footbtn` class; `unitStop` name; `SECTION_XP` in tests; guard throw restored; escape comment restored; "Stage N" back in the book header; unused strings removed; decisions 25 and 28 wording amended. Left as noted: the `'__none__'` sentinel and the `path` return protocol (small, documented in ADR-0008); ⭐/○ as source notation; a v1 player's lit Library node.
