# Play-test diary: Sections (books on the Path)

Date: 2026-11-10. Chrome over http://localhost:8765/index.html, 700 px window, dark theme, EN and FA, scripted clicks with screenshots at the top of each screen (the capture tool still times out when scrolled).

## Timeline

- Seeded storage with a v1 document (lit s1 and b01, rings, a bookmark on b01c5, a run inside b01, shelf b01 read). First load: Basics open with Reality Check lit, 28 collapsed book sections below, "Jump to section" button above the disclaimer. The stored document was rewritten on load: lit b01u1 and b01u2, rings 2 and 2 recounted from the awarded Checks, the bookmark moved to b01u2, the run dropped, XP unchanged.
- Picker sheet: 29 rows with counts. Tapped Atomic Habits: the sheet closed, section 3 opened with three nodes numbered 1, 2, 3 and a banner (⭐, James Clear · 2018, the source's why line, 0/3).
- Opened "Put it to work" of Atomic Habits: book header reads "James Clear · 2018 · Put it to work", the Card carries the note "applies the book to your situation, beyond the source, educational not advice", 1 of 7.
- Bug 1: years rendered as "2,018" (thousands separator). Fixed with a year formatter that only swaps digits in FA.
- Bug 2: the Shelf was unreachable once another section was open (the Library node sits inside the collapsed Basics). Added a Shelf button next to Bookmarks in the Path foot.
- Bug 3: "Go to section" from the Shelf landed on Basics; the button passed the section id where the handler expected the book id. Fixed.
- Bug 4 (pre-existing): the Tools pill under a lit node rendered as a gold circle because the node circle styles matched every button in the node. Scoped the styles to the unit button.
- Ran Venture Deals: Unit 1 "+20 XP", Unit 2 "+20 XP", Unit 3 "Section complete · Badge: (the book's badge) · +50 XP"; back on the Path the section shows 3/3 ✓ with the badge, and the Path pulled out.
- FA: section headers, counts and the picker mirror; book titles stay Latin left-to-right inside right-to-left headers.
- Console clean throughout. index.html is 394 KB, 6 KB under the 400 KB cap.

## Where I got bored

- A finished section is one line; the open one is three nodes. The 28 collapsed headers scroll past fast. Not bored, but the Path is long: the picker is the way to move.

## Where I got confused

- After jumping to a book from the Shelf I expected to land scrolled to it; the scroll happens after render and is smooth, so on a long page it takes a moment.

## Verdict (supervisor's view, owner may overrule)

Ready for review and merge. The size cap needs a decision soon: 394 KB of 400.
