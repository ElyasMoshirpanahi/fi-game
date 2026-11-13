# Gamification prototype verdict

Date: 2026-11-13. Prototypes: `prototypes/gamification/` (kept on branch `prototype/gamification`, never on `main`), five batches, 16 variants, switchable by `?variant=`. Research: `docs/research/gamification-mechanics.md`.

## Verdict per batch (owner)

| Batch | Question | Verdict |
|---|---|---|
| 1 | What brings me back tomorrow? | A and C: a day streak with a freeze, plus three quests and a chest |
| 2 | What should a wrong answer cost? | A and B: hearts, plus a Combo that pays Coins |
| 3 | What am I building up over weeks? | A and C: levels with titles, plus beat last week's you and records. No shop |
| 4 | How should a Lesson end? | All three in order: scoreboard, then chest, then quiet and onward |
| 5 | What gets the Review done? | First deferred, then settled in the interview below: A, with the promise half of C |

## Where the owner overrode the research

The research note advises against hearts and random chests. The owner chose both and was told why the note objects. The interview that followed kept both and removed the main objections:

- Hearts never block practice. At zero only new Lessons are locked; Review and replay stay open and earn hearts back.
- Chests pay once and cannot be farmed by replay. The Coin range is shown before opening. The rare prize (a shard) depends on a clean Lesson, not on luck.

## Decisions from the interview

Hearts
- Five at most. One returns every 4 hours. A new day refills all five. A finished Review gives one; a replayed old Lesson gives one; Coins buy one.
- A heart is lost only on a wrong answer in a new Lesson or its Fare. Never in Review, never in a replay.
- Out of hearts mid-Lesson: the Lesson pauses and keeps its place.
- No heart is lost during a player's first three Lessons.
- No push notification: a page with no server cannot send one. The game shows a countdown to the next heart. A push server is noted for a later version.

Coins
- Combo pays: each right answer in a row is worth more (1, 1, 2, 2, 3 and so on), plus 10 for a clean Lesson. Paid only the first time a Check is answered right.
- Coins are now spent. One heart costs about what one Lesson earns. A streak freeze costs about what a week of normal play earns. Exact prices are tuned in the build.
- Coins earned before this release become spendable. The Profile shows Coins held and Coins earned in total.

Chests
- Three sizes. Small at the end of each Lesson (first pass only). Medium as a chest stop on the Path when a Circle is finished. Large for the day's three quests.
- A gold chest (clean Lesson) always gives one shard; a plain chest gives none. Five shards make a Path colour. Shards are the only way to get a colour. Four colours to start.
- Circles finished before this release have their Path chest waiting, closed, to be opened once. Past Lessons pay no Lesson chest.

Streak and quests
- One finished Lesson or one finished Review extends the streak. At most two freezes held. A freeze is bought before the missed day and used automatically. A broken streak returns to zero; best streak stays on show. No paid repair afterwards.
- Three quests a day from learning acts only: finish a Lesson, five right in a row, pass a Fare clean, clear today's Review. The Review quest is dealt only when Cards are due. Unfinished quests vanish at the end of the day with no penalty.

The long game
- Seven levels with titles: Saver, Planner, Investor, Owner, Compounder, Allocator, Independent. Each needs more XP than the last. Existing XP places a returning player at the title already earned, with no level-up screens replayed.
- This week against last week, and records, on the Profile and in the desktop Rail. Records: longest Combo, most Lessons in a day, best week, most Review Cards cleared in a week.

Review
- The end of a Lesson names the missed Cards and the day they return.
- On the due day, Continue offers the Review first ("Review 4 Cards, about 2 minutes") and the next Lesson second. No welcome screen, no due marks on Circles.
- A finished Review earns a heart and extends the streak.

Lesson end
- Order: scoreboard, chest, a level-up or streak-milestone screen only if one happened, then the onward screen. One tap passes each.

Sound, motion, saves
- New sounds follow the existing Sound switch. With reduced motion on, chests open without animation and pay the same.
- Streak, hearts, freezes and shards travel in the backup file. At a 7-day streak the game shows the backup and install prompt once.

## Build order

Four releases, each playable on its own. No second prototype: the owner judges each release on the real game before the next starts.

1. Lesson end (scoreboard, chest, onward), Combo pay, Review prompts.
2. Streak, freeze, quests.
3. Hearts.
4. Levels, last week and records, Path chests, Path colours.
