# Spec 3 (Check wording) code review

Reviewed `main...feat/questions` on two axes (Standards, Spec) by a separate agent, with node probes over all 28 books and the Basics Stations. Disposition of each finding:

## Fixed

- **The length signal had moved, not gone.** The first cut capped only how often the correct option was the longest, per Lesson. Measured over 566 tap Checks, the correct option was the longest in 9.5 percent, and "pick the middle-length option" was right 50.9 percent of the time against a chance of 33.3. The rule is now a balance: per book, and over the Basics Stations as one set, the correct option may be the longest, the shortest, or neither in at most 45 percent of tap Checks each. A second content pass reworded 253 tap Checks to meet it.
- **Farsi was not measured.** 139 tap Checks would have failed the spread rule in Farsi. Both rules now apply in English and in Farsi.
- **A Fare wording equal to the prompt except for case or punctuation passed.** Wordings are now compared without case, spacing and punctuation.
- **One rule, four statements that disagreed** (spec, brief, audit brief, validator). The numbers are named constants with their reasons in the validator; the spec has an "as built" note; the briefs state the same numbers.
- **Ties and one-rank Lessons escaped.** A tie counts as "neither", which the balance rule caps.
- **Standards.** ADR-0008 has its amendment; the glossary defines Fare wording; the validator and the test say "Check", not "question"; the tautology test is gone; the slack, ties, small sets and Farsi each have a test.

## Result after the second pass

Correct option's length rank over all 566 tap Checks:

| | longest | shortest | neither |
| --- | --- | --- | --- |
| English | 28.4% | 33.9% | 37.6% |
| Farsi | 29.0% | 35.3% | 35.7% |

No Check fails the spread rule in either language. The best rule of thumb now gains about four points over chance.

## Accepted, not changed

- **Review shows the prompt, never the Fare wording.** The spec asks for the second wording in the Fare only. A Deck entry is a snapshot and stays small.
- **A repeated Fare shows the same Fare wording again.** A third wording per Check was not asked for.
- **A book with fewer than six tap Checks is exempt from the balance rule.** Shares mean little in a set that small; the spread rule still applies to each Check.
- **`checkWording` skips a malformed tap Check.** `validateBook` and the fairness tests report those; reporting them twice adds noise.
- **Small duplicated test helpers** (`toFare`, `html`). Left until a shared test helper file is worth its own change.
