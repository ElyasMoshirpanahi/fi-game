## Problem Statement

On my phone the game does not always fit the screen. A Card in one language fits; the same Card in both languages grows past the bottom of the screen and I have to scroll to find the button. After I answer a question, Continue is hard to hit. The buttons I press most (Continue, the answers) are the ones I struggle with.

## Solution

On a phone, the button that moves me forward is always in the same place: fixed at the bottom of the screen, full width and tall, on every step of a Lesson and of Review. The text scrolls above it when it is long; the button never moves and never needs a scroll. A Card in both languages uses a smaller type so that most Cards fit without scrolling at all.

## User Stories

1. As a phone player, I want the forward button at the bottom of the screen on every Card, so that my thumb finds it without looking.
2. As a phone player, I want that button visible without scrolling however long the Card is, so that a long Card does not hide it.
3. As a phone player, I want Continue after an answer in that same place, so that right, wrong and next are one motion.
4. As a phone player, I want the forward button to be full width and tall, so that I cannot miss it.
5. As a phone player reading both languages, I want the Card to fit the screen in most cases, so that I rarely scroll.
6. As a phone player reading both languages, I want to scroll the text and still see the button when a Card is long, so that I always know how to go on.
7. As a phone player, I want answer options with enough height and space between them, so that I do not hit the wrong one.
8. As a phone player, I want the last option never hidden behind the fixed button, so that every answer can be tapped.
9. As a phone player, I want the result of my answer (right, wrong, the correct answer) shown with the button, so that I read it and move on in one place.
10. As a phone player, I want the screens at the end of a Lesson to keep their button at the bottom too, so that the whole run feels the same.
11. As a phone player, I want Review to behave the same as a Lesson, so that I do not relearn the layout.
12. As a small-phone player (360 by 640), I want all of the above to hold, so that an older phone works.
13. As a phone player, I want the Disclaimer to stay visible, so that the fixed button does not cover it.
14. As a Farsi reader, I want the fixed button and the layout mirrored correctly, so that right-to-left works.
15. As a tablet or desktop player, I want the layout I have now, so that the phone fix does not change larger screens.
16. As a keyboard or screen-reader user, I want the order of the page unchanged, so that the fix is visual only.

## Implementation Decisions

- Phone means the existing phone breakpoint (below 700 px). Nothing changes at or above it.
- Inside a Lesson and inside Review, the block that holds the forward controls is fixed to the bottom of the viewport above the Disclaimer, with a solid background. The page keeps enough bottom padding that the last piece of content scrolls clear of it.
- The controls it holds: Continue on a Card (with Flip beside it in one-language modes), the feedback strip with Continue after an answer, the order-question controls, the buttons of the Lesson-end screens, and the Review buttons.
- Answer options stay in the flow of the page, above the fixed block. Minimum height 52 px, 10 px apart.
- Forward buttons on a phone: full width of the block, minimum height 54 px.
- In both-languages mode on a phone, Card text and question text are set smaller with tighter line spacing.
- The feedback strip after an answer stacks its message above a full-width Continue.
- It is done in the stylesheet. Render does not read the viewport (existing rule) and the markup order does not change.
- The Combo chip and the bottom navigation do not overlap the fixed block: the navigation is already hidden inside a run.

## Testing Decisions

- A good test loads the real page at a phone size and measures what a thumb meets: is the forward button inside the screen without scrolling, is it at least the stated height, does it overlap any answer option or the Disclaimer.
- Seam: the headless browser pass, at 360 by 640 and 390 by 844, in EN, FA and Both, on a Card, a question, the feedback after a right and a wrong answer, an order question, each Lesson-end screen, and Review. The longest Card of the first book is used for the both-languages case.
- The stylesheet is also checked by the existing type and shell tests where they read rules.
- Prior art: `scripts/playtest/shell-pass.mjs` (audits widths, control sizes and covered controls), `scripts/playtest/lesson-end-pass.mjs`.

## Out of Scope

- A real-device test: none is available to the builder; the owner checks on his phone. Landscape orientation. Changing the content of Cards. Tablet and desktop layouts.

## Further Notes

Owner report of 2026-11-14 from his own phone: both-languages Cards scroll, and Continue, Knew it and Didn't know are hard to hit. Spec 15 removes the two rating buttons; this spec fixes where the remaining button sits.
