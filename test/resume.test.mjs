import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

// Owner decision after the Prompt 0 play-test: a reload resumes at the same Card.
const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
const fakeStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

describe('Reload resumes the Station at the same Card', () => {
  it('after a reload mid-Station the player is on the same Station and Card, with the run position kept', () => {
    const storage = fakeStorage();
    let s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' }, { type: 'ANSWER', value: 1 }, { type: 'CONTINUE' }, { type: 'RATE', value: 'knew' });
    expect(s.current).toBe('s1k2');
    store.save(storage, s);
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) });
    expect(again.screen).toBe('station');
    expect(again.stationId).toBe('s1');
    expect(again.current).toBe('s1k2');
    expect(again.phase).toBe('check');
    expect(again.coins).toBe(1);
  });

  it('a pending Return and an in-progress Fare are not resumed; the Fare restarts from the queue end', () => {
    const storage = fakeStorage();
    let s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' });
    expect(s.returns).toEqual(['s1c1']);
    store.save(storage, s);
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) });
    expect(again.returns).toEqual([]);
    expect(again.current).toBe('s1k1');
  });

  it('leaving the Station clears the saved position', () => {
    const storage = fakeStorage();
    let s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'BACK_TO_PATH' });
    store.save(storage, s);
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) });
    expect(again.screen).toBe('path');
  });

  it('a saved position in an unknown Station is ignored', () => {
    const again = R(engine.initial(), { type: 'HYDRATE', value: { run: { stationId: 'nope', pos: 3 } } });
    expect(again.screen).toBe('path');
  });
});
