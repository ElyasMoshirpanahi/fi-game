import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

// Owner request 2026-11-10: bookmark a Card to come back to it later (decision 21).
const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
const fakeStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

describe('Bookmarks', () => {
  it('TOGGLE_BOOKMARK adds a Card once and removes it on the second call', () => {
    let s = R(engine.initial(), { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c3' } });
    expect(s.bookmarks).toEqual([{ stationId: 's1', cardId: 's1c3', text: content.item('s1', 's1c3').text }]);
    expect(s.events).toContain('bookmark');
    s = R(s, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c3' } });
    expect(s.bookmarks).toEqual([]);
    expect(s.events).toContain('unbookmark');
  });

  it('only real Cards can be bookmarked, Checks and unknown ids are ignored', () => {
    let s = R(engine.initial(), { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1k1' } });
    expect(s.bookmarks).toEqual([]);
    s = R(s, { type: 'TOGGLE_BOOKMARK', value: { stationId: 'nope', cardId: 's1c1' } });
    expect(s.bookmarks).toEqual([]);
  });

  it('bookmarks survive a reload', () => {
    const storage = fakeStorage();
    let s = R(engine.initial(), { type: 'TOGGLE_BOOKMARK', value: { stationId: 's2', cardId: 's2c1' } });
    store.save(storage, s);
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) });
    expect(again.bookmarks).toEqual([{ stationId: 's2', cardId: 's2c1', text: content.item('s2', 's2c1').text }]);
  });

  it('OPEN_AT opens the Station at the bookmarked Card and the run continues from there', () => {
    let s = R(engine.initial(), { type: 'OPEN_AT', value: { stationId: 's1', cardId: 's1c3' } });
    expect(s.screen).toBe('station');
    expect(s.stationId).toBe('s1');
    expect(s.current).toBe('s1c3');
    expect(s.phase).toBe('card');
    const idx = content.station('s1').items.findIndex((i) => i.id === 's1c3');
    expect(s.run.pos).toBe(idx);
    s = R(s, { type: 'RATE', value: 'knew' });
    expect(s.current).toBe(content.station('s1').items[idx + 1].id);
  });

  it('OPEN_AT with an unknown Card is ignored', () => {
    const s = R(engine.initial(), { type: 'OPEN_AT', value: { stationId: 's1', cardId: 'nope' } });
    expect(s.screen).toBe('path');
  });

  it('OPEN_BOOKMARKS shows the list screen without starting a run', () => {
    const s = R(engine.initial(), { type: 'OPEN_BOOKMARKS' });
    expect(s.screen).toBe('bookmarks');
    expect(s.queue).toEqual([]);
  });

  it('RESET clears bookmarks', () => {
    let s = R(engine.initial(), { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'RESET' });
    expect(s.bookmarks).toEqual([]);
  });
});
