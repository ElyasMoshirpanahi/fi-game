## Problem Statement

I finish a Lesson and nothing asks me to come back. The game counts XP on one long bar, counts Coins that buy nothing, shows a Combo that pays nothing, and ends every Lesson on the same one-line screen. Review, the part that makes the learning stick, waits behind a button I have to remember. There is no reason to open the game on a given day and no sense of building something over weeks.

## Solution

A set of game mechanics I chose by playing prototypes: a Lesson that ends on a scoreboard, a chest and a push onward; a Combo that pays Coins; a day streak with a freeze; three quests a day; hearts; levels with titles; a race against my own last week; and a Continue button that offers the due Review first. Every mechanic works for one player with no account and no server.

The verdicts and the interview behind every decision here are in `docs/prototypes/gamification-verdict.md`. The research is in `docs/research/gamification-mechanics.md`. Where I overrode the research (hearts, chests), the verdict file says how the objection was answered.

It ships as four releases. Each is playable on its own and I judge it on the real game before the next starts.

## User Stories

1. As a player, I want a reason to open the game today, so that learning becomes a habit and not a mood.
2. As a player, I want a missed day covered by a freeze I bought, so that one bad day does not wipe out my streak.
3. As a player, I want one Lesson or one Review to be enough to keep my streak, so that I can keep it on a tired day.
4. As a player, I want three small quests a day and a chest for doing all three, so that each day has a shape.
5. As a player, I want due Review Cards offered first when I tap Continue, so that I do not have to remember them.
6. As a player, I want to be told how long a Review will take, so that I start it.
7. As a player, I want the end of a Lesson to name the Cards I missed and the day they return, so that the game's promise is clear.
8. As a player, I want the end of a Lesson to show my numbers one at a time, so that finishing feels like an end.
9. As a player, I want a chest after a Lesson, and a gold one for a clean Lesson, so that playing carefully pays.
10. As a player, I want to see the range a chest can pay before I open it, so that the surprise is fair.
11. As a player, I want the next Lesson one tap away from the end of the last, so that momentum carries me.
12. As a player, I want right answers in a row to pay more Coins, so that the Combo means something.
13. As a player, I want Coins to buy hearts and streak freezes, so that earning them has a use.
14. As a player, I want a wrong answer in a new Lesson to cost a heart, so that I read the question with care.
15. As a player with no hearts, I want Review and replay to stay open and to earn hearts back, so that I am never locked out of learning.
16. As a player with no hearts, I want to see when the next heart returns, so that I know when I can go on.
17. As a new player, I want my first three Lessons to cost no hearts, so that I learn the game before it can stop me.
18. As a player stopped mid-Lesson, I want to resume at the same question, so that I am not punished twice.
19. As a player, I want a title that grows with my XP, so that I can see I am further than a month ago.
20. As a player, I want to race my own last week and keep records, so that a solo game still has a race.
21. As a player, I want chest stops on the Path, so that I can see a reward ahead of me.
22. As a player, I want shards from clean Lessons to make Path colours, so that skill buys the look of my road.
23. As a player, I want every count shown to be true, so that I can trust the game.
24. As a player who prefers reduced motion, I want every celebration to work without movement, so that my setting is respected.
25. As a player with sound off, I want the new sounds silent, so that my setting is respected.
26. As a Farsi reader, I want every new label and number in Farsi with Persian digits, so that the mechanics are not English-only.
27. As a returning player, I want my existing XP, Coins, Lit Stations and Deck untouched, so that new mechanics cost me nothing.
28. As a returning player, I want the Coins I already earned to be spendable, so that my past play counts.
29. As a player who restores a backup, I want streak, hearts, freezes and shards restored with it, so that a new phone does not reset my habit.
30. As the owner, I want each mechanic to be removable on its own, so that one that does not work can go without unpicking the rest.

## Implementation Decisions

Rules that hold for every release:

- No scheduled reminders. A page with no server cannot send one. Every prompt is on screen when the game is open. A push server is a possible later version and is not designed here.
- No leaderboard or invented opponents, no un-lighting of a Lit Station, and Hints are not sold for Coins.
- All new state is durable under the single storage key (ADR-0003), validated by shape like every other durable field, included in backup and restore, and additive: a save from before this spec loads unchanged.
- The engine never reads the clock. Days use the day number the app already sends. Heart refill by the hour needs the app to send a time with its tick; the engine stores and compares only what it is sent.
- Each mechanic is its own reducer slice and its own events; render and fx react to events as they do for Combo (ADR-0011).
- All copy goes in the i18n table in both languages (ADR-0002).
- A reward is paid once. Replaying a Lesson pays no Coins, no chest and no shard.
- Coins become a balance that can go down. The state holds Coins held and Coins earned in total; a save from before this spec starts with both equal to its Coin count. ADR-0012 records this and the day streak; the glossary is amended.

### Release 1: Lesson end, Combo pay, Review prompts

- Combo pay: the nth right answer in a row pays `1 + floor((n - 1) / 2)` Coins (1, 1, 2, 2, 3 and so on), in place of the flat one Coin, and only the first time that Check is answered right. The Combo runs on across Lessons, so the pay stops at 5 Coins an answer. A Lesson passed with no wrong answer pays 10 more, once.
- The engine records a summary of the Lesson just passed: Checks right first time out of the total, best Combo inside the Lesson, time taken, XP and Coins earned, and the Cards missed. Time comes from times the app sends, not from the engine.
- Lesson end is a sequence of screens, each passed with one tap:
  1. Scoreboard: accuracy, time, best Combo, earned, revealed one tap at a time, then one line that names what was good about the run.
  2. Chest: gold for a clean Lesson, plain otherwise. The Coin range is shown before opening (gold 15 to 40, plain 5 to 18; tuned in the build). A gold chest always gives one shard. A plain chest gives none. Shards are counted from this release and spent in release 4.
  3. Onward: the player's place in the Circle, the missed Cards by name with the day they return, and a button that starts the next Lesson directly. A second button returns to the Path.
