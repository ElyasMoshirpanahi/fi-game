# ADR-0011: One neon theme, a measured road, and effects owned by fx

Status: accepted (2026-11-10, spec 8, issue #16). Owner request: a cyberpunk look, a road that reads as new, feedback on every move.

## Decision

- **One theme.** The light theme is removed. The neon tokens in `:root` are the only set; Station themes change the hue of the main light. Text on a bright fill uses the `--ink` token, never white.
- **Typeface.** Chakra Petch for headings, numbers and controls, loaded from Google Fonts, the one allowed external host (ADR-0001). In Farsi the display face falls back to Vazirmatn, and letter spacing is switched off for Farsi text because it breaks joined letters.
- **Road.** Nodes sit on a wave: render gives each a horizontal offset (`wave`), mirrored in right-to-left. After each paint render measures node centres and draws the road as an SVG path built by a pure function (`trace`): vertical runs joined by 45 degree bends. It measures layout offsets, not client rectangles, so the camera scale on the list does not skew it, and it redraws when the layout changes size.
- **Combo.** The engine counts right answers in a row (`state.combo`) across Lessons and Review and emits `combo` from the second. It is not durable and pays nothing, so it cannot be farmed and the reward rules do not change.
- **Effects.** fx owns sound, haptics, particles (one full-screen canvas), flying rewards and the glitch. The app tells fx about every player action (`fx.tap`) and gives it the XP and Coins from before each action so gains can be shown. fx does nothing audible when muted and nothing moving under reduced motion.

## Consequences

- The engine stays pure: Combo is plain state and an event. The road geometry is testable without a browser; the drawing and every effect are checked in a headless browser run.
- A second theme would mean a second token set; nothing else is theme-aware.
- The road depends on measurement, so any new thing that moves nodes must cause a layout size change or call the redraw.
