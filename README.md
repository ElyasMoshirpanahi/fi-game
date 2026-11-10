# FI Roadmap

A dual-language (English and Farsi) learning game built from one Farsi roadmap to financial independence. Six Stations on a path, one idea per Card, one question per Check, a three-question Fare at the end of each Station, and 28 Book Units on the Library shelf.

**Educational, not investment advice.** آموزشی است، نه توصیه خرید.

## Play

Open `index.html`, or the GitHub Pages site for this repo. One file, no build, no external scripts. Progress lives in your browser under the localStorage key `fi-roadmap-v1`; the reset button on the Path sits behind a confirm step.

## Develop

```
npm install
npm test            # vitest, no browser needed
npm run serve       # python -m http.server 8765
```

The tests load the `content`, `engine` and `store` script blocks straight out of `index.html` (see `test/load.mjs` and `docs/adr/0008-module-design.md`). Books are authored as `content/books/v3/bNN.json` (Sections of Circles of Lessons, ADR-0010), validated by `scripts/validate-book-v3.mjs`; `node scripts/build-manifest.mjs` writes their titles and counts into `index.html`. The page fetches a book's file when one of its Lessons opens, so serve the folder over http. The v2 files in `content/books/` are kept as source material.

## Where things are

- `GLOSSARY.md`: the game terms and the finance terms, in both languages.
- `docs/adr/`: the decisions, including the single-file rule, the i18n rule, the storage key and the module design.
- `docs/decisions-grill.md`: the twenty owner decisions this build follows.
- `docs/research/roadmap-facts.md`: every factual claim in the source checked against primary sources, with the owner's decisions on each flagged item.
- `docs/playtests/`: first-person play-test diaries after Prompt 0, 2, 3 and 5.
- `docs/SUPERVISOR-LOG.md`: the step-by-step build log.
- `content/financial_independence_roadmap_clean.html`: the frozen source. Never edited; corrections live in the game copy and are recorded in the research file.

## Offline and install

Served over http(s), the game registers a service worker (`sw.js`). The page then opens with no connection, every book opened once stays on the device, and "Download all books" on the Path fetches the rest. Browsers that support it can install the game to the home screen. Opened from disk the page plays the Basics only and registers no worker.