- The chest amount is random inside the shown range. The random draw is passed into the engine by the app so the reducer stays pure and testable.
- A replayed Lesson ends on the onward screen only.
- A chest won and not opened is never lost: leaving the screen or reloading pays its low end and its shard.
- Review prompt: when Cards are due, Continue becomes two buttons, the Review first with its Card count and an estimate in minutes, the next Lesson second. Nothing else on the Path changes.
- New sounds for Coins, chest and shard, owned by fx, silent when muted. Under reduced motion the chest opens with no animation.

### Release 2: Streak, freeze, quests

- Day streak: a day counts when one Lesson is passed or one Review is finished. The streak and the best streak are durable.
- Freeze: bought with Coins, at most two held, used automatically on a missed day. A missed day with no freeze sets the streak to zero. No paid repair afterwards.
- Price: a freeze costs about what a week of normal play earns. Tuned in the build.
- Quests: three a day, dealt from learning acts only (finish a Lesson, five right in a row, pass a Fare clean, clear today's Review). The Review quest is dealt only when Cards are due. Unfinished quests vanish at the day change with no penalty. All three done opens the large chest, once.
- The deal is random; the draw is passed in by the app.
- The streak shows in the header and on the Profile, with the last seven days. Quests show on the Path below Continue, so Continue stays the first tap, and in the desktop Rail. On a phone the header drops the XP number to make room; the XP bar stays.
- When the player returns after missed days, the Path says once whether a freeze saved the streak or the streak ended.
- At a 7-day streak the game shows the backup and install prompt once.
- A streak screen joins the Lesson-end sequence after the chest on the first Lesson of each day, when the streak grows. Days 7, 14, 30, 50, 100, 200 and 365 get their own line. A replayed Lesson counts for the streak.
- Quest needs: one Lesson, 5 right in a row, a Fare passed at the first try, 8 right answers, one Lesson with no wrong answer, today's Review. The chest pays 30 to 60 Coins. A quest chest earned and not opened is paid at its low end at the day change.
- Price of a freeze: 250 Coins.

### Release 3: Hearts

- Five hearts at most. A wrong answer in a new Lesson or its Fare costs one. Review and replay never cost a heart.
- No heart is lost during the player's first three Lessons.
- At zero hearts new Lessons are locked. A Lesson in progress pauses and keeps its place.
- Hearts return: one every 4 hours, all five at the day change, one for a finished Review, one for a replayed old Lesson, and one bought with Coins at about the price of one Lesson's earnings.
- The out-of-hearts screen shows the countdown to the next heart and the three ways to get one now.
- Scoreboard gains "hearts left".

### Release 4: Levels, last week, records, Path chests, colours

- Seven levels with titles: Saver, Planner, Investor, Owner, Compounder, Allocator, Independent. Each needs more XP than the last. The level is derived from XP, never stored, so a returning player is placed at once and no level-up screen is replayed.
- A level-up screen joins the Lesson-end sequence when a Lesson crosses a threshold.
- This week against last week by XP at the same weekday, on the Profile and in the desktop Rail.
- Records: longest Combo, most Lessons in a day, best week, most Review Cards cleared in a week.
- Path chest stops: a medium chest after each Circle, opened once when the Circle is finished. Circles finished before this release have their chest waiting.
- Path colours: five shards make one colour. Four colours to start. Shards are the only way to get one. The chosen colour is durable.

## Testing Decisions

- A good test drives the reducer with the actions a player's taps and the passing of days produce, and asserts on state and events, never on how a counter is stored.
- Seam one, the reducer: days are moved with the existing day-number action, so a week can be played in a test without a clock. Each mechanic's rules are tested there, including the awkward cases: a Check answered right a second time, a replayed Lesson, a clean Lesson against one with a miss, a chest claimed twice, a missed day with and without a freeze, hearts at zero mid-Lesson, a returning player's XP mapped to a level.
- Seam two, the store: a save from before this spec loads; a backup round-trips the new fields; a damaged or hostile value for a new field is refused.
- Seam three, the render output: the new screens render in EN and FA, and nothing shows a count the state does not hold.
- A headless browser pass at phone and desktop width for each release, as `scripts/playtest/shell-pass.mjs` does for the shell.
- Prior art: `test/review.test.mjs` (days moved by TICK, a ladder of intervals), `test/backup.test.mjs` (shape rules), `test/neon.test.mjs` (Combo as state plus an event), `test/shell.test.mjs`.

## Out of Scope

- Accounts, sync, friends, leaderboards. Push notifications and any server (noted for a later version). Real-money purchases. A shop beyond hearts and freezes. New Lessons or Cards (content is a separate track). Changing the Review ladder. Due marks on Circles and a welcome screen on the due day (batch 5, B and C, not chosen).

## Further Notes

Owner request of 2026-11-13: research gamification, prototype it in batches, and choose by feel. The prototypes are throwaway and stay on branch `prototype/gamification`.

Known risk: Safari deletes a site's local storage after seven days of browser use without a visit, unless the game is installed to the home screen. A streak raises the cost of that loss, which is why the backup and install prompt is tied to the 7-day streak in release 2.

The research found no primary evidence for or against chests and Combo bonuses, and evidence against hearts. Each release is judged by the owner on the real game; a mechanic that feels wrong is removed on its own.
