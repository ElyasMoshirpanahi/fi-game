## Problem Statement

With 29 Sections and 196 Lessons I lose my place: opening the game I have to find my book, open its Circle and find the next Lesson. I cannot look up a term I half remember. And the game has only ever been checked at desktop size in a headless browser, not at my phone's 360 px.

## Solution

A Continue button that takes me to my next Lesson in one tap. A search box over every Lesson title and every Card I have already loaded or reviewed. A phone-width pass that fixes whatever overflows or crowds at 360 px.

## User Stories

1. As a player, I want a Continue button at the top of the Path naming my next Lesson, so that one tap resumes my learning.
2. As a player, I want Continue to pick the first unlit Lesson of the Section I last played, so that it follows me, not the list order.
3. As a player, I want Continue to fall back to the next unlit Station or Lesson in Path order when I have no history, so that it always has an answer.
4. As a player, I want Continue to say "Everything is lit" when nothing remains, so that the button is honest.
5. As a player, I want to search for a word and see matching Lessons with their book and Circle, so that I can find where an idea lives.
6. As a player, I want search to match Card text in books already available on this device, so that I can find a specific Point.
7. As a player, I want search to work in English and Farsi, so that I can look up either vocabulary.
8. As a player, I want tapping a result to open that Lesson (at that Card when it matched a Card), so that search leads somewhere.
9. As a player, I want every screen to fit 360 px with no sideways scroll, so that the game is comfortable on my phone.
10. As a player, I want tap targets of at least 44 px, so that I do not mis-tap.
11. As a player, I want the fixed picker button and the disclaimer never to cover a control I need, so that nothing is unreachable.

## Implementation Decisions

- The engine records the last Section played as a durable field; a pure selector in content-plus-state terms returns the Continue target. Render shows the button in the Path bar.
- Search is a pure function over the manifest (Lesson and Circle titles, book titles) and over loaded books' Cards; results carry what to open. Render adds a search field to the Path bar and a results list.
- The phone pass is done in headless Chrome at 360 by 740: an automated check that no element is wider than the viewport on each screen, plus screenshots reviewed by eye; fixes are CSS.
- The owner's own read of the Farsi (grilling decision 2) cannot be done by an agent and stays with the owner.

## Testing Decisions

- Reducer and selector seam for Continue (history, fallback, all lit) and for search (title match, Card match, Farsi match, result targets).
- The 360 px overflow check runs in the headless script and its result is recorded in the play-test notes.
- Prior art: lessons tests, render smoke test, the headless play-test scripts.

## Out of Scope

- Fuzzy or ranked search; searching books not yet loaded on this device; a redesign.

## Further Notes

Search over unloaded books becomes complete once "Download all books" (spec 05) has run.
