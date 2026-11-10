# Phone pass at 360 px (spec 7)

Date: 2026-11-11. Headless Brave, viewport 360 by 740, device scale 2. A script walked 21 screens and checked each for three things: no element wider than the viewport and no sideways page scroll; every control at least 44 px in both directions; no control under the fixed picker button, the disclaimer or the Combo counter with the page scrolled to its end. Four screens were then looked at by eye.

Screens: Path in EN, FA and Both; search results; the Section picker; a book Section with a Circle open; the restore panel with a summary; the reset confirm; a Card; a tap Check; the feedback; the Fare; the Fare passed panel; Tools for Stations 1, 4, 5 and 6; Bookmarks; Notes; a Review Card and its Check.

## First run

- **Overflow:** none on any screen.
- **Covered controls:** none at the end of the page.
- **Tap targets:** many under 44 px. Language buttons 28 px tall, the mute and close buttons 34 px, the bookmark button 32 px, the Path bar and backup buttons 32 px, the Tools chip 26 px, filter and shelf chips 30 px, confirm buttons 33 px, small buttons 41 px, the Reading Order links 25 px, the picker 40 px.

## What changed

- Every control listed above is now at least 44 px in both directions.
- With 44 px controls the top bar has no room for the XP bar in its row at phone width; below 430 px the bar becomes the lit bottom edge of the top bar. The XP number stays in the row.
- The Combo counter and the save warning sit below the taller top bar.
- The picker button keeps its label and arrow on one line.
- The page ends 112 px above the bottom, clear of the picker and the disclaimer.
- The habit tracker shows each habit as a label over its week, so the day cells are 44 px tall.

## Final run

21 of 21 screens clean, no console errors.

## Known exceptions

- **Habit day cells are 44 px tall but about 38 px wide** at 360 px: seven 44 px cells do not fit one row.
- **The picker button is fixed**, so while scrolling it passes over whatever is beneath it. Nothing is under it at the end of the page.
- **Not checked:** a real phone, a screen narrower than 360 px, landscape, text enlarged by the system, an order Check (Station 1 has none; the walk did not reach one).
- **The owner's own read of the Farsi** (grilling decision 2) cannot be done by an agent and stays with the owner.
