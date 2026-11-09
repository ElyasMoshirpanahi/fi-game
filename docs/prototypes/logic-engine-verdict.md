# Logic prototype verdict: Station, Card, Check, Fare

Date: 2026-11-09. Prototype: `prototypes/logic-engine.html` (one file, double-click to run; pure `Engine` module in `<script id="engine">`, throwaway shell around it). Also kept on branch `prototype/logic-engine`.

## Question

Does the model Station, then Card, then Check, then reward, then next Card, then Fare at Station end, then next Station, feel right once wrong answers, Hints, Returns and the Both Language Mode are pushed through it?

## Verdict: yes, with two fixes made in the model

Eight scenarios were driven in node against the extracted engine (happy path, one miss, two misses, "didn't know" Rating, Fare fail, Fare fail twice, Lit Station replayed, illegal actions). Observations:

| Case | Behaviour | Keep? |
|------|-----------|-------|
| One miss on a Check | Hint shows the source Card in both languages, Check stays, a correct retry still earns the Coin | Keep |
| Two misses | Answer revealed, no Coin, source Card queued as a Return | Keep |
| "Didn't know" Rating | Card and its Checks Return after the queue, before the Fare | Keep |
| Return then correct | Coin awarded then (first correct answer per Check, ever) | Keep |
| Fare | No Hints, one attempt per question, result after all three | Keep |
| Fare fail | Only the missed questions' Cards replay, then a fresh Fare | Keep |
| Fresh Fare, pool of 4+ | Different questions (rotation by Fare size) | Keep |
| Fresh Fare, pool of exactly 3 | Was identical. **Fixed**: rotates by one so order differs | Fixed |
| "Didn't know" then miss twice on its Check | Card queued twice. **Fixed**: Returns dedupe on push | Fixed |
| Lit Station replayed and passed | No new Coins, no new XP, no new Badge | Keep |
| Leave mid-Station | Run discarded (queue, Returns, Fare). Coins, Rings, Lit, XP kept | Keep |
| Illegal actions (answer on Path, flip during Check) | Ignored, state unchanged | Keep |
| Both mode | Flip is a no-op, Card shows EN over FA | Keep |

## Decisions the prototype settled (executor decisions, logged)

- Coins are awarded once per Check, on the first correct answer, including a late one after a Return. Repeat plays never farm Coins.
- The Fare awards XP (50 in the prototype) and the Badge; it awards no Coins.
- Fare questions are drawn from the Station's own Checks, so the fairness rule (answer appeared in an earlier Card) holds for the Fare for free.
- Leaving a Station discards the run. Reload behaves the same.

## Open for Prompt 0

- The Order Check in the prototype accepts the full sequence only. Partial credit is not modelled and is not planned.
- Fare size is 3. Station 3 will have exactly 4 Checks, so rotation gives a different Fare each attempt.
