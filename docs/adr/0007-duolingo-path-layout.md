---
status: accepted
---
# The look is the Duolingo zigzag path, polished

Three structurally different looks were prototyped on real Station 1 and 2 content (`prototypes/ui-variations.html`, kept on branch `prototype/ui-variations`): A, a Duolingo zigzag path of round nodes; B, a Brilliant-style lesson with a chapter sidebar and an interactive pane; C, a Farsi-first editorial page. The owner first picked B, then overruled it the same day in favour of A with the instruction "the zigzag road, but polished". The Path is a vertical zigzag of six round Station nodes with a Ring around each, a Badge on Lit Stations, and a pulsing current node; a Card or Check opens as its own screen with large tap targets and a feedback bar. "Polished" means: consistent spacing on a 360 px phone, restrained motion (lift, pulse, ring ease), a real palette rather than stock green, and interactives (Station 1 sliders) inside the Card screen rather than a lesson pane.

## Consequences

- Phone-first. Desktop centres the same column at about 480 px wide.
- The Ring is a real circle around the node, matching the glossary.
- Coins and XP live in a sticky top bar with the Language Mode toggle.
- The Brilliant-style embedded interactive from B is still allowed inside a Card screen (Station 1 sliders), it just does not define the layout.

## Amendment 2026-11-10 (decision 29)

The Path is now a list of Sections (ADR-0009). Each Section keeps the zigzag of round nodes inside it; finished Sections collapse to a one-line header, the open Section's header is a book banner (cover mark, title, author, year, the source's "why" line, unit count, badge when complete), and a fixed "Jump to section" button opens a bottom sheet listing all Sections. Chosen over a tabbed one-section-at-a-time view to keep the single road feel.
