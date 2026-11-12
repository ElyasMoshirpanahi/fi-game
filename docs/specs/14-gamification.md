## Problem Statement

I finish a Lesson and nothing asks me to come back. The game counts XP on one long bar, counts Coins that buy nothing, shows a Combo that pays nothing, and ends every Lesson on the same one-line screen. Review, the part that makes the learning stick, waits behind a button I have to remember. There is no reason to open the game on a given day and no sense of building something over weeks.

## Solution

A small set of game mechanics, chosen by me from prototypes I have played, that give me a reason to return, make the end of a Lesson a moment, give Coins a use, and put due Review Cards in front of me when I open the game. Every mechanic works for one player with no account and no server, and none of them punishes me for learning.

This spec is a draft. The Implementation Decisions marked OPEN wait on my verdict per prototype batch. Nothing here is ready to build until those are filled in.

## User Stories

1. As a player, I want a reason to open the game today, so that learning becomes a habit and not a mood.
2. As a player, I want a missed day not to wipe out what I built, so that one bad day does not make me quit.
3. As a player, I want the daily ask to be small enough to do on a tired day, so that I keep the habit.
4. As a player, I want to see my week at a glance, so that I know how regular I have been.
5. As a player, I want due Review Cards put in front of me when I open the game, so that I do not have to remember them.
6. As a player, I want to be told how long a Review will take, so that I start it.
7. As a player, I want the end of a Lesson to tell me which Cards I missed and when they return, so that the game's promise is clear.
8. As a player, I want the end of a Lesson to feel like an end, so that finishing is satisfying.
9. As a player, I want the next Lesson one tap away from the end of the last, so that momentum carries me.
10. As a player, I want Coins to buy something I value, so that earning them means something.
11. As a player, I want to know what a wrong answer costs before I answer, so that the rule feels fair.
12. As a player, I want a wrong answer never to lock me out of learning, so that mistakes stay safe.
13. As a player, I want something that grows over weeks, so that I can see I am further than a month ago.
14. As a player, I want to compete with my own past and not with strangers, so that a solo game still has a race.
15. As a player, I want to see how far I am from the next Badge, so that the last Lessons of a book pull me in.
16. As a player, I want every count shown to be true, so that I can trust the game.
17. As a player, I want no reward that depends on luck unless I chose it, so that the game does not feel like a slot machine.
18. As a player who prefers reduced motion, I want every celebration to work without movement, so that my setting is respected.
19. As a Farsi reader, I want every new label and number in Farsi with Persian digits, so that the mechanics are not English-only.
20. As a returning player, I want my existing XP, Coins, Lit Stations and Deck untouched, so that new mechanics cost me nothing.
21. As a player who restores a backup, I want the new counters restored with it, so that a new phone does not reset my habit.
22. As the owner, I want each mechanic to be removable on its own, so that one that does not work can go without unpicking the rest.

## Implementation Decisions

Settled by the research (`docs/research/gamification-mechanics.md`) and the platform:

- No scheduled reminders. A page with no server cannot send one: Notification Triggers ended, and Periodic Background Sync exists only in installed Chrome and Edge. Every prompt is on screen when the game is opened.
- No hearts or lives, no leaderboard or invented opponents, no un-lighting of a Lit Station, and Hints are not sold for Coins. The research found each of these backfires or has evidence against it. Hearts stay in the prototypes only so the owner can feel why.
- All new state is durable under the single storage key (ADR-0003), validated by shape like every other durable field, included in backup and restore, and additive: a save from before this spec loads unchanged.
- The engine never reads the clock (existing rule). Anything counted in days uses the day number the app already sends.
- Each mechanic is its own reducer slice and its own events; render and fx react to events as they do for Combo (ADR-0011).
- All copy goes in the i18n table in both languages (ADR-0002).

OPEN, one per prototype batch in `prototypes/gamification/` on branch `prototype/gamification`:

- Batch 1, daily return: streak with a freeze (A), a daily goal ring (B), quests (C), or a weekly rhythm (D). The research favours a streak that is easy to extend and repairable, and suggests the weekly count fits the 1, 3, 7, 16, 35 day Review ladder. A day streak changes the glossary, which today says the game has none.
- Batch 2, the cost of a wrong answer: keep no penalty and let the Combo pay (B), or add a star grade (C). No primary evidence either way.
- Batch 3, the long game: levels with titles (A), a use for Coins (B, limited to a streak freeze and looks), or personal bests against last week (C). Spending Coins changes the glossary rule that Coins never decrease.
- Batch 4, the end of a Lesson: scoreboard (A), chest (B, advised against), or a quiet screen that names missed Cards and leads on (C).
- Batch 5, getting the Review done: Continue offers Review first (A), due marks on Circles (B), or a promise at the end of a Lesson and a welcome on the due day (C).

Known risk to settle with the verdicts: Safari deletes a site's local storage after seven days of browser use without a visit, unless the game is installed to the home screen. A streak raises the cost of that loss. The backup reminder and the install prompt should be reviewed together with whichever return mechanic is chosen.

## Testing Decisions

- A good test drives the reducer with the actions a player's taps and the passing of days produce, and asserts on state and events, never on how a counter is stored.
- Seam one, the reducer: days are moved with the existing day-number action, so a week can be played in a test without a clock. Each chosen mechanic gets its rules tested there, including the awkward cases the prototypes expose (a missed day with and without a freeze, a week that falls one day short, a reward claimed twice).
- Seam two, the store: a save from before this spec loads; a backup round-trips the new fields; a damaged or hostile value for a new field is refused.
- Seam three, the render output: the chosen screens render in EN and FA, and nothing shows a count the state does not hold.
- Prior art: `test/review.test.mjs` (days moved by TICK, a ladder of intervals), `test/backup.test.mjs` (shape rules), `test/neon.test.mjs` (Combo as state plus an event), `test/shell.test.mjs`.

## Out of Scope

- Accounts, sync, friends, leaderboards, push notifications. Real-money purchases. New Lessons or Cards (content is a separate track). Changing the Review ladder.

## Further Notes

Owner request of 2026-11-13: research gamification, prototype it in batches, and choose by feel. The prototypes are throwaway and in-memory; each variant states its risk and the evidence for it beside the phone. Verdicts are recorded in `docs/prototypes/gamification-verdict.md` once given, and this spec is then completed and relabelled ready.
