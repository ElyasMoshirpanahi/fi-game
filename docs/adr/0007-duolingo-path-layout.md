---
status: accepted
---
# The look is the Duolingo zigzag path, polished

Three structurally different looks were prototyped on real Station 1 and 2 content (`prototypes/ui-variations.html`, kept on branch `prototype/ui-variations`): A, a Duolingo zigzag path of round nodes; B, a Brilliant-style lesson with a chapter sidebar and an interactive pane; C, a Farsi-first editorial page. The owner first picked B, then overruled it the same day in favour of A with the instruction "the zigzag road, but polished". The Path is a vertical zigzag of six round Station nodes with a Ring around each, a Badge on Lit Stations, and a pulsing current node; a Card or Check opens as its own screen with large tap targets and a feedback bar. "Polished" means: consistent spacing on a 360 px phone, restrained motion (lift, pulse, ring ease), a real palette rather than stock green, and interactives (Station 1 sliders) inside the Card screen rather than a lesson pane.

## Consequences

- Phone-first. Desktop centres the same column at about 480 px wide.
- The Ring is a real circle around the node, matching the glossary.
- Coins and XP live in a sticky top bar with the Language Mode toggle.
- The Brilliant-style embedded interactive from B is still allowed inside a Card screen (Station 1 sliders), it just does not define the layout.

## Amendment 2026-11-10 (decision 29)

The Path is now a list of Sections (ADR-0009). Each Section keeps the zigzag of round nodes inside it; finished Sections collapse to a one-line header, the open Section's header is a book banner (cover mark, title, author, year, the source's "why" line, unit count, badge when complete), and a fixed "Jump to section" button opens a bottom sheet listing all Sections. Chosen over a tabbed one-section-at-a-time view to keep the single road feel.

## Amendment 2026-11-13 (specs 10 to 13, issues #27 to #30)

Every Section is always open: no header folds, and the collapsed one-line header is gone (this replaces the amendment above and ADR-0009's "collapsed except the current one"). The game has a navigation with five destinations (Learn, Review, Shelf, Bookmarks, Profile). "Desktop centres the same column at about 480 px" no longer holds: below 700 px the navigation is a floating bar at the bottom of the screen; from 700 px the page is a grid with a rail of icons on the left; from 1100 px the rail is a labelled sidebar and a right rail beside the Path shows the player's numbers, the Review count and the list of Sections. Render writes one markup at every width and CSS chooses; no script reads the viewport to pick a layout. A tap on a Circle opens a pop-up with its next Lesson below 1100 px and unfolds the Lesson list from it.
