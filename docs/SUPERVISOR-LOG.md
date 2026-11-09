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
