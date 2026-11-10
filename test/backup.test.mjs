import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 2 (issue #9): back up and restore progress as one file. No network, no clock in store or engine.
const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = reducer(engine, content);
const played = () => R(engine.initial(), { type: 'TICK', value: 20000 }, { type: 'SET_MODE', value: 'FA' },
  { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'ANSWER', value: content.item('s1', 's1k1').answer }, { type: 'BACK_TO_PATH' },
  { type: 'TOGGLE_CHECK', value: { list: 'before', index: 0 } });

describe('Backup document', () => {
  it('holds the app tag, a format number, the export date and the whole durable slice', () => {
    const s = played();
    const doc = JSON.parse(store.backup(s, '2026-11-10'));
    expect(doc.app).toBe('fi-roadmap');
    expect(doc.format).toBe(1);
    expect(doc.exported).toBe('2026-11-10');
    expect(doc.data).toEqual({ v: 1, ...store.durable(s) });
    expect(Object.keys(doc.data)).toEqual(expect.arrayContaining(['deck', 'bookmarks', 'checklists', 'coins']));
  });

  it('round trips: parse(backup(state)) gives the durable slice and a summary', () => {
    const s = played();
    const r = store.parseBackup(store.backup(s, '2026-11-10'));
    expect(r.ok).toBe(true);
    expect(r.data).toEqual(store.durable(s));
    expect(r.summary).toEqual({ exported: '2026-11-10', xp: s.xp, coins: s.coins, lit: 0, deck: 1 });
  });

  it('refuses text that is not JSON, not an object, from another app, or a newer format', () => {
    expect(store.parseBackup('{nope').reason).toBe('not-json');
    expect(store.parseBackup('[1,2]').reason).toBe('not-backup');
    expect(store.parseBackup(JSON.stringify({ app: 'other', format: 1, data: { v: 1 } })).reason).toBe('not-backup');
    expect(store.parseBackup(JSON.stringify({ app: 'fi-roadmap', format: 99, data: { v: 1 } })).reason).toBe('newer-format');
    expect(store.parseBackup(JSON.stringify({ app: 'fi-roadmap', format: 1, data: { v: 7 } })).reason).toBe('not-backup');
    expect(store.parseBackup('').reason).toBe('not-json');
  });
});

describe('RESTORE', () => {
  it('replaces progress with the backup, keeps today, and reports the event', () => {
    const source = played();
    const data = store.parseBackup(store.backup(source, '2026-11-10')).data;
    let s = R(engine.initial(), { type: 'TICK', value: 20050 }, { type: 'OPEN_STATION', value: 's3' });
    s = R(s, { type: 'RESTORE', value: data });
    expect(s.mode).toBe('FA');
    expect(s.coins).toBe(source.coins);
    expect(s.checklists.before[0]).toBe(true);
    expect(s.deck.s1c1).toBeTruthy();
    expect(s.today).toBe(20050);
    expect(s.screen).toBe('path');
    expect(s.events).toContain('restored');
  });

  it('an old backup with whole-book or Unit keys migrates on restore', () => {
    const old = { v: 1, xp: 90, coins: 5, lit: { s1: true, b01u1: true }, farePassed: { s1: true, b01u1: true }, rings: { s1: 1, b01u1: 2 }, awarded: {}, bookmarks: [] };
    const r = store.parseBackup(JSON.stringify({ app: 'fi-roadmap', format: 1, exported: '2026-11-09', data: old }));
    const s = R(engine.initial(), { type: 'RESTORE', value: r.data });
    expect(s.lit).toEqual({ s1: true });
    expect(s.xp).toBe(content.station('s1').xp);
  });

  it('BACKUP_DONE records the day; backupAge tells how stale the last backup is', () => {
    let s = R(engine.initial(), { type: 'TICK', value: 20000 });
    expect(engine.backupAge(s)).toBeNull();
    s = R(s, { type: 'BACKUP_DONE' });
    expect(s.lastBackup).toBe(20000);
    expect(store.durable(s).lastBackup).toBe(20000);
    expect(engine.backupAge(R(s, { type: 'TICK', value: 20015 }))).toBe(15);
  });
});
