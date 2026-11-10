# Spec 6: verification of figures, quotes and editions

Date: 2026-11-11. The accuracy audit read every Card from memory of the books. This pass checked the Cards that carry a specific figure or a quotation against sources opened on the web, and established which edition each book's Lessons follow. One reader per book, following `docs/verification-brief.md`. The per-book records are `docs/verification/bNN.json`.

## What was checked

`docs/verification/listed.json` froze the list before the pass: every Card whose English text holds a digit (chapter numbers aside) or a quotation of twelve characters or more. 458 Cards in 28 books. Readers added rows for other things they changed while reading sources: 470 rows in all.

## Result

| Verdict | Rows | Meaning |
| --- | --- | --- |
| verified | 398 | a source confirms the figure or wording |
| corrected | 30 | a source showed the Card was wrong; fixed in both languages |
| softened | 21 | no source confirmed the specific figure or wording; the Card now says only what is certain |
| own | 21 | the figure is the roadmap's or the game's own (the €40k, the 25 times target, arithmetic), not a claim about the book |

46 Cards and 13 Checks changed. Nothing else in the book files changed except the new `edition` field: ids, answers, order and top-level fields are as they were (checked against the committed files).

## Corrections worth knowing

- **Venture Deals (b15), 9 rows.** The worked examples for liquidation preference and for price with an option pool had the wrong numbers; the management fee range was off.
- **The Little Book of Common Sense Investing (b07), 5 rows.** The index fund's lead is about two and a half points, not two; a fund-survival Card had the wrong span.
- **The Four Pillars of Investing (b08), 4 rows.** A return series starts in 1900, not 1926; stocks "barely kept up with" inflation from 1966 to 1982, they did not lag it.
- **Angel (b21), 3 rows.** The book's spread is fifty startups over three years, not "at least 30".
- **Poor Charlie's Almanack (b26).** Munger's baskets are "yes, no, and too tough to understand", not "in, out". Two sayings absent from the edition checked now read "widely attributed".
- **The Lean Startup (b20).** About fifty changes a day on average, not "as often as fifty times a day".
- **Antifragile (b25).** Rubin's pay was more than $120 million, not $100 million.
- **Atomic Habits (b23).** "As many as" one in five soldiers, not "about".
- **Zero to One (b19).** The question is about a valuable company, not a "valuable thing".

The open items of the first audit all closed: Monster Beverage's 319,000 percent and the 100 terabyte drives (b01), the VTSAX ratio and the Trinity details (b02), 329,601 hours (b03, now stated exactly), the fund-gap figures (b07), 37 cents and 21 percent (b19), Dropbox's 5,000 to 75,000 (b20), the Société Générale figures (b25).

## How strong the sources are

This is the part to read before trusting the word "verified".

- **175 rows cite the author or the publisher**: Berkshire's letters (b12, all 49), Paul Graham's essays (b22), Collins's own posts (b02), Vicki Robin's republished chapters (b03), James Clear's site (b23), the Stripe Press edition (b26), publisher excerpts.
- **123 rows cite a secondary source**: a review, an interview, a reader's notes, a summary site, a catalogue contents page. For b08, b09 and most of b07 the book text could not be opened at all.
- **147 rows were read in a full-text copy of the book that is not an authorised source** (b01, b05, b13, b15, b16, b19, b20, b24, and a few in b07 and b08). Those copies are not linked from this repository. The verdict stands, the row's link is the book's catalogue entry, and its note says so. Anyone who wants to re-check those rows needs the book.

## Editions

Every book file now carries `edition`, shown in the open book Section. Eight books are dated by first publication but taught from a later text. The `year` field was left unchanged in all of them; that is the owner's call.

| Book | `year` | Lessons follow | Note |
| --- | --- | --- | --- |
| b04 The Richest Man in Babylon | 1926 | later collected text (as in the 1955 edition) | one Lesson uses a tale with letters dated 1934 and 1936 |
| b06 A Random Walk Down Wall Street | 1973 | 13th edition, 2023 | two Cards (`b06c1l3p7`, `b06c1l3p13`) come from sections absent from that edition's contents |
| b07 Common Sense Investing | 2007 | 1st edition, 2007 | Lesson `b07c3l3` rests partly on allocation chapters that exist only in the 2017 edition |
| b10 Financial Intelligence | 2006 | revised edition, 2013 | |
| b12 Buffett's letters | 1977 | letters 1977 to 2022 | |
| b13 The Intelligent Investor | 1949 | 4th revised edition, 1973 | |
| b15 Venture Deals | 2011 | 3rd edition, 2016 | the Crowdfunding and SAFE Lessons exist only in later editions |
| b22 Paul Graham's essays | 2001 | essays of 2005 to 2023 | no essay used dates from 2001 |
| b27 High Output Management | 1983 | 2nd Vintage edition, 1995 | one Card rests on a 1984 article |

## Limits

- **Only the listed Cards were checked.** About 2,000 Cards carry no figure or quotation and were not re-read. Readers who strayed found errors there (four in b26 alone), so more remain.
- **Replacement Cards written from memory in the first audit** (notably b11, b15, b21, b01, b02) were checked only where they were on the list.
- **No reader had the printed books.** Chapter numbers often rest on contents pages of one edition.
- **A reader's "verified" is one reader's judgement.** A sample was re-opened by a second reader; see the code review record.
- Farsi wording of corrected Cards was written by the same reader and not separately reviewed.
