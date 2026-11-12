## Problem Statement

On my laptop the game is a 480 px phone column in the middle of an empty screen. Nothing uses the width: my progress, the Review count and the list of Sections are all hidden behind taps that make sense on a phone and feel amateur on a desktop.

## Solution

The game stays phone-first, and from tablet width up it grows into a three-part layout like the learning apps I know: navigation on the left, the Path in the middle, and a right rail that always shows my progress, today's Review and the list of Sections. Lesson screens get a wider, centred reading column. On a phone nothing changes except what the other specs change.

## User Stories

1. As a desktop player, I want the Path in a centred column wider than the phone column, so that the road has room.
2. As a desktop player, I want a right rail with my XP, Coins and how many Sections are lit, so that I see my progress without opening anything.
3. As a desktop player, I want the rail to show how many Cards are due for Review with a button to start, so that Review is one click away.
4. As a desktop player, I want the rail to list every Section with its progress, so that I can jump to any book without the bottom sheet.
5. As a desktop player, I want the rail to stay in view while the Path scrolls, so that the Section list is always reachable.
6. As a desktop player, I want the Section I am in marked in the rail list, so that I know where I am on a long Path.
7. As a desktop player, I want Card and Check screens in a comfortable reading width with larger text, so that a Lesson does not look like a phone screenshot.
8. As a desktop player, I want the Shelf in two columns, so that I see more books at once.
9. As a desktop player, I want hover states on everything I can click, so that the page feels made for a mouse.
10. As a desktop player, I want the Disclaimer visible without it covering content, so that the rule holds and nothing is hidden.
11. As a tablet player, I want the same layout without the right rail, so that the Path keeps enough room.
12. As a phone player, I want no layout change from this spec, so that the phone experience stays the reference.
13. As a player who resizes the window, I want the layout to change without a reload and the road to redraw, so that nothing breaks half-way.
14. As a Farsi reader, I want the whole layout mirrored (navigation on the right, rail on the left), so that right-to-left reads naturally.
15. As a keyboard user, I want the rail's controls reachable by Tab in reading order, so that the desktop layout is not mouse-only.

## Implementation Decisions

- Three widths: phone below 700 px, tablet from 700 px, desktop from 1100 px. They are CSS media queries; render writes the same markup at every width and CSS shows what fits. No script reads the viewport to decide layout.
- The page becomes a grid at tablet width: navigation column, main column, and at desktop width a rail column. The main column is at most 640 px on the Path and 720 px on Lesson, Tools, Notes, Bookmarks and Review screens.
- Render adds one new block, the rail, on the Path screen: a progress panel (XP against the total, Coins, Sections lit), a Review panel (due count, start button), and the Section list (the same rows as the jump sheet). It is hidden below desktop width.
- At desktop width the jump button and its sheet are hidden; the rail list replaces them. The rail is sticky under the top bar and scrolls on its own when it is taller than the window.
- The rail is hidden on Lesson, Review, Notes, Tools and Bookmarks screens, which centre in the main column.
- The Shelf grid is two columns from 900 px.
- ADR-0007 gets an amendment: "desktop centres the same column at about 480 px" is replaced by this layout.

## Testing Decisions

- A good test asserts what the player can see and reach, at a width, not which rule produced it.
- Seam one, the render output: the Path markup contains the rail with the progress numbers, the Review count and one row per Section, and no rail on a Lesson screen.
- Seam two, the headless browser run at 360, 820 and 1366 px: nothing wider than the viewport, the rail visible only at 1366, the road path non-empty after a resize, no control under a fixed element, in EN and FA.
- Prior art: `test/render-smoke.test.mjs`, `scripts/playtest/phone-pass.mjs`.

## Out of Scope

- A separate desktop design or desktop-only features. Leaderboards, friends or quests in the rail. Keyboard shortcuts.

## Further Notes

Looked at on 2026-11-13 at desktop width: Duolingo's learn page is a labelled left sidebar, a centre path column of about 600 px and a right rail of stat cards. Brilliant's signed-in pages could not be opened (no account in the browser); its public page was used only as a reference for calm type. Navigation itself is spec 12; this spec owns the grid, the rail and the wider screens.
