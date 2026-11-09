# FI Roadmap

A dual-language (English and Farsi) learning game built from one Farsi roadmap to financial independence. Six Stations on a path, one idea per Card, one question per Check, a three-question Fare at the end of each Station, and 28 Book Units on the Library shelf.

**Educational, not investment advice.** آموزشی است، نه توصیه خرید.

## Play

Open `index.html`, or the GitHub Pages site for this repo. One file, no build, no external scripts. Progress lives in your browser under the localStorage key `fi-roadmap-v1`; the reset button on the Path sits behind a confirm step.

## Develop

```
npm install
npm test            # vitest, 347 tests, no browser needed
npm run serve       # python -m http.server 8765
```

The tests load the `content`, `engine` and `store` script blocks straight out of `index.html` (see `test/load.mjs` and `docs/adr/0008-module-design.md`). Book Units are authored as `content/books/bNN.json`, validated by `scripts/validate-book.mjs` and written into `index.html` by `scripts/build-books.mjs`.

## Where things are

- `GLOSSARY.md`: the game terms and the finance terms, in both languages.
- `docs/adr/`: the decisions, including the single-file rule, the i18n rule, the storage key and the module design.
- `docs/decisions-grill.md`: the twenty owner decisions this build follows.
- `docs/research/roadmap-facts.md`: every factual claim in the source checked against primary sources, with the owner's decisions on each flagged item.
- `docs/playtests/`: first-person play-test diaries after Prompt 0, 2, 3 and 5.
- `docs/SUPERVISOR-LOG.md`: the step-by-step build log.
- `content/financial_independence_roadmap_clean.html`: the frozen source. Never edited; corrections live in the game copy and are recorded in the research file.
