import { describe, it, expect, beforeAll } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 14, release 4 (issue #31): levels derived from XP, this week against last week, records,
// a chest for every finished Circle, and Path colours made from shards.
let FI, R, E, root;
const q = (action) => JSON.stringify(action).replace(/"/g, '&quot;');
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const day = (n) => ({ type: 'TICK', value: n, roll: 0, at: n * 86400000 });
const cont = { type: 'CONTINUE' };

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  E = FI.engine; R = reducer(E, FI.content);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
});

function pass(s, id) {
  s = R(s, { type: 'OPEN_STATION', value: id });
  let guard = 800;
  while (s.phase !== 'fare-passed' && guard-- > 0) s = s.phase === 'check' || s.phase === 'fare' ? R(s, { type: 'ANSWER', value: FI.content.item(id, s.current).answer }) : R(s, cont);
  return s;
}
const lesson = (s, id) => R(pass(s, id), { type: 'BACK_TO_PATH' });
// day 109 is a Monday (weeks start on Monday)
const start = (n = 109) => R(E.initial(), day(n));

describe('Levels', () => {
  it('are seven, each needing more XP than the last, and derived from XP alone', () => {
    expect(E.LEVELS.length).toBe(7);
    const gaps = E.LEVELS.slice(1).map((v, i) => v - E.LEVELS[i]);
    expect(gaps.every((g, i) => i === 0 || g > gaps[i - 1])).toBe(true);
    expect(E.levelOf(0)).toBe(0);
    expect(E.levelOf(E.LEVELS[1] - 1)).toBe(0);
    expect(E.levelOf(E.LEVELS[1])).toBe(1);
    expect(E.levelOf(999999)).toBe(6);
    expect(E.LEVELS[6]).toBeLessThanOrEqual(FI.content.totalXp()); // the top level can be reached
    expect(E.DURABLE).not.toContain('level');
  });

  it('a Lesson that crosses a threshold adds a level-up screen after the chest', () => {
    let s = lesson(start(), 's1'); // 50 XP: still level 1
    expect(E.levelOf(s.xp)).toBe(0);
    s = pass(s, 's2'); // 100 XP: level 2
    expect(s.end.level).toBe(1);
    expect(s.events).toContain('level-up');
    s = R(s, cont, { type: 'OPEN_CHEST', value: 0 }, cont);
    expect(s.end.step).toBe('level');
    const out = html(s);
    expect(out).toContain('Level up');
    expect(out).toContain('Planner');
    expect(R(s, cont).end.step).toBe('onward'); // the streak grew with the first Lesson of the day, not this one
  });

  it('a Lesson that crosses nothing has no level-up screen', () => {
    const s = pass(start(), 's1');
    expect(s.end.level).toBe(null);
    expect(R(s, cont, { type: 'OPEN_CHEST', value: 0 }, cont).end.step).toBe('streak');
  });

  it('a returning player is placed at once: the Profile names the level for the XP held', () => {
    const s = R({ ...start(), xp: 800 }, { type: 'OPEN_PROFILE' });
    const out = html(s);
    expect(out).toContain('Owner');
    expect(out).toContain('Level 4');
    expect(out).toContain(`${E.LEVELS[4] - 800} XP to the next level`);
  });
});

describe('This week against last week', () => {
  it('counts the XP of each day, and compares up to the same weekday', () => {
    let s = start(102); // Monday of last week
    s = lesson(s, 's1'); // 50 XP on Monday
    s = lesson(R(s, day(104)), 's2'); // 50 XP on Wednesday
    s = R(s, day(109)); // Monday of this week
    expect(E.weekPace(s)).toEqual({ now: 0, then: 50 });
    s = lesson(s, 's3');
    expect(E.weekPace(s)).toEqual({ now: 50, then: 50 });
    s = R(s, day(111)); // Wednesday
    expect(E.weekPace(s)).toEqual({ now: 50, then: 100 });
    expect(html(R(s, { type: 'OPEN_PROFILE' }))).toContain('50 XP behind last week');
  });

  it('restored or loaded XP is not counted as earned today', () => {
    const s = R(R(E.initial(), { type: 'HYDRATE', value: { xp: 50, lit: { s1: true }, farePassed: { s1: true } } }), day(109));
    expect(E.weekPace(s).now).toBe(0);
  });

  it('keeps three weeks of days and drops the rest', () => {
    let s = lesson(start(80), 's1');
    s = R(s, day(109));
    expect(Object.keys(s.days)).not.toContain('80');
  });
});

describe('Records', () => {
  it('keep the longest Combo, the most Lessons in a day, the best week and the most Review Cards in a week', () => {
    let s = lesson(lesson(start(), 's1'), 's2');
    expect(s.records.lessonsDay).toBe(2);
    expect(s.records.weekXp).toBe(100);
    expect(s.records.combo).toBeGreaterThan(5);
    const best = s.records.combo;
    s = lesson(R(s, day(116)), 's3'); // the next week: one Lesson
    expect(s.records).toMatchObject({ lessonsDay: 2, weekXp: 100 });
    expect(s.records.combo).toBeGreaterThanOrEqual(best);
    expect(html(R(s, { type: 'OPEN_PROFILE' }))).toContain('Most Lessons in a day');
  });
});

