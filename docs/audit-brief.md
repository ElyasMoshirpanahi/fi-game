# Accuracy audit brief

For agents auditing one `content/books/v3/<id>.json`. The validator checks shape only; you check truth. Read docs/content-brief-v3.md for the content rules.

Read every Card and every Check of the book. For each, ask:

1. **True to the book?** Does the book actually say this (idea, example, name, number, chapter)? Fix or remove anything invented, misattributed, or stated more strongly than the author does. If you are not confident a specific number, date or quote is in the book, soften it to what you are sure of or cut it.
2. **Outside the book?** A fact that is not from the book (a law, a company form, a recent event) must go, unless it is in an applied Point that clearly speaks about the player's roadmap and is certainly true. When in doubt, cut it.
3. **Advice?** No Card may tell the player to buy, sell, hold or keep a named product, or what to do at a named broker. Describe what the book or the roadmap says instead.
4. **Checks fair and right?** The marked answer is correct, the wrong options are clearly wrong, a true/false statement is unambiguous.
5. **Farsi matches English?** Same meaning, natural Persian, Persian digits.

Fix in place, in both `en` and `fa`. Keep ids, keep the shape; if you remove a Point, replace it with a true one so counts and cadence stay valid. Run `node scripts/validate-book-v3.mjs content/books/v3/<id>.json` until OK. Touch no other file.

Reply with: the book id; how many Cards and Checks you read; a list of every item you changed as `id: what was wrong`; anything you could not verify and left; validator result.
