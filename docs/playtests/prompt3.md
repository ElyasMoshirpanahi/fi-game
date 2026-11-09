# Play-test diary: Prompt 3 (all six Stations, rewards on three horizons, Book Units)

Date: 2026-11-09, about 17:40 to 18:30. Chrome over http://localhost:8765/index.html, windows of 662 px and 700 px, dark theme, EN and FA. Mix of real clicks and scripted clicks. GIF: `playtest-prompt3-en.gif` in the browser's Downloads folder (4 frames).

Chrome limitation hit this session: screenshot capture timed out whenever the page was scrolled or the long shelf was open, while the page itself kept responding to script and clicks (verified each time). Visual checks below are from screenshots taken at the top of a screen; everything else was verified by reading the DOM and localStorage.

## Timeline

- 17:42 Fresh storage. Path now shows six live nodes, each with its own theme colour, and a small "Tools" pill under Reality Check, Getting Better, Next 6 Months and Library. Library shows "0/10 books lit" under its label.
- 17:44 Reality Check tools: three sliders. Dragging capital to €250k updated "a year from capital" to €12,500 and "33% of target" without a re-render, and the value was in storage. The same widget appears inside the Station run after the "24k to 40k a year" Card, which is where a stranger first meets it.
- 17:48 Getting Better tools: the five-habit weekly grid and the decision journal. Two cells toggled, journal text typed; both in storage after 400 ms, with a re-read date six months out (2027-05-09).
- 17:52 Next 6 Months tools: both checklists with a progress bar. Ticking the sixth item raised the Milestone overlay ("First €100 of ownership income") and XP jumped by 100. Dismissed it.
- 17:55 Bug 1: the Milestone overlay came back when I opened the Library tools. Cause: UI-only re-renders reused the same state and re-read the same events array. Fixed (events consumed once), tests still green.
- 17:58 Library tools: reading order of 10 with 0 lit, stage and must-read filters, search ("naval" found one book, Stage 5 found 8), 28 book cards with full author attribution and year (for example "Peter Thiel with Blake Masters · 2014"), To-read / Reading / Read chips that persist.
- 18:02 Opened The Psychology of Money from the reading order. Book header with ⭐, author, year, Stage 1. Six Cards of two sentences, four Checks, a Fare of three. Passed it: "Badge: Stay in the game · +20 XP", back on the shelf the card has a gold border and badge, reading order shows 1/10, Library node says "1/10 books lit".
- 18:06 FA mode on the shelf: page mirrors, titles stay Latin and left-to-right inside the right-to-left cards, "why" lines in Farsi from the source.
- 18:10 Bug 2: after a reload the Milestone was gone (XP stayed). Cause: `milestone` and `farePassed` were missing from the store's durable list. Fixed with a regression test; after the fix the Milestone chip shows on the Path after reload.
- 18:20 Opened Venture Deals from the shelf: "Brad Feld and Jason Mendelson · 2011 · Stage 5". Console clean throughout.

## Where I got bored

- Nowhere new. Book Units are six Cards and four Checks, a good rhythm. Station 3 is five true/false in a row; it is short enough that it reads as a quick quiz, not a stretch.

## Where I got confused

- The Fare asks the same questions as the Checks. In a Book Unit with four Checks and a three-question Fare it feels like a repeat. Not unfair, but a stranger notices.
- The Library node cannot be "finished" from its own run: passing its Fare says "Pass the Library fare and light all ten reading-order books". That line explains it, but the node stays unlit for a long time by design.

## Where I got it wrong and whose fault it was

- Three deliberate misses in Station 5 (short hints): the Hint says "Look again at card 2" instead of quoting. Fair, since the Card is two steps back, but less forgiving than Station 1. That is the intended ramp.

## What I enjoyed

- The slider telling me how far from 25x I am. The gold border creeping across the shelf. The Milestone overlay.

## What I remembered five minutes later

Behaviour over formulas (Housel). 70/15/15 after BSN. The four laws of Atomic Habits exist as an order Check. The 25x target as a number I can move with a slider.

## Not built, for the owner to decide

- Prompt 3 asked for a "Done box" on each Stage card in Station 2. Skipped: the Checks after each Stage already mark progress, and a second checkbox would be a second source of truth.
- Camera moments (Prompt 4) not started.

## Verdict (supervisor's view, owner may overrule)

Complete content. Two bugs found and fixed. Ready for Prompt 4 or straight to Prompt 5.

## Fix requests carried forward

- Fare questions could be drawn as paraphrases rather than the identical Checks. Content work, not engine work; proposed for a later iteration.
- Book Unit copy (28 books, EN and FA) still needs the owner's read-through, per grilling decision 2.
