import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);

const fakeStorage = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
};
const brokenStorage = () => ({
  getItem() { throw new Error('SecurityError: storage disabled'); },
  setItem() { throw new Error('QuotaExceededError'); },
  removeItem() { throw new Error('SecurityError'); },
});

describe('State round-trips through localStorage under the key fi-roadmap-v1', () => {
  it('saves only the durable slice, never the run', () => {
    const s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' }, { type: 'ANSWER', value: 1 });
    const d = store.durable(s);
    expect(d.coins).toBe(1);
    expect(d.awarded).toEqual({ s1k1: true });
    expect(d.rings).toEqual({ s1: 1 });
    expect(d).not.toHaveProperty('queue');
    expect(d).not.toHaveProperty('phase');
    expect(d).not.toHaveProperty('returns');
    expect(d).not.toHaveProperty('fare');
    expect(d).not.toHaveProperty('events');
  });

  it('save then load gives back the same durable slice under fi-roadmap-v1', () => {
    const storage = fakeStorage();
    let s = R(engine.initial(), { type: 'SET_MODE', value: 'FA' }, { type: 'TOGGLE_MUTE' }, { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' }, { type: 'ANSWER', value: 1 });
    expect(store.save(storage, s)).toBe(true);
    expect(storage._map.has('fi-roadmap-v1')).toBe(true);
    expect([...storage._map.keys()]).toEqual(['fi-roadmap-v1']);
    const loaded = store.load(storage);
    expect(loaded).toEqual(store.durable(s));
    const hydrated = R(engine.initial(), { type: 'HYDRATE', value: loaded });
    expect(hydrated.mode).toBe('FA');
    expect(hydrated.muted).toBe(true);
    expect(hydrated.coins).toBe(1);
    expect(hydrated.screen).toBe('station'); // the position is restored (owner decision after Prompt 0); see resume.test.mjs
  });

  it('the Returns pass flag is never stored (decision 10)', () => {
    const s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' });
    expect(s.run.returning).toBe(false);
    expect(store.durable(s).run).toEqual({ stationId: 's1', pos: 0 });
  });

  it('a Lit Station survives a reload', () => {
    const storage = fakeStorage();
    let s = engine.initial();
    s = R(s, { type: 'OPEN_STATION', value: 's1' });
    let guard = 200;
    while (s.phase !== 'fare' && guard-- > 0) {
      if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
      else if (s.phase === 'check') s = R(s, { type: 'ANSWER', value: content.item('s1', s.current).answer });
      else s = R(s, { type: 'CONTINUE' });
    }
    for (const id of s.fare.questions) s = R(s, { type: 'ANSWER', value: content.item('s1', id).answer });
    expect(s.lit.s1).toBe(true);
    store.save(storage, s);
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) });
    expect(again.lit.s1).toBe(true);
    expect(again.xp).toBe(s.xp);
  });

  it('survives storage being disabled: save reports false, load gives null, the game still runs', () => {
    const storage = brokenStorage();
    const s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' });
    expect(store.save(storage, s)).toBe(false);
    expect(store.load(storage)).toBeNull();
    const hydrated = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) });
    expect(hydrated.mode).toBe('EN');
    expect(hydrated.coins).toBe(0);
  });

  it('survives no storage object at all and corrupt or foreign JSON', () => {
    expect(store.load(undefined)).toBeNull();
    expect(store.load(null)).toBeNull();
    expect(store.save(null, engine.initial())).toBe(false);
    const storage = fakeStorage();
    storage.setItem('fi-roadmap-v1', '{not json');
    expect(store.load(storage)).toBeNull();
    storage.setItem('fi-roadmap-v1', JSON.stringify({ v: 999, coins: 5 }));
    expect(store.load(storage)).toBeNull();
    storage.setItem('fi-roadmap-v1', JSON.stringify([1, 2, 3]));
    expect(store.load(storage)).toBeNull();
  });
});
