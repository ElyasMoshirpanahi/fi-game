# Spec 3 (better questions) content audit

The questions pass (`docs/questions-brief.md`) gave all 1,065 Checks a second wording for the Fare (1,033 in the books, 32 in the Basics Stations) and reworded the options of 357 tap Checks so length does not point at the answer. The validator can check length and that a `fare` wording exists and differs; it cannot check that the rewording keeps the same answer. So nine second readers re-read every Check beside its source Card under `docs/questions-audit-brief.md`.

## Result

1,065 Checks read. 19 reported, all fixed:

| Problem | Count | Checks |
| --- | --- | --- |
| Wording or an option gives the answer away, or a wrong option is a joke | 14 | `b03c2l1k5`, `b06c3l2k4`, `b07c3l3k1`, `b10c1l2k2`, `b11c1l4k5`, `b11c2l1k4`, `b11c2l3k4`, `b11c2l3k6`, `b11c2l5k2`, `b12c2l4k1`, `b13c1l3k3`, `b13c1l3k5`, `b21c1l3k2`, `s2k7` |
| Not answerable from the source Card alone | 2 | `b27c1l3k3`, `b27c1l4k1` |
| Two options read as right | 1 | `b15c3l5k5` |
| Farsi says something else than the English | 1 | `b10c1l4k1` |
| States something the Lesson does not | 1 | `b03c2l2k3` |

No Check was found whose Fare wording has a different answer or a different truth value than its prompt.

## Also fixed (older than this pass, reported by the writers)

- `b02c2l3k4` pointed at Card p10; the fact is on p9, so its Hint sent the player to the wrong Card.
- `b07c3l1k4` credited Bogle for the roadmap's own point about broker apps.
- `b11c2l1k3` used a second Farsi term for enterprise value.

## Integrity

A comparison of every book file with its committed version before the pass: nothing changed except `fare` (new) and tap `options` wording, plus the three fixes above. Card text, ids, answers, order and top-level fields are untouched.

## Limits

The second readers judged from the Cards, not from the books themselves. This pass does not verify facts; that is spec 6.
