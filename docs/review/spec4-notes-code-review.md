# Spec 4 (Notes) code review

Reviewed `main...feat/notes` on two axes (Standards, Spec) by a separate agent, with node probes and a headless browser at 420 px. Disposition of each finding:

## Fixed

- **Script injection through a note's date.** The shape rule accepted any text as `edited`, and the page printed it unescaped, so a crafted backup ran script when Notes opened. `edited` must now be a day or empty, and both dates the page prints from a file are escaped.
- **Shape rule too loose.** A note entry is now exactly `{ text, edited }` under a book id, with text inside the 20,000 character cap. A backup with a 10 MB note, an unknown key or an extra field is refused.
- **A failed save was silent.** The count kept moving while nothing was stored. The app now reports every save result, and a warning shows on any screen while saving fails.
- **The Notes invite vanished** on a mode switch or mute, because it hung on the one paint that carried the event. It now shows whenever the finished book's pass panel is shown.
- **Focus was left on the page body** when Notes opened. The text area takes focus.
- **The live region re-read the whole count** at every typing pause. Only "One page written" is announced.
- **"1 words"**, and a bar that showed full at 299 words. Singular wording; the bar is full only at 300.
- **Farsi layout.** The bar filled from the wrong side; the empty page's Farsi placeholder was left-aligned.
- **A row of dots or a dash counted as words.** A word now needs a letter or a digit.
- **The Basics pass panel's button had grown to full width.** Only a finished book's panel gets the two-button layout.
- **The restore summary did not mention notes.** It now counts them.
- **Standards.** ADR-0008 said the app supplies the day; render does, as for the journal. `maxlength` reads the engine's cap. The unused test parameter is gone. `pagehide` saves a pending note as well as a hidden tab.

## Accepted, not changed

- **On a Shelf card "Go to section" wraps to a second row at 420 px.** Three controls do not fit one row; the 360 px pass in spec 7 revisits the card.
- **Two copies of a local-date formatter and of the 400 ms delay** (Notes and journal in render, backup in app). Left until a third use.
- **The save helper is declared after the click handler that calls it.** Both sit in one function and the call happens at tap time.
- **Tab close and browser back within 400 ms of a keystroke** rest on `visibilitychange` and `pagehide`; not tested in a real browser.
