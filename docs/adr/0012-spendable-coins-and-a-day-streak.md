# ADR-0012: Coins can be spent, the Combo pays, and the game has a day streak

Status: accepted (2026-11-13, spec 14, issue #31). Owner verdict on the gamification prototypes: `docs/prototypes/gamification-verdict.md`.

## Decision

- **Coins are a balance.** Until now Coins only went up, and the Combo paid nothing (ADR-0011). Coins now buy hearts and streak freezes, so the state holds two numbers: Coins held and Coins earned in total. A save from before this decision starts with both equal to its Coin count.
- **The Combo pays.** The nth right answer in a row pays `1 + floor((n - 1) / 2)` Coins, up to 5 an answer because the Combo runs on across Lessons. The rule that a Check pays once stays, so the Combo still cannot be farmed by replay.
- **Randomness comes in from outside.** Chest amounts and the daily quest deal are random. The app draws the number and passes it in the action; the reducer stays pure and a test can fix the draw.
- **A day streak exists.** The glossary reserved "streak" for a day count the game did not have. It now has one, extended by one passed Lesson or one finished Review, protected by a freeze bought with Coins.
- **Hearts, against the research.** The research note advises against any penalty for a wrong answer. The owner chose hearts. The rule that makes it acceptable: hearts lock only new Lessons, and Review and replay stay open and earn hearts back.
- **Chests, against the research.** The note advises against random rewards. The owner chose chests. The rules that make it acceptable: a chest pays once, its range is shown before opening, and the rare prize depends on a clean Lesson and not on luck.

## Consequences

- Every place that showed "Coins" must say which number it shows. Spending can never take Coins held below zero, and never changes Coins earned.
- The Combo is still not durable, but what it paid is.
- Hour-based heart refill needs a time from the app, not only a day number. The engine compares what it is sent and never reads the clock.
- If hearts or chests feel wrong on the real game, each is its own reducer slice and can be removed without touching the others.

## Amendment, 2026-11-14

- A finished Recap and a replayed Lesson also count a day for the Streak.
- Freezes are spent only when the Freezes held cover every missed day. Otherwise the Streak ends and the Freezes stay.
- A restored backup is judged against today at once, so a Freeze cannot be bought to repair a Streak that had already ended.
- A Lesson entered part-way (a reload, a bookmark) is never judged clean: its earlier answers are not known.
