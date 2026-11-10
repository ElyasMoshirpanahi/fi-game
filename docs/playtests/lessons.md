# Play-test: Sections of Circles of Lessons (headless Chrome)

Date: 2026-11-10. The Chrome extension was disconnected, so the check ran in headless Chrome driven over the DevTools protocol (a scratch script, not in the repo). Screenshots: `docs/playtests/lessons/`.

- Fresh storage: 29 Sections, Basics open, picker present.
- Picker to The Psychology of Money: banner reads "3 circles · 12 lessons · ~144 min", 3 segments, 3 Circle nodes.
- Circle 1 "Behaviour, Luck and Time" opened its list: 4 Lessons, each "12 points · ~12 min" with a Start button.
- Start on "No One's Crazy": the book file loaded on demand (no overlay left behind), first Point is the framing Point ("Why this matters"), 1 of 17 items.
- Ran the Lesson through its Checks and Fare: Lesson lit, +10 XP, back on the Path the Circle shows 1/4 lessons and the Lesson row a gold tick with Replay.
- FA: right-to-left, "۳ حلقه · ۱۲ درس · ~۱۴۴ دقیقه", Persian digits throughout.
- Reload: the lit Lesson, XP 10 and FA mode persist.
- Bug found and fixed: the Lesson header's circle and lesson names broke onto separate lines (block spans inside the meta line).
- Console: no errors.
