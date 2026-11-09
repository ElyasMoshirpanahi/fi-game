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
