---
status: accepted
---
# Module design for index.html: five modules, one seam the tests cross

`index.html` holds five modules as separate classic `<script data-module="...">` blocks, each exposing one object on a `FI` global. Three of them (content, engine, store) never touch the DOM, `window`, `Date` or `Math.random`, and the test loader extracts those three blocks from the HTML and evaluates them in node. That is the seam: the HTML file is the only source, there is no build step (ADR-0001), and the engine is tested through the same interface the page uses.

## Modules and interfaces

**content** (deep: all six Stations, 30 books, checklists, habits, and every i18n string behind four calls)
- `FI.content.stations` : ordered array of Station objects `{ id, badge, items, fareSize }`; items are Cards `{ kind:'card', id, text:{en,fa}, source }` and Checks `{ kind:'check', id, type:'tap'|'tf'|'order', prompt:{en,fa}, options?, answer, source }`. `source` is the id of the Card that carries the answer, or for a Card the line of the source HTML it came from.
- `FI.content.item(stationId, id)` : one item or `undefined`.
- `FI.content.ui` : `{ en:{...}, fa:{...} }`, every non-content string (buttons, labels, disclaimer).
- `FI.content.text(obj, mode)` : renders a `{en,fa}` pair for a Language Mode. Both mode returns `{ top: en, under: fa }`.
- Hidden: how the Farsi was translated, digit conversion, the research-sourced additions and their citations (`addition: true, cite: url` on the item).
- Invariant the tests enforce: every `en` key has an `fa` key and the reverse; every Check's `source` Card precedes it in the same Station; every book title and number in `content/*.html` appears in the content.

