# Supervisor log

Append-only. Step, start time, what was produced, test results, open questions.

## Step 0: Make it a repo
- Start: 2026-11-09
- Produced: `fi-game/` with `content/financial_independence_roadmap_clean.html`, `docs-prompts.md` (copy of FI-GAME-PLAYBOOK.md), `docs/SUPERVISOR-LOG.md`, git initialised.
- Decision (mine): source HTML was at `Desktop\FILES\Web\`, not on the Desktop root; copied from there.
- Tests: none yet.
- Open questions: none.

## Step 1: /grilling the idea
- Start: 2026-11-09
- Produced: `docs/decisions-grill.md`, 16 decisions in 4 rounds, all answered by the owner.
- Owner deviations from the playbook recommendation: default mode EN (not Both); all three check types in Prompt 0 (not two).
- Executor decisions: digits per mode, storage key, fonts, disclaimer (see bottom of decisions file).
- Tests: none yet.
- Open questions: none.

## Step 2: /domain-modeling the vocabulary
- Start: 2026-11-09
- Produced: GLOSSARY.md (18 game terms, 32 finance terms with Farsi and English forms), six ADRs in docs/adr/: single HTML, i18n object, one localStorage key, free navigation with Fare lighting, source HTML read-only, EN default with EN-led Both mode.
- Term collisions resolved: Station (game stop) vs Knowledge Stage (source content), Ring (per Station) vs XP bar (global), Return (same-session) vs review (rejected word), Check vs quiz/question.
- Tests: none yet.
- Open questions: none. Research agent (Step 3) running in background.

## Step 3: /research the facts (background agent)
- Start: 2026-11-09, ran ~17 min in background.
- Produced: docs/research/roadmap-facts.md, 54 claims: 34 confirmed, 9 nuanced, 1 contradicted (ind.nl is not where the 30% ruling is applied for), 10 opinion or prescription.
- Open questions: 10 items flagged for owner decision, being asked now.

## Step 4: /prototype the loop and the look
- Start: 2026-11-09
- Logic prototype: prototypes/logic-engine.html on branch prototype/logic-engine; verdict in docs/prototypes/logic-engine-verdict.md. Eight scenarios driven in node. Two model fixes: Returns dedupe, fresh Fare rotates when the pool equals the Fare size.
- UI prototype: prototypes/ui-variations.html on branch prototype/ui-variations, three variants checked in Chrome, no console errors. Owner chose B (Brilliant lesson). ADR-0007.
- Observed in variant C: a Latin term at the end of an RTL pull quote wrapped with its period on the wrong side. Noted for the RTL play-test.
- Tests: none yet.
- Step 3 owner decisions: all seven flagged groups decided (keep-and-nuance for returns, 25x and 600k to 1M; correct ind.nl; reword brokers to residence; full book attributions with years; add Box 3, 30% ruling and loss-rate cards as research-sourced). Recorded at the end of docs/research/roadmap-facts.md.

## Step 5: /codebase-design the modules
- Start: 2026-11-09
- Produced: docs/adr/0008-module-design.md. Five modules (content, engine, store, render, fx) as script blocks in index.html on an FI global. Test seam: test/load.mjs extracts the DOM-free blocks (content, engine, store) from index.html and evaluates them in node. Storage injected. Engine emits state.events for fx. No build step kept (ADR-0001); concatenation fallback recorded.
- Tests: none yet.
- Step 4 correction (owner, same day): UI pick changed from B to A, "the zigzag road but polished". ADR-0007 rewritten as 0007-duolingo-path-layout.md; the Brilliant file removed.

## Step 6: /tdd the engine and the content rules
- Start: 2026-11-09
- Seams tested (ADR-0008): content data, FI.engine.reduce, FI.store load/save, all loaded from index.html by test/load.mjs. No DOM.
- Red-green cycles: test 1 (i18n parity) red then content block; test 2 (fairness) written over the content, caught one option wording ("Make" vs "making"), reworded; tests 3 to 5 (coins, Returns, Fare lights Station) 14 red then engine block lifted from the prototype; test 6 (store round-trip, disabled storage, corrupt JSON) 5 red then store block; plus ADR-0001 constraints (no external scripts, under 200 KB, disclaimer present).
- Result: 48 tests green. vitest 3.2.7.
- Deviation from pure one-test-one-slice: the engine was inserted whole after test 3 went red, since the prototype had already settled it; tests 4 and 5 were then written and went green without further code. Logged for honesty.

## Step 7, Prompt 0: core loop, Stations 1 and 2
- Start: 2026-11-09
- Produced: index.html with render, fx and app blocks and full styles. Duolingo zigzag Path (ADR-0007), Card and Check screens, Hint after one miss, Fare, Lit Station result, reset behind confirm, disclaimer fixed at the bottom, dark theme, mode toggle sets lang and dir.
- Bug found and fixed before commit: the page never defined the FI global (only the test loader did); blank page, fixed with a one-line bootstrap script.
- Sliders for Station 1 deferred to Prompt 3 as the playbook's Step 7 list says.
- Tests: 48 green.
- Play-test Prompt 0 done (ROLE 3): docs/playtests/prompt0.md. 7 deliberate misses, all fair. One RTL bug (Latin runs with parentheses split in FA mode). Dead stretch in Station 2 Stage Cards. Storage key confirmed, clear-storage run OK, no console errors, 360 px no overflow, light and dark OK. GIF playtest-prompt0-en.gif in Downloads (4 frames; script-driven clicks are not recorded). Awaiting owner verdict.

## Step 8: /diagnosing-bugs, RTL Latin runs (found in the Prompt 0 play-test)
- Loop: in-page script measuring Range rects of "(VWCE", "IWDA)", "A Random", "(Malkiel)" in FA mode; red on the symptom (pieces on different lines, re-ordered). Deterministic, seconds.
- Hypotheses: (1) parentheses outside the <bdi> and author in a separate isolate, so bidi re-orders the pieces at a wrap; (2) bdi not isolating; (3) font metrics. Probe confirmed (1): bdis were ["ETF","VWCE / IWDA",...,"A Random Walk Down Wall Street","Malkiel"], parentheses as neutrals outside.
- Regression test at the render.faHtml seam (test/rtl.test.mjs, 4 tests), red first. Fix: one isolate per run including parentheses, short runs nowrap, escape per piece (the old code also wrapped the letters of HTML entities, caught by the test).
- Loop after fix: VWCE run on one line in order; book run wraps but in logical order. Tests: 52 green.

## Step 7, Prompt 2: make it fun
- Start: 2026-11-09
- Owner decisions: skip Prompt 1; resume at the same Card after reload (decision 17); mid-step owner request: every book gets its own unit (decision 18, scheduled for Prompt 3, Station 6).
- Produced: Station 2 dead stretch split (Stage 2 and brokers Cards halved, three new Checks: ETFs named, Box 3 tax-free amount, Venture Deals), engine run position plus HYDRATE resume, store saves run, Flip is a real button, Lit result inline, coin bump and floating +1, ring eases in, feedback scrolls into view. RTL bug fixed in Step 8.
- Test change: store.test "the run is not restored" assertion flipped to match decision 17; resume.test.mjs adds 4 tests. No failing test deleted.
- Tests: 62 green.
- Play-test Prompt 2 done (ROLE 3): docs/playtests/prompt2.md. Real clicks, GIF playtest-prompt2-en.gif in Downloads. Resume works, coin +1 float works, RTL fix holds in the page. Two carry-overs to Prompt 3: resume after a correct answer should skip the answered Check; split the 30% ruling Card. Four book-unit content agents running in the background for decision 18.

## Step 7, Prompt 3: remaining stations, reward horizons, Book Units
- Start: 2026-11-09 about 17:00
- Owner decisions: 18 (Book Units for all 28 books), 19 (size cap 400 KB), 20 (Book Unit = badge + 20 XP; Library lights when its Fare passed and the ten Reading Order books are Lit).
- Produced: engine v2 (widgets, tools screen, per-Station XP, Library rule, Milestone, resume skips an answered Check), Stations 3 to 6 content, 30% ruling Card split, Station 1 sliders, habit tracker, decision journal, two checklists with Milestone, shelf with filters and search, 28 Book Units generated from content/books/*.json by scripts/build-books.mjs (validated by scripts/validate-book.mjs), themes per Station, hint ramp (full in Stations 1 to 4 and books, short in 5 and 6).
- Four content agents wrote the Book Units in parallel; all 28 files pass the validator (fairness, parity, two-sentence Cards).
- Play-test Prompt 3 (ROLE 3): docs/playtests/prompt3.md. Two bugs found and fixed with tests: Milestone overlay repeating on UI re-renders; milestone and farePassed not persisted. Chrome screenshot capture failed when scrolled; DOM checks used instead.
- Skipped: the "Done box" per Stage card in Station 2 (reason in the diary). Owner to decide.
- Tests: 338 green. index.html 258 KB.

## Step 7, Prompt 4: cinematic moments
- Start: 2026-11-09
- Produced: three camera moments as CSS keyframes on transform, opacity, filter and background only: cam-intro (first load, wide to close-up with transform-origin on the current node, 750 ms), cam-pullout plus cam-pop (Path after a Station is lit, 700 and 600 ms), cam-dolly plus cam-bg (Milestone overlay with the tools screen scaling and blurring behind, 750 ms). Reduced motion turns them all off (existing global rule).
- Tests: test/cinematic.test.mjs checks durations under 800 ms, allowed properties only, and the reduced-motion rule. 341 green.

## Step 7, Prompt 5: fun first, learning incidental
- Start: 2026-11-09 about 18:30
- Produced: source coverage test (28 books, reading order, checklists verbatim, key numbers, additions cited); missing Stage 4 official-sources Card added (s2c14, ind.nl line corrected per decision F4); Milestone overlay moved outside the blurred container; journal and full shelf removed from Station runs (still under Tools); shelfInTools string.
- Play-test Prompt 5 (ROLE 3): docs/playtests/prompt5.md with the six-line checklist, all yes.
- Tests: 347 green. index.html 258 KB. Chrome screenshot capture timed out on scrolled pages throughout; DOM checks used.

## Step 9: /code-review
- Start: 2026-11-09 about 19:10. Fixed point 2d0c0be (first commit), 21 commits, 60 files. Standards and Spec reviewers running as sub-agents.
