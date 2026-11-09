# Final report: FI Roadmap game

Date: 2026-11-09. Supervisor session that ran `FI-GAME-PLAYBOOK.md` Part 1, Step 0 to Step 10, in `C:\Users\Retrotech\Desktop\fi-game`.

## What was built

One self-contained `index.html` (265 KB, no external scripts, Google Fonts only), a dual-language (English and Farsi) learning game built from the Farsi roadmap to financial independence.

- Six Stations on a Duolingo-style zigzag Path (ADR-0007): Reality Check, Knowledge Roadmap, What NOT to Learn, Getting Better, Next 6 Months, Library. Each with its own theme colour and Badge.
- The loop: Card (one idea, two sentences, Flip between languages, Rating "knew it / didn't"), Check (tap-one, true/false, tap-to-place order with drag as enhancement), Hint after one miss quoting the source Card in both languages, answer revealed after two, missed Cards Return before the Fare, a three-question Fare lights the Station.
- Rewards on three horizons: Coins per correct answer, a Ring and Badge per Station, an XP bar, 28 Book Unit badges, the Milestone "First €100 of ownership income" when both Checklists are complete.
- Tools reachable from the Path: Station 1 sliders (capital, real return, expenses, the 25x target), Station 4 weekly habit grid (ISO-week rollover) and decision journal with a six-month re-read date, Station 5 both Checklists with completion percentage, Station 6 the Shelf: 28 books with full attribution and year, stage and must-read filters, search, To-read / Reading / Read, and the ten-book Reading Order.
- 28 Book Units (owner decision 18): each 4 to 6 Cards of the book's essentials, 3 to 4 Checks, a Fare, a Badge and 20 XP, in both languages, generated from `content/books/*.json` and validated for the fairness rule.
- Language Modes EN (default), FA (full RTL, Persian digits) and Both (EN on top, FA beneath). Latin terms inside Farsi are isolated so VWCE, DCF, Box 3 and book titles never scramble.
- Three camera moments (Prompt 4), each under 800 ms: wide-to-close on first load, pull-out when a Station lights, a dolly on the Milestone. All off under reduced motion.
- Progress under one localStorage key `fi-roadmap-v1`, every read and write in try/catch, reload resumes at the same Card, reset behind a confirm step, disclaimer always visible.

## Tests

349 tests, all green (`npx vitest run`), no browser needed. They load the content, engine and store blocks straight out of `index.html`:

