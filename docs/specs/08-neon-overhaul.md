## Problem Statement

The game works, but it looks like a tidy study app. The Path is a dotted line with round buttons, the screens are flat cards, and most taps give nothing back. I want to open it and feel like I am jacking into a machine: a road I do not recognise from before, a theme that could sit in Cyberpunk 2077, and a small reward on every single move.

## Solution

One neon skin for the whole app, a rebuilt road, and feedback on every action.

- **Theme.** A single dark neon theme: near-black with a faint grid and scanlines, cyan as the main light, yellow for rewards, magenta for danger. Angled corners, glowing edges, a display typeface for headings and numbers. Farsi keeps Vazirmatn and loses nothing.
- **Road.** The Path becomes a circuit trace: a glowing line that runs node to node in straight runs and 45 degree bends. The part I have finished glows and carries moving light toward the node I am on. Nodes are angular plates with a progress ring; the current one has a turning scanner ring and a START tag.
- **Feedback.** Every tap clicks. A right answer throws sparks, pays a flying Coin, and builds a Combo that climbs in pitch. A wrong answer glitches the screen. XP gained floats up from the bar. A finished Lesson gets a burst and a fanfare.

## User Stories

1. As a player, I want a dark neon theme everywhere, so that the game feels like one place.
2. As a player, I want the road to be a glowing circuit trace, so that the Path is the thing I look at first.
3. As a player, I want the finished part of the road lit and moving, so that I see how far I have come.
4. As a player, I want the current node to stand out with a scanner ring and a START tag, so that I never hunt for where to go.
5. As a player, I want nodes to wander left and right in a wave, so that the road reads as a road, not a list.
6. As a player in Farsi mode, I want the wave mirrored and the text unbroken, so that the right-to-left layout feels native.
7. As a player, I want every button to answer my tap with light and a click, so that nothing feels dead.
8. As a player, I want sparks and a rising tone on a right answer, so that being right feels good.
9. As a player, I want a Combo counter for right answers in a row, so that I try to keep the run alive.
10. As a player, I want a wrong answer to glitch the screen briefly, so that I notice without being punished.
11. As a player, I want XP and Coins to fly and count up, so that I see the reward land.
12. As a player, I want a finished Lesson to feel like a win, so that I start the next one.
13. As a player who mutes sound, I want all sound off, so that I can play anywhere.
14. As a player who asks for reduced motion, I want no animation, particles or shake, so that the game stays comfortable.
15. As a player on a small phone, I want the road and nodes to fit 360 px, so that nothing is cut off.
16. As a keyboard user, I want a clear focus ring on every control, so that I can still play without a mouse.
17. As a player, I want the Disclaimer to stay visible, so that the rule of the game holds.

## Implementation Decisions

- One theme. The light theme is removed; the neon tokens are the only set. Station themes stay as hue changes of the main light.
- The display typeface comes from Google Fonts, the one allowed external host. No external scripts.
- The engine gains a `combo` count: right answers in a row, in Lessons and in Review. A wrong answer resets it. It is not saved. The engine emits a `combo` event from the second right answer on.
- Render lays nodes on a wave by giving each a horizontal offset, mirrored in right-to-left. Render exposes a pure function that turns a list of node centres into the trace path (vertical runs joined by 45 degree bends); it measures the nodes after each paint and on resize and draws three paths: base, lit, flow.
- The fx module owns all effects: sounds, haptics, particles on a full-screen canvas, the flying Coin, the floating XP, the glitch. It reads engine events, the Combo and the change in XP and Coins. It does nothing visual under reduced motion and nothing audible when muted.
- Colours on bright fills use a dark ink token so text on cyan and yellow passes contrast.
- Letter spacing is never applied to Farsi text.

## Testing Decisions

- Engine seam: Combo counts, resets, is not durable, emits its event, works in Review.
- Render seam: the trace function (straight run, bend, short drop fallback), the wave offsets and their mirror in Farsi, the START tag on the current node only, the road markup present on the Path.
- Constraints already tested stay green: no external scripts, only Google Fonts, size cap, reduced motion switches every animation off.
- Effects are checked in a headless browser run with a recording, not unit tested.

## Out of Scope

- New content, new game rules beyond Combo, a settings screen, a light theme.

## Further Notes

The Combo pays nothing. It is feedback only, so it cannot be farmed and does not change the reward rules in the glossary.
