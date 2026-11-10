# Spec 6: verification of figures, quotes and editions

Date: 2026-11-11. The accuracy audit read every Card from memory of the books. This pass checked the Cards that carry a specific figure or a quotation against sources opened on the web, and established which edition each book's Lessons follow. One reader per book, following `docs/verification-brief.md`. The per-book records are `docs/verification/bNN.json`. A second reader then re-opened a sample of the sources; its findings are at the end.

## What was checked

`docs/verification/listed.json` froze the list before the pass: every Card whose English text holds a digit (chapter numbers aside) or a quotation of twelve characters or more. 458 Cards in 28 books. Readers added rows for other Cards they changed while reading sources: 470 rows in all. Rows are per Card; a Check reworded to match its Card has no row of its own.

## Result

Each row has a verdict and a `basis`: how the reader saw the evidence, and so how the row can be re-checked.

| Verdict | Rows | author or publisher | secondary source | copy not linked | no source |
| --- | --- | --- | --- | --- | --- |
| verified: a source confirms the figure or wording | 356 | 155 | 78 | 123 | |
| corrected: a source showed the Card was wrong; fixed in both languages | 33 | 10 | 11 | 12 | |
| softened: nothing confirmed the specific claim; the Card now says only what is certain | 20 | 6 | 10 | | 4 |
| own: the figure is the roadmap's or the game's own, not a claim about the book | 61 | 16 | 12 | 12 | 21 |

50 Cards and 14 Checks changed. Nothing else in the book files changed except the new `edition` field: ids, answers, order and top-level fields are as they were (checked against the committed files).

## How to read "verified"

- **Author or publisher (155 verified rows).** The author's site, letters or essays, the publisher's edition or excerpt. Berkshire's letters (b12, all 49), Paul Graham's essays (b22), Collins's own posts (b02), Vicki Robin's republished chapters (b03), James Clear's site (b23), the Stripe Press edition (b26). These can be re-checked by opening the link.
- **Secondary source (78).** A review, an interview, a reader's notes, a summary site, a catalogue contents page, an encyclopedia. The book passage itself was often not opened; the row's note says so. For b09 and most of b07 no page of the book could be opened.
- **Copy not linked (123).** The reader saw the passage in a full-text copy of the book that is not an authorised source (b01, b05, b13, b15, b16, b19, b20, b24, and four rows in b07). Those copies are not linked from this repository: the row's link is the book's catalogue entry and its note quotes what was read. **These rows cannot be re-checked from the record; that needs the book.** All of b15's rows are of this kind, its nine corrections included.

## Corrections worth knowing

- **Venture Deals (b15), 9 rows.** The worked examples for liquidation preference and for price with an option pool had the wrong numbers; the management fee range was off.
- **The Little Book of Common Sense Investing (b07), 5 rows.** The index beat the average fund by more than two points a year (sources give 2.3 and 2.5); a fund-survival Card had the wrong span.
- **The Four Pillars of Investing (b08), 4 rows.** A return series starts in 1900, not 1926; stocks "barely kept up with" inflation from 1966 to 1982, they did not lag it.
- **Angel (b21), 3 rows.** The book's spread is fifty startups over three years, not "at least 30".
- **Poor Charlie's Almanack (b26).** Munger's baskets are "yes, no, and too tough to understand", not "in, out". Two sayings absent from the edition checked now read "widely attributed".
- **A Random Walk Down Wall Street (b06).** Japanese shares at more than 60 times earnings and Polaroid at over 90, not "about"; an unconfirmed barter detail and two unconfirmed figures removed.
- **The Hard Thing About Hard Things (b18).** In a one-on-one the manager does 10 percent of the talking; the Card had turned that into the employee doing 90 percent.
- **The Lean Startup (b20).** About fifty changes a day on average, not "as often as fifty times a day".
- **Antifragile (b25).** Rubin's pay was more than $120 million, not $100 million.
- **Atomic Habits (b23).** "As many as" one in five soldiers, not "about".
- **Zero to One (b19).** The question is about a valuable company, not a "valuable thing".

