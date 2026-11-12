## Problem Statement

The headings hurt my eyes. The title and the result headings are drawn with a magenta and cyan split shadow that reads as a 3D misprint, most labels are uppercase with wide letter spacing in an angular display face, the heaviest weights are used for small text, and a scanline overlay lies over the whole page. After a few Lessons the type is tiring.

## Solution

Keep the dark neon theme, and make the type calm. One smooth, rounded display face replaces the angular one. The split shadow, the scanlines and the glitch on headings go. Labels are written in sentence case with normal spacing, and weights stop at bold. Colour and glow stay on shapes (nodes, bars, buttons), not on letters.

## User Stories

1. As a player, I want the Path title without a coloured double shadow, so that I can read it without my eyes refocusing.
2. As a player, I want the pass and fail headings without a split shadow or a glitch animation, so that the result is clear the moment it appears.
3. As a player, I want a smooth display face for headings, numbers and buttons, so that the page feels friendly and not harsh.
4. As a player, I want labels in sentence case with normal letter spacing, so that words keep their shape and read faster.
5. As a player, I want small text no heavier than bold, so that it does not smear on a phone screen.
6. As a player, I want no scanline overlay over the text, so that letters are not striped.
7. As a player, I want glow kept off body text and kept soft on the few labels that have it, so that nothing shimmers while I read.
8. As a Farsi reader, I want Farsi text to keep Vazirmatn with no letter spacing, so that joined letters stay joined.
9. As a player reading in Both mode, I want the English and the Farsi line to look like one system, so that neither looks bolted on.
10. As a player on a slow connection, I want the page to stay readable before the web font arrives, so that I never see blank headings.
11. As a player who prefers reduced motion, I want no new animation from this change, so that my setting keeps being respected.
12. As the owner, I want the neon identity (dark ground, cyan and gold lights, the circuit road) to stay, so that this is a softening and not a second redesign.

## Implementation Decisions

- The display face changes from Chakra Petch to Plus Jakarta Sans, loaded from Google Fonts, the one allowed external host (ADR-0001). The body face stays Inter; Farsi stays Vazirmatn. The fallback stack ends in the system sans.
- Font weights requested are 400, 500, 600 and 700. No rule asks for 800.
- The split shadow on the Path title and the result heading is removed, with the `split` keyframes. The result heading enters with the existing rise.
- The scanline overlay on the page is removed. The moving grid in the background stays, dimmer.
- Uppercase and wide letter spacing are removed from headings, node labels, buttons and the foot buttons. The small kicker keeps a light spacing and no shadow.
- The glitch on a wrong answer stays: it is an effect on the screen, owned by fx (ADR-0011), and is off under reduced motion.
- ADR-0011 gets an amendment for the typeface and the removed overlay.

## Testing Decisions

- A good test reads the shipped page the way the player's browser does and asserts on what is in it, not on how a rule is written.
- Seam: the style block of the page, as in the neon theme tests. Assertions: no split shadow on type, no rule with weight 800, the display face named in the tokens and in the font request, no scanline overlay, Farsi letter spacing still zero.
- The headless browser run takes screenshots of the Path, a Card, a Check and a result in EN, FA and Both for a look by eye.
- Prior art: `test/neon.test.mjs`, `scripts/playtest/phone-pass.mjs`.

## Out of Scope

- A light theme. New colours. Changing the wording of any label.

## Further Notes

Owner request of 2026-11-13: "the bold fonts are hurting the eye (the 3D retro fonting); change that into something smoother".