describe('The chest of a Circle', () => {
  const circle = () => FI.content.sections.find((sec) => sec.circles).circles[0];

  it('is shut until the Circle is finished, opens once, and pays 20 to 45 Coins', () => {
    const c = circle();
    let s = start();
    expect(R(s, { type: 'OPEN_PATH_CHEST', circle: c.id, value: 0.5 }).coins).toBe(0);
    s = { ...s, lit: { ...s.lit, [c.id]: true } }; // finished before this release: the chest waits
    expect(html(s)).toContain(q({ type: 'OPEN_PATH_CHEST', circle: c.id }));
    const lo = R(s, { type: 'OPEN_PATH_CHEST', circle: c.id, value: 0 });
    const hi = R(s, { type: 'OPEN_PATH_CHEST', circle: c.id, value: 0.9999 });
    expect(lo.coins).toBe(E.PATH_CHEST[0]);
    expect(hi.coins).toBe(E.PATH_CHEST[1]);
    expect(lo.pathChests[c.id]).toBe(true);
    expect(lo.events).toContain('chest');
    expect(html(lo)).toContain(`+<span class="cn">${E.PATH_CHEST[0]}</span>`);
    expect(R(lo, { type: 'OPEN_PATH_CHEST', circle: c.id, value: 0.9 }).coins).toBe(lo.coins);
  });

  it('refuses an id that is not a Circle', () => {
    const s = { ...start(), lit: { s1: true } };
    expect(R(s, { type: 'OPEN_PATH_CHEST', circle: 's1', value: 0.5 }).coins).toBe(0);
  });
});

describe('Path colours', () => {
  it('five shards make one colour; it is put in use, and shards are the only way', () => {
    let s = { ...start(), shards: 4, coins: 9999 };
    expect(R(s, { type: 'BUY_COLOUR', value: 'rose' }).colours.owned).toEqual([]);
    s = R({ ...s, shards: 7 }, { type: 'BUY_COLOUR', value: 'rose' });
    expect(s.shards).toBe(2);
    expect(s.colours).toEqual({ owned: ['rose'], on: 'rose' });
    expect(s.coins).toBe(9999);
    expect(html(s)).toContain('data-colour="rose"');
    expect(R({ ...s, shards: 9 }, { type: 'BUY_COLOUR', value: 'rose' }).shards).toBe(9); // not twice
    expect(R(s, { type: 'BUY_COLOUR', value: 'pink' }).colours.owned).toEqual(['rose']);
  });

  it('the player can go back to Neon and choose only a colour that is owned', () => {
    let s = R({ ...start(), shards: 5 }, { type: 'BUY_COLOUR', value: 'gold' });
    s = R(s, { type: 'SET_COLOUR', value: null });
    expect(s.colours.on).toBe(null);
    expect(html(s)).not.toMatch(/<main class="path[^"]*" data-colour/);
    expect(R(s, { type: 'SET_COLOUR', value: 'lime' }).colours.on).toBe(null);
    expect(R(s, { type: 'SET_COLOUR', value: 'gold' }).colours.on).toBe('gold');
  });

  it('there are four to start, shown on the Profile with the shards held', () => {
    expect(E.COLOURS.length).toBe(4);
    const out = html(R({ ...start(), shards: 3 }, { type: 'OPEN_PROFILE' }));
    expect(out).toContain('3 of 5 shards');
    expect((out.match(/class="colour /g) || []).length).toBe(5); // Neon and four colours
  });
});

describe('Saved progress', () => {
  it('keeps days, records, opened chests and colours, and refuses bad shapes', () => {
    const d = { days: { 109: { xp: 50, lessons: 1, cards: 0 } }, records: { combo: 9, lessonsDay: 2, weekXp: 100, weekCards: 4 }, pathChests: { b01c1: true }, colours: { owned: ['gold'], on: 'gold' } };
    expect(E.badKeys(d)).toEqual([]);
    const s = R(E.initial(), { type: 'HYDRATE', value: d });
    expect(s.records.combo).toBe(9);
    expect(s.colours.on).toBe('gold');
    expect(E.badKeys({ colours: { owned: [], on: 'gold' } })).toContain('colours');
    expect(E.badKeys({ colours: { owned: ['pink'], on: null } })).toContain('colours');
    expect(E.badKeys({ records: { combo: 1 } })).toContain('records');
    expect(E.badKeys({ days: { x: { xp: 1, lessons: 1, cards: 1 } } })).toContain('days');
  });

  it('a save from before this release loads with empty records and Neon', () => {
    const s = R(E.initial(), { type: 'HYDRATE', value: { xp: 50 } });
    expect(s.records).toEqual({ combo: 0, lessonsDay: 0, weekXp: 0, weekCards: 0 });
    expect(s.colours).toEqual({ owned: [], on: null });
  });

  it('every new string exists in both languages', () => {
    for (const mode of ['EN', 'FA']) {
      const s = R({ ...start(), mode, xp: 800, shards: 6 }, { type: 'OPEN_PROFILE' });
      expect(html(s)).not.toMatch(/undefined|\{n\}/);
    }
  });
});
