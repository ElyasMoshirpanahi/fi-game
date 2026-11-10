## Problem Statement

My roadmap's rule is "2 books a month, one page of notes per book in your own language". The game teaches the books but gives me nowhere to write that page, so the one habit the roadmap asks for happens outside the game or not at all.

## Solution

Every book Section has a Notes page: one text area, mine, in whatever language I write. It saves as I type, shows a word count against "about one page", and is reachable from the Section banner and from the Shelf.

## User Stories

1. As a player, I want a Notes button on each book Section, so that I can write while the ideas are fresh.
2. As a player, I want my notes to save as I type, so that I never lose a paragraph.
3. As a player, I want to write in Farsi or English with the text direction following what I type, so that mixed notes read correctly.
4. As a player, I want a word count and a soft "about one page" marker (300 words), so that I know when I have done what the roadmap asks.
5. As a player, I want the Shelf to show which books have notes, so that I can see the habit forming.
6. As a player, I want a prompt of three questions above the empty page (what the book argues, what I will do differently, what I disagree with), so that the blank page is not a wall.
7. As a player, I want completing a book Section to invite me to write the page, so that notes follow reading.
8. As a player, I want notes included in backup and restore, so that they are as safe as progress.
9. As a player, I want notes never to leave my browser, so that I can be candid.

## Implementation Decisions

- A durable `notes` map keyed by book id, each entry the text and the date last edited (date supplied by the app).
- One engine action sets a book's note; text is capped at 20,000 characters.
- Render: a Notes screen per book (text area with `dir="auto"`), a Notes button in the open Section banner and on Shelf cards, a marker on Shelf cards with notes, a line on the Section-complete result panel.
- Typing uses the existing silent-dispatch pattern so the screen is not re-rendered under the cursor.
- Glossary gains **Notes** (the player's own page for a book); the decision journal stays a separate thing (decisions, not books).

## Testing Decisions

- Reducer seam: set, cap, unknown book ignored, durable, round trip through the store and through backup.
- Prior art: the journal and shelf tests; the render smoke test for the new screen.

## Out of Scope

- Rich text, export of notes as a document, sharing, AI feedback on notes.

## Further Notes

Self-explanation is rated moderate utility in Dunlosky et al. (2013); this feature exists mainly because the owner's own roadmap prescribes it.
