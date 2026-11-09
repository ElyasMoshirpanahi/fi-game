# UI prototype verdict: the sectioned Path

Date: 2026-11-10. Prototype: `prototypes/ui-sections.html` (kept on branch `prototype/ui-sections`), two structurally different looks switchable by `?variant=`.

## Question

With Basics plus 28 book Sections (90 Units) on one Path, what should the home screen look like?

- A: one long road; inline section headers; finished Sections collapsed to one line; a fixed "Jump to section" button opening a bottom sheet.
- B: a horizontal row of section tabs; one Section on screen at a time with a book banner (cover mark, title, author, year, count) and previous/next buttons.

## Verdict (owner, decision 29)

A's long road with B's banner as the header of the open Section, plus A's bottom sheet. Reason given: keep the single zigzag road feel while giving each book a visible identity when it is the one being played.

## What was folded into index.html

- Sections rendered as collapsible blocks with a header; the open Section's header is the banner; finished Sections show a check mark and the badge.
- A fixed picker button above the disclaimer opens a sheet of all 29 Sections with counts; tapping one opens and scrolls to it.
- The Shelf and the reading order jump to a Section instead of opening a unit.
