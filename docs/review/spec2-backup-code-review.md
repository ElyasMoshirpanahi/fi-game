# Spec 2 (backup and restore) code review

Reviewed `main...feat/backup` on two axes (Standards, Spec) by a separate agent, which also ran hostile backups against the test seam. Disposition of each finding:

## Fixed

- **A damaged backup could break the game for good.** Only the app tag, format and version were checked, so `"lit": null` was accepted, saved, and then crashed render on every load. Every durable key now has a shape rule in the engine. A backup that fails any rule is refused whole ("damaged"); a saved document drops the bad key and loads the rest.
- **Script injection through a shared backup.** `xp` and the slider values reached markup unescaped. The shape rules now require numbers, and both sinks coerce to a number as well.
- **"Progress restored." could show when nothing was restored.** The note is now driven by the engine's `restored` event, and it clears on the next move.
- **Typing in the paste field lost focus on every key.** Typing now updates only the verdict below the field.
- **The reminder was wrong after a restore.** `lastBackup` came from the file. A restore now counts as a backup made today.
- **The summary was read from the file before migration.** It is now what the restore will give (`engine.preview`). This found a second defect: `HYDRATE` changed the object it was given, so showing the summary altered the backup about to be restored. `HYDRATE` now works on a copy.
- **Loose `format` check.** `format` must be a whole number of 1 or more; a missing one is "not a backup", not "newer version".
- **File picker.** An unreadable file and a file over 2 MB are refused with the same message; file text no longer goes into the paste field.
- **Confirm step.** It has a label, and focus moves to it after a file is chosen.
- **Farsi.** The export date uses Persian digits in FA.
- **Standards.** The store comment is current; the 14 day rule is a named constant behind `engine.backupNudge`; the restore verdict is one function.

## Accepted, not changed

- **A blocked download still counts as a backup.** A browser gives a page no signal that a download was saved. In an in-app web view the reminder can go quiet without a file. The paste path still restores; a "copy backup text" button would close the gap and is noted for spec 7.
- **The Deck count in the summary and restoring Language Mode and mute** were not in the spec. Kept: the count helps tell backups apart, and a backup is "everything durable" (story 10).
- **The confirm markup repeats the reset confirm.** Two uses; left until a third appears.
