# Spec 7 (Continue, search, phone pass) code review

Reviewed `main...feat/ux` on two axes (Standards, Spec) by a separate agent, with node probes and a headless browser at 360 by 740 and 320 by 568. Disposition of each finding:

## Fixed

- **Continue was off-screen after every load on a phone.** The load-time camera scrolled the current node to the centre, leaving Continue above the viewport. The Path now opens at its top; Continue is the way to the current Lesson.
- **Search never saw books downloaded after the first search.** Loading the books on the device ran once. It now runs again whenever more books have reached the device.
- **Farsi and punctuation matching was too strict.** Text and query are now folded the same way: accents and Farsi vowel marks dropped, آ and ا alike, either form of ی and ک, any of the three digit sets, curly and straight apostrophes alike. The half-space matches whether it is typed, replaced by a space, or left out.
- **Continue forgot the player on an older save.** Resuming inside a Lesson after a reload now records its Section.
- **The result limit hid Cards behind Lessons.** Results show up to 4 Sections, 6 Lessons and 12 Cards, with a count of everything found and how many more there are.
- **Search ran on every keystroke** and refolded every Card each time. It now waits 140 ms after the last key and keeps each text's folded form.
- **Tools sliders were 16 px tall.** They are 44 px; the phone-pass script no longer exempts them.
- **The Combo counter floated over Tools.** It shows only in a Lesson, its Fare and Review.
- **Below 360 px the Path was too wide.** The wave is narrower under 350 px and the road follows it.
- **Small defects.** A Basics result was labelled "Book"; the Continue button showed Lesson names in capitals and was not full width; the query was cut at 80 characters without the field saying so; the save warning sat under the taller top bar; "Nothing found" showed while books were still loading (it now says so); Cards in the Deck were not searched; the XP bar and the Lesson progress bar filled from the wrong side in Farsi.
- **The phone-pass script was not in the repo.** It is in `scripts/playtest/`.
- **Standards.** The glossary entry for Continue no longer uses "done" (on the avoid list for a lit Station); `lastSection` has a length limit in its shape rule; the results list is no longer a live region (only its count line is announced); the empty `catch` blocks say why.

## Accepted, not changed

- **Leaving a Station part-way and tapping Continue starts the first Station still to play in that Section**, which may be an earlier one. This is story 2 as written. Resume after a reload still returns to the exact Card.
- **Habit day cells are about 38 px wide at 360 px** (32 px at 320). Seven 44 px cells do not fit one row.
- **At 320 px the Farsi disclaimer is 20 px wider than the screen.** The spec's floor is 360 px.
- **Two search fields have similar names in the code** (the Shelf's book filter and the Path's search). They do different jobs; renaming the older one touches code outside this spec.
- **Loading the books on the device has no unit test.** It is browser-only work (Cache Storage); the headless run covers it.
- **Not checked:** a real phone, Safari's reading of the restacked habit table, an order Check at phone width, landscape.
