# Spec 1 (Daily Review) code review

Reviewed `main...feat/review` on two axes (Standards, Spec) by a separate agent. Disposition of each finding:

## Fixed

- Coin farm: unbookmark and rebookmark reset the step and paid a Coin a day. A Review Coin is now paid once per Card and step (`awarded`).
- Snapshot took the Card's first Check, not the Check that was missed. The missed Check is now stored.
- A miss inside a Lesson pushed a Card that was due today to tomorrow. A due Card now stays due.
- A bookmark whose Card no longer exists could not be removed. It can now.
- `HYDRATE` with `deck: null` threw. The Deck and bookmarks are now checked on load.
- Bookmarks saved before Review existed never joined the Deck. They are backfilled on `TICK`.
- A wrong Review answer showed "The answer was" with no answer. The answer is shown.
- The cap of 20 was per visit. It is now per day, and the Path button shows only what is left today.
- Glossary words to avoid: `grade` is now `settle`; `review.queue` is now `review.ids`.
- Unused events `review-correct`, `review-wrong`, `review-done` removed.
- Stale snapshot text (ADR-0002): entries refresh from loaded content.
- Glossary Coin entry, ADR-0003 and the spec's `today` note amended.
- Tests added: RESET, Fare miss, order Check, bookmark plus miss, and one per fix above.

## Accepted, not changed

- `reviewScreen` repeats the tap / true-false / order markup of the Lesson Check instead of sharing it. Sharing needs the Lesson panel split from its Hint, attempt and drag logic; left for the 360 px pass (spec 7), which touches the same panels.
- Short local names (`e`, `k`, `r`) in render follow the rest of that module.
- `marked` on a Deck entry repeats what `bookmarks` says. It keeps "why is this Card here" readable in one place.
