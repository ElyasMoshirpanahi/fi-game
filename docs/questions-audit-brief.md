# Questions audit brief (spec 3)

A second reader checks the wording added by `docs/questions-brief.md`. Read-only: you change no file in the repo.

For every Check in your books, read its source Card (`source`), its `prompt`, its `fare`, its options and its `answer`. Report a Check only when one of these is true:

1. **Different answer.** The `fare` wording is not answered by the same `answer` as the `prompt`. For true/false: the `fare` statement has a different truth value, or is true or false for a different reason than the Card gives.
2. **Not answerable from the Card.** The `fare` wording asks for something the source Card does not say.
3. **Two right options, or none.** After the rewording a wrong option became true, or the correct option stopped being correct.
4. **Languages disagree.** The Farsi of the `fare` or of an option says something different from the English.
5. **Gives it away.** The `fare` wording contains the answer, or an option is a joke that no one would pick.
6. **Advice or a wrong fact.** A wording tells the player what to buy, or states something false.

Do not report style preferences. A Check with none of the six problems is not reported.

## Output

Write one JSON file (path given in your task), an array:

```json
[{ "id": "b01c1l1k3", "problem": 1, "why": "one sentence", "fix": { "fare": { "en": "...", "fa": "..." } } }]
```

`fix` holds only what must change: `fare`, and/or `options` (the full array, same count and order, the correct one at the same index and still worded in its source Card; the longest English option at most 1.6 times the shortest). Farsi is written as Farsi; names and terms such as ETF stay in Latin letters. An empty array is a valid result.

Then report in under 80 words: Checks read, Checks reported by problem number, and anything you could not judge.