The open items of the first audit all closed: Monster Beverage's 319,000 percent and the 100 terabyte drives (b01), the VTSAX ratio and the Trinity details (b02), 329,601 hours (b03, now stated exactly), the fund-gap figures (b07), 37 cents and 21 percent (b19), Dropbox's 5,000 to 75,000 (b20), the Société Générale figures (b25).

## Editions

Every book file now carries `edition`, shown in the open book Section. Nine books need the owner's eye: eight are dated by first publication but taught from a later text, and one draws partly on a later edition. The `year` field was left unchanged in all of them; that is the owner's call.

| Book | `year` | Lessons follow | Note |
| --- | --- | --- | --- |
| b04 The Richest Man in Babylon | 1926 | later collected text (as in the 1955 edition) | one Lesson uses a tale with letters dated 1934 and 1936 |
| b06 A Random Walk Down Wall Street | 1973 | 13th edition, 2023 | two Cards (`b06c1l3p7`, `b06c1l3p13`) come from sections absent from that edition's contents |
| b10 Financial Intelligence | 2006 | revised edition, 2013 | |
| b12 Buffett's letters | 1977 | letters 1977 to 2022 | |
| b13 The Intelligent Investor | 1949 | 4th revised edition, 1973 | |
| b15 Venture Deals | 2011 | 3rd edition, 2016 | the Crowdfunding and SAFE Lessons exist only in later editions |
| b22 Paul Graham's essays | 2001 | essays of 2005 to 2023 | no essay used dates from 2001 |
| b26 Poor Charlie's Almanack | 2005 | abridged Stripe Press edition, 2023 | two sayings may exist only in the unabridged edition |
| b27 High Output Management | 1983 | 2nd Vintage edition, 1995 | one Card rests on a 1984 article |
| b07 Common Sense Investing | 2007 | 1st edition, 2007 (year is right) | Lesson `b07c3l3` rests partly on allocation chapters that exist only in the 2017 edition |

## Second reader's spot-check

A separate reader re-opened the sources of 36 rows in 17 books (14 of them corrections), skipping rows whose copy is not linked.

| Outcome | Rows |
| --- | --- |
| The source shows what the row says | 25 |
| Weak: the page repeats the claim without the passage (a summary or a reader's notes) | 5 |
| The source does not show what the note claims | 2 |
| The source is right but the Card still said something else | 2 |
| Could not be opened (rows of b15, copy not linked) | 2 |

What was done with it:

- `b07c1l2p8`: the "two and a half points" correction mixed two pages. The Card and its Check now say "more than two points", which both sources support.
- `b06c1l3p6` and `b18c2l3p2`: the Cards went beyond their sources and now follow them.
- `b06c1l2p3`: a barter detail was still stated on one summary site; removed.
- `b09c1l1p6`: the cited page does not show the "15 percent" or Tony Robbins; the note names a second page for them that the second reader did not open. Left as it is, basis secondary.
- 40 rows marked "verified" whose figure is the roadmap's own are now marked "own"; `b03c1l1p4` is "corrected", not "softened".
- Every row carries `basis`, and the test no longer accepts a catalogue link as a source that was opened.
- The Farsi of the 14 sampled corrections matches the English, with Persian digits.

Extrapolating the sample: of rows that can be opened, about seven in ten show the claim plainly, and most of the rest are honest but thin.

## Limits

- **Only the listed Cards were checked.** About 2,000 Cards carry no figure or quotation and were not re-read. Readers who strayed found errors there (four in b26 alone), so more remain.
- **123 verified rows and 12 corrections rest on copies that are not linked** and cannot be re-checked from the record.
- **Replacement Cards written from memory in the first audit** (notably b11, b15, b21, b01, b02) were checked only where they were on the list.
- **No reader had the printed books.** Chapter numbers often rest on the contents page of one edition.
- **A correction to a book reaches an installed game one visit late**: books are served from the device first and refreshed in the background (spec 5).
- Farsi wording of corrected Cards was written by the same reader; only the sampled 14 were read by a second.
