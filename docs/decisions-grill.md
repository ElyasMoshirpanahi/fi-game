# Grilling outcome: FI roadmap game

Date: 2026-11-09. Source: `/grilling` session, Step 1 of `docs-prompts.md` Part 1. Sixteen decisions, all made by the owner. Facts found by the executor are marked.

## Facts found (not decisions)

- The source HTML is Farsi only. Every English string in the game is a translation written during the build.
- Station 3 ("what not to learn") has two bullets in the source.
- Station 1 has four bullets with these numbers: 40k EUR capital, 5 to 8 percent real return, 2 to 3k EUR per year, 25x annual expenses, 600k to 1M EUR for Europe.
- The library has six tables, 30 books, and a 10-book reading order with the rule "2 books per month, one page of notes".
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
| 16 | Ordering interaction | Tap-to-place is the baseline and the keyboard path. Pointer drag reorders as a progressive enhancement. |

## Executor decisions derived from the above (noted, not asked)

- Digits: Persian digits in FA mode, Latin digits in EN and Both modes (Both is EN-led).
- Storage key `fi-roadmap-v1`, as the playbook says. Every read and write in try/catch.
- Google Fonts (Vazirmatn, Inter) is the only allowed external request. No external scripts.
- Disclaimer "آموزشی است، نه توصیه خرید" / "Educational, not investment advice" is always visible.
