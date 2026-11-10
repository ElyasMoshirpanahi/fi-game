# Accuracy audit of all 28 books

Date: 2026-11-10. Why: a spot-check of 45 Cards in 3 books found 5 bad ones (advice-like or untrue to the book), and the validator only checks shape. Every book was then read in full by one agent following `docs/audit-brief.md`: every Card and Check, in English and Farsi, against the book.

## Method and its limit

Each reader fixed in place and reported every changed id with a reason, plus what it could not verify. **Readers worked from memory of the book, not from the text.** Only the Paul Graham essays had two sources fetched and quotes checked against them. So this audit removes the errors a well-read reviewer catches; it is not a line-by-line check against the books. Items the readers could not confirm are listed in their reports and summarised below as a to-do for a human with the books.

## Scale

About 2,470 Cards and 1,050 Checks read. Roughly 500 items changed (about 1,170 changed text lines, en and fa) across the 28 books. Heaviest: Venture Deals (about 50), A Random Walk Down Wall Street (about 45), The Simple Path to Wealth (about 40), The Psychology of Money (about 35).

## What was wrong, by kind

- **Advice wording**: Cards telling the player to buy, hold or keep a named fund, or what to do at a named broker (b01, b02, b03, b05, b06, b07, b08, b09, b12, b17, b21, b26). All reworded to describe what the book or the roadmap says. `test/advice-lint.test.mjs` now guards the bluntest pattern.
- **Wrong facts and figures**: Monster stock returns and the German tank story (b01); Nomasir's bags of gold (b04); the founders' odds and the Jack and Jill example (b05); the loss-aversion ratio, the filter-rule percentage, chapter numbers and the ten exercises (b06); the bet's nine-year figures and market falls (b12); the shutdown ritual minutes and chapter 2's opening (b24); the Lindy example (b25).
- **Invented quotes or examples**: "nobody plans for mice" (b01); a trapped-employee story and a film credited for F-you money (b02); negotiating styles and a fund-size example (b15); a quote absent from the named essay (b22); several "rule of thumb" numbers.
- **Outside the book**: EU crowdfunding law, the Dutch BV, Pebble, export rules (b15); John Doerr and Google (b27); Dutch workplace and payment-app claims (b03, b24); liquidation preference presented as the book's (b21).
- **Overstatement**: claims made stronger than the author makes them, in most books.
- **Unfair or broken Checks**: a Check asking about a Card that came later (b12); Checks whose source pointed at the wrong Card (b02, b18); ambiguous true/false statements (b09, b21).
- **Farsi**: a phrase that read as "kill yourself" (b28), a phrase that could mean the opposite (b12), "free of charge" for "freely available" (b17), mixed formal and informal address (b15), several mistranslated terms.
- **Player facts**: €40k called a salary; it is capital (b04).

## Still unverified (needs a human with the books)

- Edition questions: Financial Intelligence is dated 2006 but its chapter numbers match the 2013 revised edition; Venture Deals content on SAFEs and corporate VCs exists only in later editions; Common Sense Investing allocation guidance is from the 2017 edition; Random Walk chapter numbers follow the recent 15-chapter editions.
- Specific figures kept from memory: b01 Monster 319,000 percent and 100 terabytes; b02 VTSAX expense ratio and Trinity details; b03 about 330,000 hours; b07 fund-gap figures; b19 37 cents and 21 percent; b20 Dropbox 5,000 to 75,000 and fifty deploys a day; b25 Société Générale figures.
- Replacement Cards written during the audit are themselves from memory (notably in b11, b15, b21, b01, b02).
- Fairness of the Farsi text is not machine-checked.

## Guard rails added

`test/advice-lint.test.mjs`; `docs/audit-brief.md`; the content brief now forbids instructing the player on named products; top-level `why` lines stay verbatim from the owner's source (one reader changed b03's and it was restored).
