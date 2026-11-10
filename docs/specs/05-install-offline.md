## Problem Statement

I play on my phone, often without a connection. Book Lessons load from the network each time, so on a train a Lesson will not open, and the game lives in a browser tab instead of on my home screen.

## Solution

The game installs to the home screen and works offline. The first visit caches the page; each book is cached the first time I open it, and a "Download all books" button caches the rest so everything works with no connection.

## User Stories

1. As a player, I want to install the game to my home screen with its own icon and name, so that it opens like an app.
2. As a player, I want the Path and Basics to open with no connection, so that the game always starts.
3. As a player, I want a book I have opened once to work offline afterwards, so that my current book travels with me.
4. As a player, I want a button that downloads all books, so that I can prepare before a trip.
5. As a player, I want to see how many books are available offline, so that I know what will work.
6. As a player, I want a new version of the game to replace the cached one on my next visit, so that I am not stuck on old content.
7. As a player, I want a clear message when a book is not available offline, so that I understand why it will not open.
8. As a player, I want the game to keep working exactly as now in a browser without service worker support, so that nothing breaks.

## Implementation Decisions

- Two new same-origin files beside the page: a web app manifest and a service worker, plus an SVG icon. This reverses the PWA part of grilling decision 13 and amends ADR-0001 ("one page plus same-origin data files and a service worker; still no external scripts").
- Cache strategy: the page and manifest are network-first with cache fallback (so updates arrive); book files are cache-first with background refresh. A cache name carries a version that the manifest build bumps, so old caches are dropped on activation.
- The app registers the service worker on load and asks it for the list of cached books; "Download all books" fetches every book URL from the manifest list.
- Fonts from Google are not cached by the worker; the system font fallback already in the styles covers offline.

## Testing Decisions

- The service worker's routing decision is written as a pure function (request URL and cache state in, strategy out) and tested in node. Registration and install are verified in headless Chrome: load, go offline, reload, open a cached Lesson.
- Prior art: the headless Chrome play-test scripts.

## Out of Scope

- Push notifications, background sync, app-store packaging.

## Further Notes

Installing to the home screen is also the usual exemption from Safari's seven-day storage eviction; backup (spec 02) covers the cases where it is not.
