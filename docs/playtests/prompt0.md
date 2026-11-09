# Play-test diary: Prompt 0 (core loop, Stations 1 and 2)

Date: 2026-11-09, about 16:00 to 16:25. Played by the supervisor in Chrome over http://localhost:8765/index.html, as a stranger who does not care about finance. Desktop width, then 360 px (body forced to 360 px), dark and light themes, EN, FA and Both. GIF: `playtest-prompt0-en.gif` in the browser's Downloads folder (4 frames only; the recorder captures real clicks and navigations, and most of this run was driven by script, so the next play-test uses real clicks).

## Timeline

- 16:02 EN, dark. Path shows six nodes in a zigzag, two live, four marked "Not started". Clear what to tap: the pulsing node. No reading needed.
- 16:03 Open Reality Check. First Card: one sentence, €40k at 5 to 8 percent is €2 to 3k. Fine. Tapped Knew it.
- 16:03 First Check. Picked the wrong answer on purpose. A Hint appeared quoting the Card in English and Farsi. The Check stayed. Picked right, +1 coin, green bar, chime.
- 16:04 Switched to Both mid-station. Card 3 (world equities 5.2 percent) in English with Farsi beneath in grey. Readable. "Added from research · Source" line is small and honest.
- 16:06 FA mode. Whole page mirrors: toggle, coin pill and progress bars fill from the right, Persian digits in the counters. Opened Knowledge Roadmap. Order Check: tapped the five stages in order, they appeared as numbered chips, Check button enabled only when all five placed. Good interaction, no drag needed.
- 16:08 Back to EN. Core-satellite Check: missed twice on purpose. Second miss revealed "80 percent", the Card was queued to Return. Fair: the Card two steps earlier said 80 percent.
- 16:09 Storage: key is exactly `fi-roadmap-v1`, JSON with v, mode, muted, coins, awarded, rings, lit, xp. Cleared storage, reloaded: the game starts clean, no error.
- 16:10 Light theme, 360 px. No horizontal scroll. Buttons full width, text wraps in three lines on the question. Fine.
- 16:12 Reload mid-station: landed on the Path with coins and the Ring kept (1 of 6), but the Station restarts from Card 1. Expected per ADR-0003, but as a stranger I felt I lost my place in a 13-item Station.
- 16:14 Ran Reality Check to the Fare. Fare 1/3: missed the first question on purpose. No Hint during the Fare, correct. After the third answer: "Not yet. The missed cards come back first." Continue replayed only the €40k Card and its Check, coins unchanged, then Fare 2 started with a different first question.
- 16:16 Passed Fare 2: "Fare passed. Station lit. Badge: 25x rule · +50 XP". Back on the Path the node is gold with a "25x rule" chip, XP bar at 17 percent.
- 16:20 FA mode, Knowledge Roadmap Stage 2 Card: Latin runs break. "(VWCE / IWDA)" renders as "(/ VWCE" on one line and "IWDA)" on the next; "A Random Walk Down Wall Street (Malkiel)" renders as "A Random Walk Down" then "(Malkiel) Wall Street". The isolation wraps Latin words but not their parentheses, and a run that wraps loses its order.
- 16:22 Console: no errors in any mode or theme.

## Where I got bored

- Knowledge Roadmap, Cards 5 to 9: five Stage Cards with only three Checks among them. Stage 2's Card is three sentences with an ETF list, then Stage 4, Box 3 and 30% ruling are three Cards in a row, each four sentences. About 40 seconds of reading with no tap. This is the dead stretch.
- Reality Check Card 4 (25x origin) is two long sentences; Card 6 (brokers) is three.

## Where I got confused

- "Flip" in EN mode is grey text in the middle of the Card. I was not sure it was a button until I hovered.
- The Lit result wraps "Badge:" / "25x rule" / "· +50 XP" onto three lines because the badge name renders as a block.

## Where I got it wrong and whose fault it was

- All seven wrong answers were on purpose. In every case the Hint quoted the source line, and the right answer had appeared in a Card earlier in the same Station. No unfair Check found.
- Not a fairness bug but worth saying: the Fare asks the same questions as the Checks, word for word. A stranger notices.

## What I enjoyed

- The coin pill and chime. The tap-to-place order chips. The gold node and badge chip on the Path after the Fare. The Both mode as a vocabulary tool.

## What I remembered five minutes later

25 times expenses. World stocks about 5 percent real over a century, less since 2000. Ownership builds the pile, investing keeps it. 80 percent index, 20 percent bets. No broker before the BSN.

## Verdict (supervisor's view, owner may overrule)

Technical demo that already feels like a game loop. Not yet fun in Station 2 because of the reading stretch. One real bug (RTL Latin runs). Ready for Prompt 2; Prompt 1 not needed, the look matches ADR-0007.

## Bracketed lists for Prompt 2

Dead stretches:
- s2c3 (Stage 2) three sentences: split into "asset classes" and "core-satellite" Cards, with a Check after each.
- s2c5, s2c6, s2c7 (Stage 4, Box 3, 30% ruling) back to back: add a Check after Box 3 (tax-free amount or deemed return), keep the 30% ruling Check.
- s2c8 and s2c9 (Stage 5, brokers): add a Check after Stage 5 (what is a cap table or a term sheet).
- s1c4 (25x origin) and s2c9 (brokers) over two sentences: split or shorten.

Unfair fails: none.

Bugs:
- FA mode: Latin runs with parentheses split across lines (s2c3, and any Card with "(Author)").
- Lit result: badge name renders block, three-line wrap.
- Flip reads as a label, not a button.
- Feedback bar can sit under the fixed disclaimer on short viewports until focus scrolls it.

Design question for the owner:
- Reload mid-station restarts the Station (run not saved, ADR-0003). Keep, or save the position too?
