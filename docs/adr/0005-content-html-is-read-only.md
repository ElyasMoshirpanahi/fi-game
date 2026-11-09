---
status: accepted
---
# The source HTML is never edited; corrections live in the game copy

`content/financial_independence_roadmap_clean.html` is the frozen original. When `docs/research/roadmap-facts.md` shows a claim is wrong or needs nuance and the owner approves a change, the change is made in the game's i18n strings only, and the research file records the original wording, the new wording, the source and the owner's decision. We chose this so the diff between "what the roadmap said" and "what the game teaches" is always visible, and so the owner, not the executor, decides what the player reads (grilling decision 12).

## Consequences

- Nothing may be deleted from the game that exists in the source unless the owner approves it.
- The research file is the source of truth for finance content during code review.
