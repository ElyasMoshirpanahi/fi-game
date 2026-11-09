---
status: accepted
---
# Every string lives in one i18n object

All player-visible text, including card content parsed from the source HTML, lives in `i18n = { fa: {...}, en: {...} }` keyed by stable IDs. No text is hard-coded in markup. The source is Farsi only, so the English half is a translation written during the build and reviewed by the owner (grilling decision 2). We chose this so a test can prove every key exists in both languages, and so a wrong translation is a one-line fix.

## Consequences

- Key parity between `fa` and `en` is a mandatory test.
- Terms the source keeps in Latin script (VWCE, DCF, Box 3, book titles) are stored once and shared, not translated.
