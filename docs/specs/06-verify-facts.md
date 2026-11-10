## Problem Statement

The accuracy audit read every Card, but from memory of the books. Its record lists specific figures, quotes and edition questions nobody confirmed. I am learning from these Cards and repeating them to others; I need to know which claims are verified and which are not.

## Solution

Every item on the audit's unverified list is checked against a source that can be cited: the author's own site or published text where freely available, the publisher, or a reputable secondary source that quotes the passage. Each item ends as verified (with its source), corrected, or cut. Each book states which edition its Lessons follow.

## User Stories

1. As a player, I want every specific number in a Card to be confirmed or removed, so that I do not memorise a wrong figure.
2. As a player, I want quotes to be the author's actual words or marked as paraphrase, so that I do not misquote.
3. As a player, I want each book to name the edition its chapter numbers follow, so that I can find the passage.
4. As a player, I want content that exists only in later editions labelled as such, so that my older copy does not confuse me.
5. As a player, I want a record of what was checked and against what, so that I can trust or re-check it.
6. As a player, I want items that could not be verified anywhere softened to what is certain or cut, so that nothing doubtful stays stated as fact.
7. As a maintainer, I want the unverified list to shrink to zero or to a short, explicit residue, so that the remaining risk is known.

## Implementation Decisions

- Work per book from the "could not verify" lists in the audit reports, with web search allowed and sources recorded as URLs.
- Each book file gains an `edition` field (text, for example "2nd edition, 2013"), shown in the Section banner; the validator requires it.
- Results are recorded per item in a verification record: id, claim, verdict (verified, corrected, cut, unverifiable), source URL.
- Corrections follow the audit brief (both languages, shape preserved, validator green).

## Testing Decisions

- The validator requires `edition` on every book. The verification record is checked by a test for one row per listed item and a source URL on every "verified" row.
- Prior art: the research file from Step 3 of the playbook (verdict table with sources).

## Out of Scope

- Re-auditing Cards the first audit did not flag; buying or scanning book texts.

## Further Notes

Paul Graham's essays, Buffett's letters, the Almanack of Naval Ravikant and Damodaran's material are freely published by their authors and can be checked directly.
