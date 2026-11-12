## Problem Statement

Only one Section of the Path is open at a time. The other 28 are one-line headers, so the Path looks like a table of contents and not a road. To look into another book I tap its header, the one I was in folds shut and the page jumps. There is nothing to scroll through and no pull to see what comes next.

## Solution

Every Section is always open. The Path is one long road: Basics, then each book with its banner and its Circles, one after another. Nothing folds. I scroll, see the books ahead, and tap any Circle on the way.

## User Stories

1. As a player, I want every Section open with its Circles visible, so that I can scroll the whole road.
2. As a player, I want no way to fold a Section, so that the Path never jumps under my finger.
3. As a player, I want every book Section to show its banner (cover, title, author, year, edition, the "why" line, its size and its progress), so that each book introduces itself as I reach it.
4. As a player, I want to tap any Circle in any Section without opening the Section first, so that exploring costs one tap.
5. As a player, I want one GO marker on the whole Path, on the Circle or Station that Continue would start, so that my place stands out among 200 nodes.
6. As a player, I want the next unlit Circle of every other Section softly marked, so that each book shows where it would start.
7. As a player, I want to come back from a Lesson to the place on the Path where I left, so that I do not land at the top of a long page.
8. As a player, I want the first load to open at the top with Continue in view, so that resuming stays one tap.
9. As a player, I want the jump list to scroll to a Section and not fold the others, so that it is a shortcut and not a switch.
10. As a player, I want the Shelf's "Go to section" to scroll to that book on the open Path, so that it still leads somewhere.
11. As a player, I want the Notes button on every book Section, so that I can write about any book from the Path.
12. As a player, I want lit Sections to look finished (gold progress, Badge on the banner) while staying open, so that I can still replay their Lessons.
13. As a player on an older phone, I want the long Path to scroll smoothly, so that the open road does not cost speed.
14. As a player who prefers reduced motion, I want no moving marker except where motion is already switched off for me, so that the long Path is calm.
15. As a screen reader user, I want each Section to be a region with a heading and not a toggle button, so that I am not offered a control that does nothing.

## Implementation Decisions

- Render writes the nodes of every Section on every paint of the Path. The Section header stops being a button: it is a heading block with no action and no expanded state. The collapsed header form is removed.
- The UI-only action that opened and closed a Section is removed, with the field behind it. The jump action stays and only scrolls.
- The GO marker and the scanning ring are shown on one node only: the Circle (or Basics Station) holding the Continue target. In every other Section the first unlit Circle gets the current style without the marker.
- Returning to the Path from another screen scrolls the Section last played into view, centred on its current node. The first paint after a load does not scroll.
- The road of every Section is measured and drawn after each paint, as today for one Section; the redraw on resize covers all of them.
- The opening camera move plays on the first Section only, so that 29 lists are not animated at once.
- ADR-0007's amendment of 2026-11-10 ("finished Sections collapse to a one-line header") and ADR-0009's "collapsed except the current one" are superseded by a new amendment.

## Testing Decisions

- A good test reads the Path the player gets and counts what is on it.
- Seam, the render output: a fresh Path writes one node list per Section and no header with an expanded state; a book Section's Notes button and edition line are present with no action sent first; exactly one GO marker exists and it sits in the Section of the Continue target; the removed action is no longer handled.
- The headless browser run measures the Path at 360 px: every Section has a drawn road, a tap on a Circle repaints only that node (measured 8 ms; a full paint of the Path measured 87 ms at desktop size and 165 ms under phone emulation, so full paints are kept for screen and language changes), and nothing is wider than the viewport.
- Prior art: `test/render-smoke.test.mjs`, `test/notes.test.mjs` and `test/verification.test.mjs` (both open a Section before reading it and will stop needing to).

## Out of Scope

- Locking Sections. Lazy rendering or virtual scrolling of the Path. Reordering Sections.

## Further Notes

Owner request of 2026-11-13: "every section must be expanded and uncollapsible by default, so users tap into different books and scroll down". With every Section open the Path holds about 200 nodes; the jump list (spec 12 moves its button, spec 10 puts it in the desktop rail) is how a player crosses it quickly.
