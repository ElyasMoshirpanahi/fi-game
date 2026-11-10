# Spec 3 (Check wording) content audit

The first wording pass (`docs/check-wording-brief.md`) gave all 1,065 Checks a second wording for the Fare (1,033 in the books, 32 in the Basics Stations) and reworded the options of 357 tap Checks so length does not point at the answer. The validator can check length and that a `fare` wording exists and differs; it cannot check that the rewording keeps the same answer. So nine second readers re-read every Check beside its source Card under `docs/check-wording-audit-brief.md`.

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

## Second pass (after the code review)

The code review showed the first pass had moved the length signal to the middle option and had not measured Farsi (see `spec3-check-wording-code-review.md`). A second pass reworded the options of 253 tap Checks in the books and 7 in the Basics Stations under the stricter rules. Four second readers then re-read those 253 Checks with their options before and after.

253 Checks read. 10 reported, all fixed:

| Problem | Count | Checks |
| --- | --- | --- |
| Farsi drifted from the English after a one-language rewording | 8 | `b02c2l2k1`, `b15c1l1k3`, `b15c1l2k5`, `b15c2l2k5`, `b15c2l5k6`, `b17c1l1k2`, `b18c1l3k2`, `b24c3l3k5` |
| A wrong option could be read as right | 1 | `b07c2l3k3` |
| Wrong options were jokes or filler | 1 | `b21c1l3k3` |

Correct options changed in the second pass: `s1k5` ("Ownership" to "Ownership and equity", which its Card states) and, in Farsi only and with the same meaning, `b25c2l2k5` and `b17c1l1k2`.

The seven Basics Checks changed in the second pass were read by the supervisor, not by a second reader.

## Limits

The second readers judged from the Cards, not from the books themselves. This pass does not verify facts; that is spec 6.
