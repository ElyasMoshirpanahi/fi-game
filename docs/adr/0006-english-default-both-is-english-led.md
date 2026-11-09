---
status: accepted
---
# English is the default Language Mode; Both mode is English-led

The source is Farsi, and the obvious default would be FA with `dir="rtl"`. The owner chose EN as the default and, following from that, Both mode shows English on top with Farsi beneath in a left-to-right page, each Farsi line isolated as RTL (grilling decisions 3 and 8). The reason is that the finance vocabulary being learned is English, and the owner's reading habit is English-first. FA mode remains a full right-to-left rendering with Persian digits.

## Consequences

- Both mode uses Latin digits.
- RTL correctness must be tested in FA mode specifically, since it is no longer the default path.
