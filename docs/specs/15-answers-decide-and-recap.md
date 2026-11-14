## Problem Statement

Every Card asks me "Knew it" or "Didn't know". I do not see why: it is one more tap on every Card, and my own guess is a poor measure of what I understood. The game already asks me a question about the Card. A wrong answer there is the honest sign that I did not get it.

And when I finish a book nothing pulls the book together. The last Lesson is just the last Lesson. I want a clear final step that recaps the whole book or Section, and I want it to be obvious that it is there.

## Solution

A Card has one button, Continue. The game decides what I did not understand from my answers: the first wrong answer to a Check sends its Card back to me later in the same Lesson and puts it in Review for the coming days.

Every Section ends with a Recap: a final, clearly marked stop on the Path, after the last Lesson. It asks questions from across the whole Section, the Cards I got wrong first. When I finish the last Lesson, the game points me straight at it.

## User Stories

1. As a player, I want one button on a Card, so that reading is one tap and not a judgement about myself.
2. As a player, I want a wrong answer to count as "did not understand" by itself, so that I never have to rate myself.
3. As a player, I want the Card behind a wrong answer shown to me again later in the same Lesson, so that I get a second look while it is fresh.
4. As a player, I want that Card in my Review on the following days, so that it sticks.
5. As a player, I want this to happen on the first wrong answer, even if I get it right with the Hint, so that a lucky second try does not hide a gap.
6. As a player, I want the end of the Lesson to name those Cards, so that I know what will come back.
7. As a player, I want a Recap at the end of every book, so that the book is pulled together before I move on.
8. As a player, I want a Recap at the end of Basics too, so that every Section ends the same way.
9. As a player, I want the Recap to be a clear, different-looking stop at the end of the Section on the Path, so that I cannot miss it.
10. As a player, I want the Recap to say why it is closed while Lessons remain, so that I know what opens it.
11. As a player who finishes the last Lesson of a Section, I want the next button to be the Recap, so that I am led into it.
12. As a player, I want the Recap to ask first about the Cards I got wrong in that Section, so that it works on my weak spots.
13. As a player with no wrong answers, I want the Recap to ask one question from each Lesson, so that it still covers the whole book.
14. As a player, I want the Recap to be short, so that I finish it in one sitting.
15. As a player, I want to see the right answer when I miss a Recap question, so that I learn from it.
16. As a player, I want a Card I miss in the Recap to go to Review, so that the Recap feeds the same safety net.
17. As a player, I want the Recap to end on a result that says how many I got right, so that I know how well I know the book.
18. As a player, I want a reward for finishing a Recap, once, so that it is worth doing.
19. As a player, I want a finished Recap marked on the Path, so that I can see which books I have closed.
20. As a player, I want to take a Recap again any time, so that I can refresh a book months later.
21. As a player, I want a Recap to count for my streak and my quests like a Lesson, so that it is part of the day.
22. As a player, I want hearts, when they arrive, not to be lost in a Recap, so that recapping stays safe.
23. As a Farsi reader, I want the Recap and its labels in Farsi with Persian digits, so that it is not English-only.
24. As a returning player, I want my progress, Deck and Bookmarks untouched, so that the change costs me nothing.
25. As a player who bookmarked a Card with no question, I want Review to still ask me whether I knew it, so that such a Card can still leave the Deck.

## Implementation Decisions

- Card screen: the two rating buttons are replaced by one Continue button. The reducer keeps accepting the old rating action so that nothing saved or scripted breaks, but the page no longer sends "didn't know".
- First wrong answer: on the first wrong answer to a Check in a Lesson, its Card is queued to Return in this Lesson and enters the Deck as missed. Until now this happened only after the second wrong answer. The Hint and the second try stay as they are.
- A wrong answer in the Fare keeps its current behaviour: the Card enters the Deck and the Fare is redrawn.
- Review keeps "Knew it / Didn't know" only for a Card that has no Check, because there is no answer to judge.
- Recap is a session, not content: it is built by the engine from the loaded Section, so the content files stay untouched (ADR-0005). It reuses the Review screen's question and result flow.
- Recap questions: every Check whose Card is in the Deck as missed for that Section, in Path order, then one Check from each Lesson not yet covered, up to 12 questions.
- A Recap question is asked directly, without showing the Card first: a Recap is retrieval. A wrong answer shows the right answer and puts the Card in the Deck as missed. A right answer does not move a Card on the Review ladder.
- A Recap opens when every Lesson of its Section has a passed Fare. Before that the stop is shown closed with one line saying what opens it.
- Finishing a Recap the first time pays 20 Coins, once per Section, and marks the Section recapped (durable, in the backup, additive). Later runs pay nothing.
- A finished Recap counts the day for the streak and the "finish a Lesson" quest.
- Section lighting, Badges and XP do not change: a Section still lights when its Circles are lit. The Recap is the step after that.
- The onward screen at the end of a Lesson offers the Recap as its main button when that Lesson was the last one needed to open it.
- The app loads a book before its Recap opens, as it does for a Lesson.
- All copy in the i18n table in both languages (ADR-0002).

## Testing Decisions

- A good test sends the actions a tap sends and reads state, events and the markup the player gets.
- Reducer seam: the first wrong answer queues the Return and the Deck entry; a right first answer does not; the Recap is closed until every Fare is passed; its questions put missed Cards first and cover every Lesson; a wrong Recap answer reaches the Deck; the reward is paid once; a save from before this spec loads.
- Render seam: a Card shows one Continue button and no rating; the Path shows the Recap stop closed, open and done; the onward screen leads to the Recap after the last Lesson; EN and FA.
- Browser: the end-to-end video script plays a Section to its Recap at phone width.
- Prior art: `test/engine.test.mjs` (Returns), `test/review.test.mjs` (Deck and ladder), `test/lesson-end.test.mjs`, `test/shell.test.mjs`.

## Out of Scope

- New written Recap Cards or summaries per book (content track). Changing the Review ladder. Changing how a Section lights or what a Badge needs. Hearts (spec 14, release 3).

## Further Notes

Owner request of 2026-11-14. The owner stressed the Recap: it must be the final step of each book or Section and obvious to the player. The glossary gains Recap and changes Rating and Return.
