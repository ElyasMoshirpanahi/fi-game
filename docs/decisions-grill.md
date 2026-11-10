# Grilling outcome: FI roadmap game

Date: 2026-11-09. Source: `/grilling` session, Step 1 of `docs-prompts.md` Part 1. Sixteen decisions, all made by the owner. Facts found by the executor are marked.

## Facts found (not decisions)

- The source HTML is Farsi only. Every English string in the game is a translation written during the build.
- Station 3 ("what not to learn") has two bullets in the source.
- Station 1 has four bullets with these numbers: 40k EUR capital, 5 to 8 percent real return, 2 to 3k EUR per year, 25x annual expenses, 600k to 1M EUR for Europe.
- The library has six tables, 28 books, and a 10-book reading order with the rule "2 books per month, one page of notes".
- GitHub CLI is logged in as ElyasMoshirpanahi over SSH. Node 24, npm 11, Python 3.14 available.

## Decisions

| # | Topic | Decision |
|---|-------|----------|
| 1 | Player | Me first, public later. One player who knows the context (BSN, Iran, NL). No onboarding, no accounts, no analytics. Published on GitHub Pages. |
| 2 | Translation | Claude translates the EN strings. Owner reviews them in Both mode during the first play-test. Book titles, tickers and finance terms stay in English in both languages. |
| 3 | Default language mode | EN. The header toggle offers FA, EN, Both. |
| 4 | Core loop | Station, then Card (one idea), then Check (one question), then reward, repeat; a Fare (3-question recap) closes the station. Prompt 0 builds exactly this for Stations 1 and 2. |
| 5 | Fare fail | Retry, missed cards first. The station stays open. The source cards for the missed Fare questions are shown again, then a fresh 3-question Fare is drawn. No lockout. |
| 6 | Gating | Free to jump between stations. Passing a station's Fare lights its node, awards its badge and theme colour, and counts toward total XP. |
| 7 | Station 3 content | Derive four true/false statements from the two source bullets plus cross-references to source lines in Stations 1 and 2. Each hint quotes the exact source line. Nothing new is asserted. |
| 8 | Both mode order | EN on top, FA beneath in muted colour. Page is `dir="ltr"` in Both mode; each Farsi line is isolated as RTL. |
| 9 | Fun rules | Coins, per-station ring, badges, total XP, Web Audio chime and buzz with a remembered mute toggle. No streaks, no timers, no hearts, no nag. |
| 10 | Anki return | Same session only in v1. Missed cards re-enter the queue before the Fare. Nothing stored. |
| 11 | Check types | All three from Prompt 0: tap-one, true/false, order. |
| 12 | Research corrections | Game copy is corrected after owner approval. The content HTML stays untouched. `docs/research/roadmap-facts.md` records original, correction, source and the owner's decision. |
| 13 | Out of scope | Backend, accounts, cross-device sync, PWA or service worker, analytics, monetisation, cross-session spaced repetition. |
| 14 | Definition of done | Pages URL live, all tests green, four play-test diaries written, Prompt 5 checklist all yes. |
| 15 | Repo | Public GitHub repo named `fi-game`. |
| 17 | Resume (added after the Prompt 0 play-test) | A reload resumes at the same Card. Returns and an in-progress Fare reset. ADR-0003 amended. |
| 18 | Book Units (owner request, 2026-11-09, mid Prompt 2) | Every book in the Library gets its own unit: author, year, the source's "why" line, 4 to 6 idea Cards covering the book's essentials, Checks, a Fare and a badge, in EN and FA. This is content beyond the source HTML, marked as an owner-approved addition. Built in Prompt 3 inside Station 6. |
| 19 | Size cap (2026-11-09) | index.html may be up to 400 KB (was 200 KB) to hold the 28 Book Units. Still one file, no external scripts. |
| 20 | Book Unit rewards | Each Book Unit is a mini-Station: badge plus 20 XP on its Fare. The Library Station lights when its own Fare passed and all ten Reading Order books are Lit. |
| 21 | Bookmarks (owner request, 2026-11-10) | Any Card can be bookmarked from its screen; a Bookmarks list on the Path reopens the Station at that Card. Stored in fi-roadmap-v1 with the rest of progress. |
| 22 | Sections (2026-11-10) | The Path is split into Duolingo-style Sections. Section 1, Basics, is Stations 1 to 6. Then one Section per book. |
| 23 | Units per book | Three: Unit 1 and 2 split the existing Book Unit (3 Cards and 2 Checks each); Unit 3, "Put it to work", is new content (4 Cards, 3 Checks) applying the book to the player's situation, written by content agents and validated. |
| 24 | Section order | Reading order first (Sections 2 to 11), then the other 18 books by stage 1, 2, 3, 5, 6, must-reads before optionals. |
| 25 | Gating | Free to jump (decision 6 kept). A section picker (a fixed button opening a sheet, per decision 29); the current Section expanded, the others collapsed. |
| 26 | Rewards | A unit Fare pays 20 XP. A complete Section pays the book's badge plus 30 XP. Basics keeps six Station badges at 50 XP. |
| 27 | Migration | A lit Book Unit from v1 counts as Units 1 and 2 lit. Unit 3 starts unlit. Coins, XP, bookmarks, shelf, checklists kept. One-time migration on first load. |
| 28 | Shelf | Stays under Library Tools as the index: reading states, filters, search; "Open unit" becomes "Go to section" and jumps the Path there. A Shelf button in the Path foot reaches it when Basics is collapsed (play-test fix). |
| 29 | Sectioned Path look | A's long road with inline section headers, finished sections collapsed, plus B's book banner as the header of the open section, and a bottom 'Jump to section' sheet. Prototype prototypes/ui-sections.html on branch prototype/ui-sections. |
| 30 | Content location (2026-11-10, Task 2) | Book content moves to per-book JSON files fetched on demand from the same origin (content/books/v3/bNN.json). index.html stays small and script-free of externals; opening from disk no longer loads books. ADR-0001 amended. |
| 31 | Book value model | A score from the source decides the size: the ten reading-order must-reads are high (3 Circles), the other must-reads mid (2), the optionals low (1). Lessons per Circle 3 to 5, Points per Lesson 10 to 15 (12 typical). Owner may override any book. |
| 32 | Learning point | A Point is a Card; a Check follows every 2 to 3 Points; every Lesson ends with a Fare. Loop, Hints, Returns and fairness unchanged. |
| 33 | Migration | Basics progress, coins, checklists, journal, habits, shelf states and Basics bookmarks are kept. Book progress starts fresh: book XP removed, book bookmarks dropped. Existing Cards are reused inside the new Lessons. |
| 34 | Names | Section (a book) holds Circles (nodes on the Path); a Circle holds 3 to 5 Lessons; a Lesson runs 10 to 15 Points. "Unit" retired for books; Basics keeps Stations. |
| 35 | Sizing | High: 3 Circles x 4 Lessons; mid: 2 x 4; low: 1 x 3; 12 Points per Lesson typical. About 2,600 Cards and 1,000 Checks, 28 files, one content agent per book. |
| 36 | Time box | Each Lesson shows its Points and about one minute per Point; the first Point of every Lesson frames what part of the book it distils. |
| 37 | Rewards | Lesson Fare 10 XP; complete Circle 25 XP; complete Section the book badge plus 50 XP. Basics Stations stay at 50. |
| 38 | Next steps as specs (2026-11-10) | Seven specs in docs/specs/, published as issues #8 to #14, built in order. Reverses decision 10 and the review and PWA parts of decision 13. |
| 39 | Review scheduling | Fixed ladder of 1, 3, 7, 16, 35 days (executor choice, reported to the owner on Telegram); FSRS deferred. |
| 16 | Ordering interaction | Tap-to-place is the baseline and the keyboard path. Pointer drag reorders as a progressive enhancement. |

## Executor decisions derived from the above (noted, not asked)

- Digits: Persian digits in FA mode, Latin digits in EN mode. In Both mode the English line uses Latin digits and the Farsi line beneath keeps its Persian digits (corrected after the Step 9 review).
- Storage key `fi-roadmap-v1`, as the playbook says. Every read and write in try/catch.
- Google Fonts (Vazirmatn, Inter) is the only allowed external request. No external scripts.
- Disclaimer "آموزشی است، نه توصیه خرید" / "Educational, not investment advice" is always visible.
