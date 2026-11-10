---
status: accepted
---
# All state in one localStorage key, fi-roadmap-v1

Progress, checklists, journal text, shelf states, language mode and mute setting are one JSON document under the key `fi-roadmap-v1`. Every read and write is wrapped in try/catch so the game runs with storage disabled or full. We chose one key over several so reset is one delete, export is one copy, and a schema change is one version bump in the key name. There is no backend and no sync (grilling decision 13), so a player who changes browsers starts over.

## Consequences

- A schema change means a new key (`fi-roadmap-v2`) and a one-time migration, never an in-place rewrite.
- Return queues (Anki-style) are deliberately not stored (grilling decision 10). Amended by spec 1 (owner decisions 38-39): the Return queue inside a Lesson is still not stored, but the Deck (missed and bookmarked Cards with their Review step and due day) and the day's Review count are stored in the same key.
- Amendment 2026-11-09, after the Prompt 0 play-test: the run position (`run: { stationId, pos }`) is stored so a reload resumes at the same Card. Returns and an in-progress Fare are still not stored.
- Amendment 2026-11-10 (ADR-0009): the v1 to v2 progress migration rewrites the document under the same key on first load. The shape is additive (new Unit ids, no field removed), so a v1 build reading the migrated document still runs; this is the one case where an in-place rewrite is allowed.
- Amendment 2026-11-10 (ADR-0010, owner decision 33): the v2 to v3 migration removes book keys (old Units, Sections, book Checks, book bookmarks) and recomputes XP, under the same key. This is not additive; it is allowed because the owner chose to restart book progress. Basics progress, coins, checklists, journal, habits and shelf are kept.
- Amendment (spec 2): progress can be exported to and restored from a backup file (app tag `fi-roadmap`, format 1, the durable slice). Restore goes through HYDRATE, so migrations apply. Manual transfer only; no sync.
