# Spec 5 (install and offline) code review

Reviewed `main...feat/offline` on two axes (Standards, Spec) by a separate agent, with scenario runs in a headless browser against a local server (quota forced low, HTML served for a book, a simulated deploy). Disposition of each finding:

## Fixed

- **A full device turned good responses into errors.** A failed cache write rejected the whole answer: an online book came back as 503, and with no cached page every visit showed "offline". Every cache read and write in the worker now sits behind one rule: the cache is a convenience, and a failure there never changes what the network returned.
- **The panel was trusted without a worker.** It showed before registration, so a browser that refused the worker could show "28/28" with nothing able to open offline. The panel now appears only once a worker is registered.
- **Storage failures were miscounted.** A book that was fetched but could not be kept is now counted and named ("could not be stored: storage is full or blocked"), apart from books that could not be fetched.
- **The page could hang on a weak signal** although a cached copy existed. The page request now falls back to the cache after 3 seconds, and on a 5xx answer.
- **Any 200 counted as a book.** An HTML page answering for a book file was cached and counted. The worker keeps a book only when it is a plain, successful JSON answer; the download checks that the JSON is that book.
- **The page wrote its stale copy over the worker's refresh,** so a corrected book took three visits to arrive. While the worker controls the page, only the worker writes books.
- **Activation deleted every `fi-` cache on the origin.** Cache Storage is shared by all sites of one GitHub Pages user. The worker now deletes only names listed in `RETIRED_CACHES`.
- **Story 7 was partial.** A failed fetch or the worker's 503 now selects "this book is not on this device" even when the browser claims to be online.
- **No install path for Safari and Firefox.** A hint under the panel says where the browser's own install command is; it hides once installed or when a prompt is offered.
- **Not asked for, removed:** the portrait lock in the manifest; caching of every in-scope navigation (only the page and the manifest now); the `black-translucent` status bar, which needed safe-area handling the page does not have.
- **The worker showed a bare English "offline".** The fallback page for a first visit with no connection is bilingual.
- **Accessibility.** The focused button keeps focus while the panel is rewritten; the bar is a `progressbar`; the count is announced when it settles, not on each step.
- **Tests.** The worker's keep rule is a second pure function with tests; the scan for outside requests also catches protocol-relative URLs and `import`; the count shown cannot be applied out of order.

## Accepted, not changed

- **Install disappears after one tap.** A browser's install prompt can be shown once per event; the hint stays.
- **Icons refresh only when the shell cache name is bumped.** They change rarely; the rule is written in `sw.js`.
- **The manifest description is English only.** A manifest has one language; the game's name is the same in both.
- **The cache name and the book path appear in both the page and the worker.** They are separate programs; a test holds the name together.
- **Not checked:** real GitHub Pages headers, Safari, iOS, Firefox, eviction. The worker is verified on the live site in a headless browser after merge.
