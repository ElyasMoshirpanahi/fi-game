---
status: accepted
---
# All state in one localStorage key, fi-roadmap-v1

Progress, checklists, journal text, shelf states, language mode and mute setting are one JSON document under the key `fi-roadmap-v1`. Every read and write is wrapped in try/catch so the game runs with storage disabled or full. We chose one key over several so reset is one delete, export is one copy, and a schema change is one version bump in the key name. There is no backend and no sync (grilling decision 13), so a player who changes browsers starts over.

## Consequences

- A schema change means a new key (`fi-roadmap-v2`) and a one-time migration, never an in-place rewrite.
- Return queues (Anki-style) are deliberately not stored (grilling decision 10).
- Amendment 2026-11-09, after the Prompt 0 play-test: the run position (`run: { stationId, pos }`) is stored so a reload resumes at the same Card. Returns and an in-progress Fare are still not stored.
