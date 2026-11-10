## Problem Statement

All my progress lives in one browser on one device. If I clear site data, switch phones, or the browser evicts storage after a week away, my Coins, XP, lit Lessons, Checklists, journal, Bookmarks and Deck are gone, and I cannot move them to another device.

## Solution

Two buttons under the Path: "Back up progress" downloads one small file; "Restore progress" takes that file (or pasted text) and replaces what is in the browser, after showing me what it contains and asking me to confirm.

## User Stories

1. As a player, I want to download my progress as a file, so that I own a copy outside the browser.
2. As a player, I want the file named with the date, so that I can tell backups apart.
3. As a player, I want to restore from a file, so that I can move to a new phone.
4. As a player, I want to paste backup text when file pickers are awkward on my phone, so that restore always works.
5. As a player, I want a summary before restoring (date, XP, Coins, lit count), so that I do not overwrite newer progress with older.
6. As a player, I want restore to ask for confirmation, so that a stray tap cannot wipe my progress.
7. As a player, I want a bad or foreign file refused with a clear message, so that nothing is corrupted.
8. As a player, I want a backup from an older version of the game to migrate on restore, so that old backups stay useful.
9. As a player, I want the game to remind me gently when my last backup is over 14 days old, so that I do not rely on luck.
10. As a player, I want backup to include everything durable (including notes and the Deck), so that nothing is silently left out.

## Implementation Decisions

- The store module gains two pure functions: one that produces the backup document (the durable slice plus a format tag, the app name and an export date supplied by the caller), and one that validates and parses a backup into a durable slice or an error reason.
- Restore goes through the existing `HYDRATE` path so the same migrations apply to a backup as to stored progress.
- The export date and the "last backup" date are supplied by the app; the engine and store never read the clock.
- Render adds the two controls to the Path foot beside Reset, a paste area, the summary and confirm step, and the reminder line.
- No network: the file is created in the browser and downloaded locally. ADR-0003 gains a note; decision 13 (no cross-device sync) stays true, this is manual transfer.

## Testing Decisions

- Test at the store seam: round trip (export then parse equals the durable slice), refusal of wrong app tag, wrong version, non-JSON and arrays, migration of a v2-shaped backup through HYDRATE.
- Prior art: the store tests with fake storage.

## Out of Scope

- Automatic or cloud sync, accounts, merging two progress files.

## Further Notes

Safari caps script-writable storage at seven days without a visit unless the site is installed to the home screen; reports on the exemption are mixed. Backup removes the dependency either way.
