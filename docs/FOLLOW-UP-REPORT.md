# Follow-up report: seven specs and the neon overhaul

Date: 2026-11-11. This closes the owner's request to turn the seven next steps into specs and build each one in order, plus the cyberpunk overhaul asked for on Telegram part-way through. Each piece went the same way: a spec published as an issue, tests first, a headless browser check with a recording sent on Telegram, a two-axis review by a separate agent, its findings fixed, a pull request, a merge, and a check of the live site.

Live: https://elyasmoshirpanahi.github.io/fi-game/

## What shipped

| Spec | Issue | Pull request | What the player gets |
| --- | --- | --- | --- |
| 1 Daily Review | #8 | #15 | Missed and bookmarked Cards come back after 1, 3, 7, 16 and 35 days, at most 20 a day |
| 2 Backup and restore | #9 | #17 | Progress saved to a dated file and restored from a file or pasted text |
| 8 Neon overhaul | #16 | #18 | One dark neon theme, a circuit-trace road, a Combo counter, effects on every move |
| 3 Check wording | #10 | #19 | The Fare asks every Check in other words; option length no longer points at the answer |
| 4 Notes | #11 | #20 | A page of the player's own notes per book, with a count against one page |
| 5 Install and offline | #12 | #21 | The game opens with no connection, keeps books on the device, installs to the home screen |
| 6 Verification | #13 | #22 | Figures and quotes checked against sources; every book names its edition |
| 7 Continue, search, phone pass | #14 | #23 | One tap to the next Lesson, search in two languages, every screen checked at 360 px |

Tests grew from 221 to 464. Every review record is in `docs/review/`.

## What the reviews caught before it shipped

The reviews were not a formality. The ones that mattered most:

- **A damaged backup could break the game for good**, and a shared backup could inject script (spec 2). Every saved value now has a shape rule.
- **A note's date could carry script through a crafted backup** (spec 4).
- **A full device turned good online responses into errors** (spec 5). The service worker was rewritten around one rule: a cache failure never changes what the network returned.
- **The first fix for answer length only moved the giveaway** to the middle-length option, and Farsi was never measured (spec 3). The rule was replaced and a second content pass run.
- **A Review Coin could be farmed** by bookmarking and unbookmarking (spec 1).
- **Continue was scrolled off the screen** on every load at phone size (spec 7).

## Numbers worth keeping

- **Check wording:** 1,065 Checks have a second wording. Over 566 tap Checks the correct option is the longest, the shortest or neither about a third each, in English and in Farsi.
- **Verification:** of 470 rows, 356 verified, 33 corrected, 20 softened, 61 the roadmap's own figures. Of the verified rows 155 cite the author or publisher, 78 a secondary source, and 123 were read in copies of the books that are not linked, so they cannot be re-checked from the record.
- **Phone pass:** 21 screens at 360 by 740, none overflowing, every control at least 44 px except the habit day cells (44 tall, about 38 wide).

## Owner decisions taken along the way

- 40: the Review cap is per day; a Review Coin is paid once per Card and step.
- 41: the cyberpunk look; the light theme is gone.
- 42 and 43: nine books taught from a later edition show that edition's year. For the Buffett letters and the Paul Graham essays the year is the latest one the Lessons draw on (2022, 2023).

## What is not done, and what is not known

- **About 2,000 Cards with no figure or quotation were not re-read** in the verification pass. Readers who strayed into them found errors, so more remain.
- **123 verified rows rest on copies that are not linked.** Re-checking them needs the books.
- **Nothing was tested on a real phone, on Safari or on Firefox.** Install and offline in particular were checked only in a headless Chromium-family browser.
- **The owner's own read of the Farsi** has not happened; an agent cannot do it.
- **Two owner questions from the first report are still open:** whether the Milestone keeps its 100 XP or becomes badge-only, and the invented badge names.
- **A blocked download still counts as a backup** (spec 2): a browser gives a page no signal that a file was saved. A "copy backup text" button would close the gap.
- **A correction to a book reaches an installed game one visit late**, because books are served from the device first.
- **Leaving a Station part-way and tapping Continue** starts the first Station still to play in that Section, which may be an earlier one. That is the spec as written; say if it should return to the exact Card instead.

## Where to look

- Specs: `docs/specs/01` to `08`.
- Reviews and audits: `docs/review/`.
- Verification records: `docs/verification/`.
- Phone pass: `docs/playtests/phone-pass-360.md`, script in `scripts/playtest/`.
- Decisions: `docs/decisions-grill.md`. Architecture: `docs/adr/0001` to `0011`. Log: `docs/SUPERVISOR-LOG.md`.