- i18n parity (every ui key and every Card, Check and option in fa and en)
- the fairness rule over all six Stations and all 28 Book Units (the source Card precedes every Check; the correct option's wording appears in that Card)
- Coins only on a correct answer, once per Check
- missed Cards Return in the same session, deduplicated, forgotten on leaving
- a Station lights only after its Fare; the Library only after its Fare plus the ten Reading Order books
- store round-trip, disabled storage, corrupt JSON, resume position, Returns pass never stored
- widgets, Milestone granted once, XP per Station and Book Unit, totals
- RTL Latin-run isolation (regression from the Prompt 0 play-test)
- cinematic constraints (durations, properties, reduced motion)
- source coverage: 28 books, authors, Farsi "why" lines, reading order, both Checklists verbatim, key numbers, every addition cited
- single-file constraints: no external scripts, Google Fonts only, under 400 KB, disclaimer present

## Play-tests (four diaries in `docs/playtests/`)

**Prompt 0.** The loop worked in EN, FA and Both on the first build. Seven deliberate misses were all fair: the Hint quoted the source line every time. Storage key confirmed, cleared storage ran clean, no console errors, 360 px with no overflow. Found a dead reading stretch in Station 2, an RTL bug where "(VWCE / IWDA)" and "Title (Author)" split across lines, and a Flip that looked like a label. The owner chose to add resume-on-reload.

**Prompt 2.** Flip became a button, a miss shows the Hint and a red bar, a correct answer bumps the coin pill with a floating +1, reload lands on the same Check, the Station 2 stretch was split into shorter Cards with Checks between them, and the RTL fix held in the real page. Two carry-overs: resume should skip an already-answered Check, and the 30% ruling Card was still four sentences. Both done in Prompt 3.

**Prompt 3.** All six Stations with themes, the sliders, the habit grid, the journal, the Checklists with the Milestone, and the Shelf with 28 Book Units. Two bugs found and fixed with tests: the Milestone overlay came back on every UI-only re-render, and the Milestone was lost on reload. Chrome's screenshot capture timed out on scrolled pages for the rest of the session, so later checks were done through the DOM. Not built: the "Done box" on each Stage card (the Checks already track it); the owner chose to move on.

**Prompt 5.** The journal and the full Shelf were cut from the Station runs (still under Tools) as homework. The camera moments read as intended. The habit table mirrors in FA, reset confirm works, Both mode in a Book Unit reads well. Six-line checklist all yes. Open content item: the Fare repeats the Checks word for word; paraphrased Fare questions are proposed for a later iteration.

## Finance facts changed because of research

Every change below follows an owner decision recorded at the end of `docs/research/roadmap-facts.md`. The source HTML is untouched (ADR-0005).

| Source said | Game says | Why |
|---|---|---|
| 40k at 5 to 8 percent real is 2 to 3k a year | Kept, plus a Card: world equities 5.2 percent real 1900 to 2024 and 3.5 percent since 2000; above 6 percent is a best case | Dimson, Marsh, Staunton / UBS Yearbook; 8 percent real exceeds every long-run series |
| Capital of at least 25 times expenses | Kept, plus a Card: it is the 4 percent rule (Bengen 1994, Trinity 1998), US data, 30 years, no taxes, so a floor not a target | The rule's own papers |
| 600k to 1M for Europe | Kept, plus: that is 24k to 40k a year of spending; the slider shows it live | Arithmetic made explicit |
| ind.nl for visa and the 30% ruling | ind.nl covers the residence permit (highly skilled migrant thresholds); the employer applies for the 30% ruling at the Belastingdienst | Contradicted by belastingdienst.nl and government.nl |
| With Iranian citizenship and no foreign residency a global broker will not open an account | Brokers decide by residence and tax residency plus sanctions screening; Iran is not on Interactive Brokers' or DEGIRO's lists; after Dutch residence with a BSN and a Dutch bank account both accept applications, with possible extra checks | IBKR's own country list; DEGIRO's page was geo-blocked and is cited from an excerpt |
| Vicki Robin; Berman & Knight; Peter Lynch; Peter Thiel; Charlie Munger | Joe Dominguez, John Case, John Rothchild, Blake Masters and editor Peter D. Kaufman added, with years for all 28 books | Publisher and Library of Congress records |
| (nothing) | Box 3 2026 numbers, 30% ruling 2026 numbers, loss rates (ESMA 74 to 89 percent of retail CFD accounts; Brazil 97 percent of persistent day traders) as research-sourced Cards | Owner chose to add all three |

## Where it is

- Repository: https://github.com/ElyasMoshirpanahi/fi-game (public, default branch `main`, PR #1 merged)
- GitHub Pages: https://elyasmoshirpanahi.github.io/fi-game/ (enabled on `main` at the end of the session; the first build was pending when this report was written, see the supervisor log for the live check)
- Local: `C:\Users\Retrotech\Desktop\fi-game`, serve with `npm run serve`

## What a human should still check by hand

1. Read the 28 Book Units in Both mode (grilling decision 2: the English and the Farsi were written by Claude and reviewed only by the validator). Fix wording in `content/books/bNN.json`, run `node scripts/build-books.mjs`, run `npm test`.
2. Decide two items the Step 9 review flagged as unasked: the Milestone awards 100 XP (keep or make it badge-only), and the Book Unit badge names were invented from each book's key idea rather than taken from the source.
3. Open the Pages URL on a phone: the zigzag at 360 px, the Both-mode line spacing, the sliders with a thumb, the drag reorder on touch (tap-to-place is the baseline and works everywhere).
4. Sound: the chimes play after the first tap only (browser autoplay rules); confirm the mute toggle persists.
5. Dutch 2026 numbers (Box 3 thresholds and deemed returns, the 30% ruling salary norm) are dated; re-check them each January against belastingdienst.nl.
6. The DEGIRO acceptance line rests on a search excerpt because the page was geo-blocked; confirm on degiro.nl from the Netherlands.
7. Chrome screenshot capture failed on scrolled pages during the last play-tests; a visual pass of the Shelf and the long Path on a real phone is worth ten minutes.
8. The Fare asks the same questions as the Checks. If that feels repetitive after a week of play, paraphrased Fare questions are the next content iteration.