**engine** (deep: the whole loop behind two calls)
- `FI.engine.initial()` : the full state.
- `FI.engine.reduce(state, action, content)` : returns a new state. Pure. Content is a parameter, not a global read, so tests can pass a two-Station fixture.
- `state.events` : array of effect names produced by this reduce call only (`coin`, `correct`, `wrong`, `hint`, `revealed`, `return`, `fare`, `fare-passed`, `fare-failed`, `lit`, `circle`, `section`, `milestone`, `bookmark`, `unbookmark`, `reset`). Render and fx read it; nothing else does. This keeps sound and animation out of the reducer while still letting a test assert "a Coin event happens only on a correct answer".
- Actions: `SET_MODE`, `OPEN_STATION`, `OPEN_TOOLS`, `BACK_TO_PATH`, `FLIP`, `RATE`, `ANSWER`, `CONTINUE`, `TOGGLE_CHECK`, `SET_JOURNAL`, `TOGGLE_HABIT`, `SET_SHELF`, `SET_SLIDER`, `TOGGLE_MUTE`, `TOGGLE_BOOKMARK`, `OPEN_AT`, `OPEN_BOOKMARKS`, `RESET`, `HYDRATE`. Actions named `UI_*` never reach the engine; render consumes them (order chips, filters, confirms, section picker, `UI_OPEN_CIRCLE`, `UI_ERROR_CLOSE`). `handleUi` answers `full` (re-render), `partial` (patch) or `path` (the app then dispatches `BACK_TO_PATH`, used by the Shelf's jump).
- `FI.engine.DURABLE` is the one list of fields that survive a reload; store reads it and HYDRATE iterates it.
- Fare question order is a deterministic rotation by attempt, never random, so a test can predict it.
- Lifted from the logic prototype (`docs/prototypes/logic-engine-verdict.md`), including the two fixes.

**store** (deep: persistence, schema versioning and failure modes behind three calls)
- `FI.store.durable(state)` : the slice worth saving (mode, muted, coins, awarded, rings, lit, xp, checklists, journal, habits, shelf, sliders). The run (queue, Returns, Fare, phase) is never saved (ADR-0003).
- `FI.store.save(storage, state)` : writes `fi-roadmap-v1`. Swallows every error. Returns `true` or `false`.
- `FI.store.load(storage)` : returns a durable slice or `null`. Swallows every error, rejects unknown schema.
- `storage` is injected (`window.localStorage` in the page, a plain object or a throwing object in tests). This is the second seam, and it is real: two adapters exist from day one.

**render** (deep: the entire DOM behind two calls)
- `FI.render.mount(root, dispatch)` : attaches delegated listeners on the root (click for `data-action` JSON, input for sliders, search and the journal, drag events for order chips).
- `FI.render.render(root, state, content)` : full re-render from state. Idempotent. Sets `lang` and `dir` on `<html>` from the mode. Reads `state.events` to add transient classes.
- Hidden: layout (ADR-0007), RTL isolation of Latin terms, digit localisation, focus management.

**fx** (shallow by necessity, tiny)
- `FI.fx.run(events, state)` : plays Web Audio and triggers animations for the events. Respects `state.muted` and `prefers-reduced-motion`. Lazily creates the AudioContext on first user gesture.

**app** (glue, not a module worth a seam, about 30 lines): `dispatch = action => { state = reduce(state, action, content); store.save(localStorage, state); render(root, state, content); fx.run(state.events, state); }`. On load: `HYDRATE` with `store.load(localStorage)`.

## The test seam

`test/load.mjs` reads `index.html`, extracts each `<script data-module>` block whose name is in the requested list, concatenates them with a fresh `const FI = {}` prefix and evaluates them with `new Function`. Tests get `{ content, engine, store }` with no DOM, no jsdom, no bundler. The render block defines functions only at load time, so a test may load it to call a pure helper it exports (`faHtml`); nothing in render is called with a DOM in unit tests. The play-tests in Chrome cover the DOM. Inside render, `t()` and `num()` read `FI.content` directly for brevity; `render()` still receives content as a parameter so the entry point stays explicit.

## Considered and rejected

- **Separate `src/*.js` ES modules concatenated into `index.html` by a script.** Cleaner imports and editor support, but it adds a build step and a second copy of the code, against ADR-0001. If the extraction loader proves brittle, this is the fallback, recorded here so the trade-off is not re-argued.
- **Engine emits effects by returning `{ state, effects }`.** Rejected for a single return value; `state.events` reset on every reduce gives the same testability with a simpler interface.
- **Render diffing prev and next state to decide animations.** Rejected; the reducer already knows what happened, so it says so in `events`.

## Amendment 2026-11-10 (ADR-0010)

- content gains a loader seam: `registerBook(json, expectedId)` fills the Lesson stubs of one book (and shuffles tap options deterministically by Check id); `isLoaded(bookId)`, `bookUrl(bookId)`, `circleOf(lessonId)`, and the constants `LESSON_XP`, `CIRCLE_XP`, `SECTION_XP`. This is the one place content is mutable after load.
- render gains `setLoading(on)` and `setError(on)`, called only by the app around a book fetch.
- The app owns fetching; the engine and content never fetch.
- A Section lists its runs (`sec.runs`): Stations for Basics, Lessons for a book.
- Amendment (spec 1, Review): actions `TICK` (the app sends the local day number; the engine never reads the clock), `OPEN_REVIEW`, `REVIEW_NEXT`, `REVIEW_ANSWER`, `REVIEW_RATE`; no events of its own (Review emits the existing `coin`, `correct` and `wrong`); `FI.engine.dueCount(state)` and `FI.engine.LADDER`. The Deck is durable.
- Amendment (spec 1 review): a Deck entry is a snapshot of the Card text and one Check, so Review works without the book file. The snapshot is refreshed from content whenever the Card is enqueued again and whenever Review opens with that content loaded, so a corrected translation reaches the Deck. The session cap is per day (`state.reviewed`), and a Review Coin is recorded in `awarded` per Card and step.
- Amendment (spec 1, Review): actions `TICK` (the app sends the local day number; the engine never reads the clock), `OPEN_REVIEW`, `REVIEW_NEXT`, `REVIEW_ANSWER`, `REVIEW_RATE`; events `review-correct`, `review-wrong`, `review-done`; `FI.engine.dueCount(state)` and `FI.engine.LADDER`. The Deck is durable.
- Amendment (spec 2, backup): store gains `backup(state, exportedDate)` and `parseBackup(text)`; engine gains `RESTORE`, `BACKUP_DONE`, event `restored`, and `backupAge(state)`. The app handles `BACKUP` (file download) and `RESTORE_CONFIRM` (takes the parsed backup from `render.takeRestore()`).
