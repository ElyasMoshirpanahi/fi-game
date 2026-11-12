## Problem Statement

The game has no navigation. Review, the Shelf and Bookmarks are three small buttons at the top of the Path; backup, offline, install and reset are at the very bottom of a long page; my progress has no page at all. On a phone my thumb has nothing to hold on to, and on a desktop there is no menu.

## Solution

A navigation with five destinations: Learn (the Path), Review, Shelf, Bookmarks and Profile. On a phone it is a floating bar fixed to the bottom of the screen, like Duolingo. On a tablet it is a narrow rail of icons on the left, and on a desktop a labelled sidebar on the left with the game's name on top. Profile is a new screen that holds my numbers, my Badges and everything about the device: Language Mode, sound, backup and restore, offline and install, reset.

## User Stories

1. As a phone player, I want a bar at the bottom of the screen with Learn, Review, Shelf, Bookmarks and Profile, so that every part of the game is one thumb tap away.
2. As a phone player, I want the bar to float above the page with the current destination highlighted, so that I always know where I am.
3. As a phone player, I want the bar to respect the home-indicator area of my phone, so that the system gesture bar does not cover it.
4. As a phone player, I want the Review item to show how many Cards are due, so that I see it without opening Review.
5. As a phone player, I want the bar hidden while I am inside a Lesson or a Review run, so that the answer buttons have the whole screen and I cannot leave by accident.
6. As a phone player, I want the Disclaimer still visible with the bar, so that the rule "always visible" holds.
7. As a tablet player, I want the navigation as a rail of icons on the left, so that the Path keeps the width.
8. As a desktop player, I want a sidebar on the left with icons and labels and the game's name on top, so that it looks like an application.
9. As a desktop player, I want the sidebar to stay put while the page scrolls, so that navigation never scrolls away.
10. As a player, I want a Profile screen with my XP, Coins, Sections lit, Lessons lit and Bookmarks, so that my progress has a home.
11. As a player, I want my Badges listed on the Profile, so that I can see what I have earned.
12. As a player, I want Language Mode and sound on the Profile as well as in the top bar, so that settings are where I expect them.
13. As a player, I want backup and restore on the Profile, so that they are not at the bottom of the Path.
14. As a player, I want offline download and install on the Profile, so that device matters are in one place.
15. As a player, I want reset on the Profile behind its confirm step, so that it is hard to hit by accident.
16. As a player who has never backed up, I want the Profile item to carry a small dot, so that the backup reminder is not lost by moving it.
17. As a player, I want the Path to end with the last Section, so that it is only the road.
18. As a Farsi reader, I want the navigation mirrored and labelled in Farsi, so that it reads right-to-left.
19. As a screen reader user, I want the navigation to be a labelled landmark with the current destination marked, so that I can find and use it.
20. As a keyboard user, I want every destination reachable by Tab with a visible focus ring, so that I can navigate without a mouse.
21. As a returning player, I want my saved progress to load exactly as before, so that the new navigation costs me nothing.

## Implementation Decisions

- The engine gets one new screen, Profile, and one action to open it, built like the Bookmarks screen: it ends any run the same way and holds no state of its own. The screen is not durable; a reload opens the Path, as today.
- Render writes one navigation block on every screen. It is the same markup at every width: a landmark with five buttons, each an icon and a label, with the current one marked. CSS makes it a bottom bar below 700 px, an icon rail from 700 px and a labelled sidebar from 1100 px.
- Which destination is current: Path is Learn; Review is Review; the Tools screen of the Library is Shelf (any other Tools screen is Learn); Bookmarks is Bookmarks; Profile is Profile; a Lesson and Notes are Learn.
- On a Lesson or a Review run in progress the navigation is hidden at phone width. At tablet and desktop width it stays.
- The three buttons at the top of the Path (Review, Shelf, Bookmarks) are removed; the navigation replaces them. Continue and search stay.
- The backup panel, the offline panel and reset move from the Path to the Profile screen, with their behaviour and their partial updates unchanged.
- The Disclaimer stays fixed at the bottom. At phone width it sits directly above the bar; from tablet width it sits at the bottom of the main column.
- The jump-to-section button stops being fixed above the bottom edge and becomes a button beside the search field; its sheet opens above the bar.
- All new copy (Learn, Profile, Badges, the stat labels) is in the i18n table in both languages (ADR-0002).

## Testing Decisions

- A good test opens a destination the way a tap does and checks what the player gets, not how the bar is built.
- Seam one, the reducer: the open-Profile action sets the screen, ends a run like the other screens do, and Back returns to the Path; the screen never reaches saved progress.
- Seam two, the render output: every screen writes the navigation with five destinations and exactly one current; the Review item carries the due count; the Path no longer writes the backup, offline or reset controls and the Profile does; the restore flow of the backup tests passes on the Profile.
- Seam three, the headless browser run at 360, 820 and 1366 px: the bar is at the bottom at 360 and at the side from 820; no control is covered by the bar or the Disclaimer at the end of each screen; every destination is at least 44 px.
- Prior art: `test/bookmarks.test.mjs`, `test/render-smoke.test.mjs`, `test/backup.test.mjs`, `scripts/playtest/phone-pass.mjs`.

## Out of Scope

- Accounts, sign-in, avatars or a public profile. Leaderboards, friends, a shop. Routing by URL or a working browser Back button.

## Further Notes

Owner request of 2026-11-13, naming Duolingo and Brilliant as the model. Seen on Duolingo at desktop width: a left sidebar with Learn, Practice, Leaderboards, Quests, Shop, Profile and More, and the same destinations as a bottom bar on the phone app. The right rail and the grid are spec 10.
