# Spec 8 (neon overhaul) code review

Reviewed `main...feat/neon` on two axes (Standards, Spec) by a separate agent, with node probes for Combo, the road functions, markup and contrast. Effects and performance were reviewed by reading the code. Disposition of each finding:

## Fixed

- **Restoring a backup flew "+N XP" as a reward.** Gains are shown only for a move that earned them.
- **A browser without the Web Animations API left the flying text on screen and skipped the sound.** `fly` now checks first.
- **Focus ring clipped on Section headers, and hidden on an open Circle.** Both have their own focus rule.
- **Rating a Card in Review fed the Combo, and "didn't know" fired the glitch.** A rated Card moves on the ladder and nothing else; only answers count.
- **Haptics ignored mute.** Mute now silences sound and vibration.
- **XP did not count up.** The bar replays from its old width on a gain, and the number marks the gain.
- **Combo was a chip on one screen.** It is now one counter pinned under the top bar on every Lesson, Fare and Review screen.
- **Smooth scrolling ignored reduced motion.** It now follows the setting.
- **The unlit road was nearly invisible.** Brighter trace tokens.
- **The current node's glow was clipped at 360 px.** The wave is narrower (74 px).
- **Reward text was hard-coded in fx.** It comes from render in the Language Mode, with its digits.
- **The glossary avoids "streak"; a particle field used it.** Renamed.
- **Sparks stayed cyan in a red or amber Station.** fx reads the theme tokens of the screen on show.
- **Coin feedback was drawn three times.** The second "+1" in the top bar is gone.
- **Raw colours outside the tokens.** The repeated surfaces are tokens now.
- **Leftovers.** Dead selectors (`.unum`, `.wrongpick`, `.coins .plus`), the unstyled `idle` class, an unread `before.coins`, a redundant reset, and the stale fx comment are removed.
- **Performance.** The grid moves by transform instead of background position; the current node no longer animates two filters.
- **Jump button and sheet were not actually fixed** (already on main): a later blanket rule made them relative. Excluded from it.

## Accepted, not changed

- **320 px.** Labels can clip below 360 px. The spec's floor is 360 px.
- **Dash animations repaint a tall SVG.** Kept: the moving light on the road is the point of story 3. It is off under reduced motion.
- **A few one-off colour values remain** (shadows, the white flow line). They are not theme surfaces.
