# Check wording brief (spec 3)

Addendum to `docs/content-brief-v3.md`. One job per book file: make the Checks fair by length and give every Check a second wording for the Fare. Nothing else changes.

## What to change in `content/books/v3/bNN.json`

1. **Every Check gets a `fare` field**, `{ "en": "...", "fa": "..." }`, placed right after `prompt`. It asks the same thing as `prompt` in other words.
   - Same idea, same correct answer, same difficulty. A player who understood the Card answers both; a player who memorised the wording of `prompt` gets no help.
   - Change the angle, not only a word: ask for the consequence instead of the cause, the example instead of the rule, the reverse direction.
   - **True/false Checks:** the `fare` statement must have the same truth value as `prompt`. If `answer` is `false`, the reworded statement must still be false, and false for the same reason.
   - **Tap Checks:** the options are shared by both wordings, so the `fare` wording must be answered by the same option.
   - **Order Checks:** reword the instruction; the order asked for stays the same.
   - English and Farsi must both differ from the `prompt`. The Farsi is written as Farsi, not translated word for word. Book titles, author names and terms such as ETF stay in Latin letters, as elsewhere in the file.

2. **Tap options must not leak the answer by length, in English or in Farsi.**
   - **Per Check, each language:** the longest option may be at most 1.6 times the shortest. A difference of 8 characters or fewer is always fine (short options such as "€2k" and "€20k").
   - **Per book, each language:** over all tap Checks of the book, the correct option may be the longest in at most 45 percent, the shortest in at most 45 percent, and neither in at most 45 percent. Aim for about a third each. A book with fewer than 6 tap Checks is exempt. This is what stops "never pick the longest" or "pick the middle one" from working.
   - Fix it by rewording the wrong options: a few words more or fewer, with plausible detail. Wrong options must be plausible to someone who did not read the Card and clearly wrong to someone who did. No joke options, no "all of the above".
   - The correct option must still be worded in its source Card (the validator checks that its English words appear there), so change it only when nothing else works.
   - English and Farsi must say the same thing. Farsi lengths are counted in Farsi characters, so check both languages after each change.

## What must not change

- Top-level fields (`id`, `title`, `author`, `year`, `why`, `badge`, `stage`, `must`, `tier`, `complexity`).
- Card text, ids, the order of items, `source`, `type`, `answer`, the number of options, Lesson and Circle titles.
- The meaning of any option. If you find an option or Card that is factually wrong, do not fix it: report it.
- No advice wording ("you should buy"). The game is educational.

## How to work

- Read the whole file first. Write the changes with a small script (read JSON, apply a map keyed by Check id, write JSON with two-space indent and a final newline) so the file stays valid. Keep your script outside the repo.
- Then run `node scripts/validate-book-v3.mjs content/books/v3/bNN.json` until it prints `OK`.
- Touch only your own book file. Do not run git commands.

## Report

One short paragraph: Checks given a `fare` wording, tap Checks reworded, anything you found that looks factually wrong (Check id and why), and the validator's last line.
