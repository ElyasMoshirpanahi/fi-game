---
status: superseded by ADR-0010 for the inside of a book Section (Sections and the Path stay)
---
# The Path is Sections of Units; books join the Path in reading order

Decisions 22 to 28 (2026-11-10). The Path stops being six Stations with books hanging off the Shelf. It becomes one list of Sections: Basics (the six Stations) and one Section per book, 28 of them, ordered by the source's ten-book reading order and then by stage with must-reads first. Each book Section has three Units: the existing Book Unit split in two (its first half of Cards with their Checks, then the second half), and a new "Put it to work" Unit written to apply the book to the player's situation. A Unit is what the engine already calls a station: a run of Cards, Checks and a Fare, paying 20 XP. A complete Section pays the book's Badge and 30 XP. Sections are never locked; a picker at the top of the Path jumps between them and the current Section is the one expanded.

## Content model

```text
content.sections = [
  { id: 'basics',  kind: 'basics', name, units: ['s1'..'s6'] },
  { id: 'sec-b01', kind: 'book', bookId: 'b01', title, author, year, stage, must, why, badge, xp: 30,
    units: ['b01u1', 'b01u2', 'b01u3'] },
  ...
]
content.stations: s1..s6 plus b01u1, b01u2, b01u3, ... (book: true, bookId, unit: 1 | 2 | 3, xp: 20, no badge)
content.sectionOf(bookId) -> the book's Section
content.readingOrder: still book ids; the Library lights when the ten matching Sections are complete
```

`scripts/build-books.mjs` reads `content/books/bNN.json` (Units 1 and 2 by splitting the Cards in half and attaching each Check to the half that holds its source Card) and `content/books/bNN-apply.json` (Unit 3), and writes one `BOOKS` array; the content block turns it into stations and sections. The Card split point moves so that Units 1 and 2 each hold at least two Checks (a Check stays with its source Card); a Unit's Fare draws up to three questions, so these Units have two- or three-question Fares.

## Migration (decision 27)

Saved progress from v1 has `lit.bNN`, `farePassed.bNN`, `rings.bNN`, bookmarks and a run position that name a whole book. On HYDRATE, a lit `bNN` becomes `bNNu1` and `bNNu2` lit (the player passed a Fare over all its Checks), rings are recounted per Unit from `awarded`, bookmarks move to the Unit that holds their Card, a run inside a book is dropped, XP is kept as stored. The storage key stays `fi-roadmap-v1`; the shape is additive, so a v1 build reading a v2 document still works.

## Consequences

- The Path has 6 plus 84 Units; it is rendered by Section, collapsed except the current one, with a picker.
- The Shelf stays the index under Library Tools; its button jumps to the book's Section (decision 28).
- "Fare: three questions" in the glossary becomes "up to three".
- Unit 3 content is beyond the source and the book; it is marked as an addition and must not give personalised investment advice.
