## Problem Statement

When I tap a Circle on my phone (for example "Behaviour, luck, time"), a list of its three Lessons unfolds inside the Path and pushes the road down. I then have to find the right row and tap its button. It is two decisions and a layout jump to do the one thing I came for: start the next Lesson.

## Solution

On a phone, tapping a Circle opens a small pop-up anchored to it. The pop-up names the next Lesson of that Circle and has one Start button. The Path does not move. The Circle's other Lessons are one tap away inside the same pop-up, so a Lesson can still be replayed. On a desktop the unfolding list stays.

## User Stories

1. As a phone player, I want a tap on a Circle to open a small pop-up and not unfold a list, so that the Path stays where it is.
2. As a phone player, I want the pop-up to name the next Lesson I have not lit in that Circle, so that I do not have to pick.
3. As a phone player, I want one Start button in the pop-up, so that a second tap starts the Lesson.
4. As a phone player, I want the pop-up to say "Lesson 2 of 3", the number of Points and the minutes, so that I know what I am starting.
5. As a phone player, I want a small numbered row of the Circle's Lessons with a tick on the lit ones, so that I can choose another Lesson or replay one.
6. As a phone player, I want the button to say Replay when the shown Lesson is already lit, so that the label is honest.
7. As a phone player, I want a Circle whose Lessons are all lit to open on its first Lesson with Replay, so that the pop-up always has an answer.
8. As a phone player, I want a tap outside the pop-up, a second tap on the Circle, or Escape to close it, so that I am never stuck in it.
9. As a phone player, I want a tap on another Circle to move the pop-up there, so that browsing is quick.
10. As a phone player, I want the pop-up to stay inside the screen at 360 px wherever the Circle sits on the wave, so that it is never cut off.
11. As a phone player, I want the pop-up scrolled into view when it opens near the bottom, so that Start is never under the navigation.
12. As a desktop player, I want the Circle to keep unfolding its list of Lessons, so that I can see all of them at once.
13. As a Farsi reader, I want the pop-up mirrored and in Farsi, so that it reads right-to-left.
14. As a screen reader user, I want the Circle button to announce that it opens a dialog and the pop-up to be labelled with the Circle's title, so that I know what opened.
15. As a keyboard user, I want focus to move to Start when the pop-up opens, so that Enter starts the Lesson.
16. As a player, I want a Basics Station to keep opening on one tap, so that nothing gets slower.

## Implementation Decisions

- Render keeps one UI-only field for the open Circle and adds one for the Lesson chosen inside it. Opening a Circle clears the choice, so the pop-up shows the Circle's next unlit Lesson.
- New UI-only actions: choose a Lesson inside the open Circle, and close the Circle. Starting a Lesson is the existing open-Station action; nothing in the engine changes.
- When a Circle is open render writes both forms: the pop-up inside the Circle's node, and the Lesson list after it. CSS shows the pop-up below desktop width (1100 px) and the list from it. Render does not read the viewport.
- The pop-up is positioned under the node and centred on the Path column, with the node's wave offset undone, so it cannot leave the screen. A caret points at the node.
- A Section must not clip its pop-up, and the open node is drawn above its neighbours and above the next Section.
- A click that lands on no control closes the open Circle; so does Escape.
- After opening, the pop-up is scrolled into view (nearest edge) and focus moves to Start.
- The pop-up meets the 44 px tap-target rule of spec 7.

## Testing Decisions

- A good test drives the same actions a tap sends and reads the markup the player gets.
- Seam one, the render output through the UI actions: an open Circle writes a pop-up naming the first unlit Lesson with a Start action for it; with that Lesson lit it names the next; with all lit it shows the first with Replay; choosing a Lesson changes the name and the Start target; close removes it.
- Seam two, the headless browser run at 360 px: the pop-up lies inside the viewport for the left-most and right-most node of the wave, in EN and FA; Start is not covered by a fixed element; the Path's height is the same before and after opening.
- Prior art: `test/render-smoke.test.mjs` (the open Circle test), `scripts/playtest/phone-pass.mjs`.

## Out of Scope

- Starting a Lesson on the first tap with no pop-up. A pop-up for Basics Stations. Changing the Lessons, their order or the Continue rule.

## Further Notes

Owner request of 2026-11-13. The pop-up is the pattern Duolingo uses on its path: tap a node, a small card under it names the lesson and has one Start button.
