## Problem Statement

I can often pass a Check without knowing the answer: in two of three tap Checks the correct option is the longest one. And the Fare at the end of a Lesson asks the very same questions I just answered, word for word, so it tests my short-term memory of the wording, not the idea.

## Solution

Tap Checks whose options give nothing away by length, and a Fare that asks each idea in different words than the Check did.

## User Stories

1. As a player, I want the options of a tap Check to be of similar length, so that I cannot guess by picking the longest.
2. As a player, I want the correct option to be the longest no more often than chance, so that length carries no signal.
3. As a player, I want wrong options that are plausible, so that I have to know the idea.
4. As a player, I want the Fare to rephrase each question, so that passing it means I understood.
5. As a player, I want a rephrased Fare question to have the same correct answer as its Check, so that it stays fair.
6. As a player, I want the Hint and fairness rules unchanged, so that a miss is still my own fault.
7. As a player, I want both languages rewritten together, so that Farsi and English ask the same thing.
8. As a content author, I want the validator to reject a Lesson whose tap Checks leak the answer by length, so that the problem cannot return.
9. As a content author, I want the validator to require a Fare wording for every Check, so that no Fare repeats a Check verbatim.

## Implementation Decisions

- Each Check may carry a `fare` prompt (en and fa): the same question in other words. In a Fare the engine-facing item is unchanged; render shows the `fare` prompt when the phase is the Fare. For true/false Checks the `fare` prompt must keep the same truth value.
- Validator rules, per book: for each tap Check the longest option may exceed the shortest by at most 60 percent in English characters; across a Lesson the correct option may be the strictly longest in at most one third of its tap Checks; every Check has a `fare` prompt that differs from its prompt.
- Content is rewritten per book by content agents following an addendum to the content brief, then re-read under the audit brief, since rewording options can introduce errors.
- The Basics Stations get the same treatment by hand, with the same rules asserted by a test.

- As built (after the code review): the rules are measured in both languages. Per Check the longest option may be at most 1.6 times the shortest, with a slack of 8 characters for short options. Per book, and over the Basics Stations as one set, the correct option may be the longest, the shortest, or neither in at most 45 percent of the tap Checks each; chance is a third. The first cut capped only "longest" per Lesson, which moved the signal to the middle option instead of removing it. A `fare` wording that differs from the prompt only in case or punctuation is rejected.
- Review shows a Card's Check with its `prompt`; only the Fare uses the `fare` wording.

## Testing Decisions

- The validator is the seam: fixture books that break each rule must fail; all 28 real books must pass. A reducer test confirms a Fare answer is judged against the same answer as its Check.
- Prior art: the v3 book tests and the advice lint.

## Out of Scope

- New question types; changing the number of Checks per Lesson; adaptive difficulty.

## Further Notes

Item-writing guidance (Haladyna, Downing and Rodriguez) lists "keep choices about equal in length" and "avoid a conspicuously correct choice"; a longer correct option makes items easier.
