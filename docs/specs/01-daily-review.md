## Problem Statement

I finish a Lesson, earn the XP, and never see those Points again. With 2,471 Points across 28 books I forget most of what I learned within weeks, and the Cards I missed or bookmarked have no way back to me.

## Solution

A Review stop on the Path. Every Card I missed (rated "didn't know", had its answer revealed, or missed in a Fare) and every Card I bookmarked joins a review deck. Each day the deck offers the Cards that are due; I answer the Card's Check (or rate it when it has none), and the Card comes back after a growing interval when I get it right, or tomorrow when I get it wrong.

## User Stories

1. As a player, I want missed Cards to join a review deck automatically, so that my weak spots come back without my tracking them.
2. As a player, I want bookmarked Cards in the same deck, so that what I chose to keep is rehearsed too.
3. As a player, I want a Review button on the Path showing how many Cards are due today, so that I know there is something to do.
4. As a player, I want a review session to show the Card, then its Check, so that I am tested, not just re-reading.
5. As a player, I want a Card without a Check to ask "knew it / didn't know", so that every Card can be reviewed.
6. As a player, I want a correct review to push the Card further into the future (1, 3, 7, 16, 35 days), so that I spend time only on what is fading.
7. As a player, I want a wrong review to bring the Card back tomorrow, so that I relearn it quickly.
8. As a player, I want a Card that reaches the last interval and is answered right again to retire, so that the deck does not grow forever.
9. As a player, I want review to work without loading the book file, so that it opens instantly and offline.
10. As a player, I want a session capped at 20 Cards, so that a backlog never feels like homework.
11. As a player, I want one Coin per correct review, so that review is rewarded like a Lesson.
12. As a player, I want removing a bookmark to leave the Card in the deck only if I also missed it, so that the deck reflects my reasons.
13. As a player, I want the deck to survive a reload and a backup, so that my schedule is not lost.
14. As a player, I want the session and its texts in my Language Mode, so that review reads like the rest of the game.
15. As a player, I want an empty deck to say so plainly, so that I am not sent into an empty screen.

## Implementation Decisions

- Glossary gains **Review** (the daily session) and **Deck** (the Cards scheduled for Review). This reverses grilling decisions 10 and 13 (same-session Returns only); recorded as a new owner decision and an ADR.
- Scheduling is a fixed ladder (Leitner-style): intervals of 1, 3, 7, 16, 35 days. FSRS was considered and rejected for now: it needs per-user parameter fitting and an inlined library, for a deck of a few hundred Cards the ladder is adequate and testable.
- The engine stays pure: it never reads the clock. Actions that depend on the date carry `today` (an ISO date string) supplied by the app, the same pattern as the habit tracker's week key. As built: the app sends one `TICK` action with the local day number (an integer) and the engine keeps it as `state.today`, so day arithmetic needs no date parsing in the engine.
- A Deck entry snapshots what Review needs: the Card text, and the Check sourced from that Card when one exists (prompt, options, answer, type), plus `box` and `due`. Snapshots make Review independent of on-demand book loading, as Bookmarks already do.
- New engine actions: enqueue on the existing miss paths and on bookmark; `OPEN_REVIEW`, `REVIEW_ANSWER`, `REVIEW_RATE`, `REVIEW_NEXT`. New events: `review-correct`, `review-wrong`, `review-done`.
- The Deck is a durable field and is part of the stored document.
- Render: a Review button in the Path bar with the due count; a review screen reusing the Card and Check panels.

## Testing Decisions

- Test external behaviour at the engine reducer seam, with content and `today` passed in: enqueue rules, due selection, ladder movement, retirement, session cap, Coins, persistence through the store.
- Prior art: the bookmarks and lessons tests (reducer driven by actions, fake storage), and the render smoke test for the new screen.

## Out of Scope

- FSRS or any adaptive algorithm; notifications or reminders; streaks; reviewing Cards the player never missed or bookmarked.

## Further Notes

Evidence base: practice testing and distributed practice are the two techniques rated high utility in Dunlosky et al. (2013).
