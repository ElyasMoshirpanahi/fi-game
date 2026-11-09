---
status: accepted
---
# The look is the Brilliant lesson layout, not the Duolingo path

Three structurally different looks were prototyped on real Station 1 and 2 content (`prototypes/ui-variations.html`, kept on branch `prototype/ui-variations`): A, a Duolingo zigzag path of round nodes; B, a Brilliant-style lesson with a chapter sidebar and an interactive pane; C, a Farsi-first editorial page. The owner chose B. The Path becomes a sidebar (a top strip on phones) of six Stations with thin progress bars, and the lesson pane holds the Card, any interactive (sliders in Station 1) and the Check with a Check button. This overrides the "vertical path of nodes" wording in Prompt 0; the loop, rewards and fairness rules are unchanged.

## Consequences

- The Ring from the glossary is rendered as a thin bar in the sidebar, not a circle. The glossary term stays.
- Phone layout at 360 px collapses the sidebar into a horizontal strip above the lesson pane.
- Coins and XP live in the lesson pane header, not in a game-style top bar.
