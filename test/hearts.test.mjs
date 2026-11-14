import { describe, it, expect, beforeAll } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 14, release 3 (issue #31): hearts. Five at most. A wrong answer in a new Lesson or its Fare costs one, after the
// first three Lessons. Review and replay never cost one and give one back. One returns every four hours, all at the day change.
// Time is a number the app passes in `at`; the engine has no clock.
let FI, R, E, root;
const H = 60 * 60 * 1000;
const q = (action) => JSON.stringify(action).replace(/"/g, '&quot;');
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
const day = (n, at) => ({ type: 'TICK', value: n, roll: 0, at });

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  E = FI.engine; R = reducer(E, FI.content);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
});

// Play the open Station on. `miss` Checks are answered wrong once each. Stops at the passed Fare, or when the hearts run out.
function play(s, miss = 0, at = 1000) {
  let left = miss; let guard = 900;
  while (s.phase !== 'fare-passed' && !s.heartWall && guard-- > 0) {
    if (s.phase === 'check' || s.phase === 'fare') {
      const k = FI.content.item(s.stationId, s.current);
      if (s.phase === 'check' && left > 0 && !s.hint) { left -= 1; s = R(s, { type: 'ANSWER', value: wrongFor(k), at }); } else s = R(s, { type: 'ANSWER', value: k.answer, at });
    } else s = R(s, { type: 'CONTINUE' });
  }
  return s;
}
const open = (s, id, at = 1000) => R(s, { type: 'OPEN_STATION', value: id, at });
const lesson = (s, id, miss, at) => R(play(open(s, id, at), miss, at), { type: 'BACK_TO_PATH' });
const start = () => R(E.initial(), day(100, 0));
// Three Lessons passed: from here a wrong answer in a new Lesson costs a heart.
const seasoned = () => ['s1', 's2', 's3'].reduce((s, id) => lesson(s, id), start());
const wrongNow = (s, at = 1000) => R(s, { type: 'ANSWER', value: wrongFor(FI.content.item(s.stationId, s.current)), at });
const toCheck = (s) => { let guard = 200; while (s.phase !== 'check' && guard-- > 0) s = R(s, { type: 'CONTINUE' }); return s; };

describe('Losing hearts', () => {
  it('starts with five, and the first three Lessons cost none', () => {
    let s = start();
    expect(s.hearts.n).toBe(5);
    s = lesson(s, 's1', 2);
    s = lesson(s, 's2', 2);
    s = lesson(s, 's3', 2);
    expect(s.hearts.n).toBe(5);
    expect(E.heartsOn(s)).toBe(true);
  });

  it('a wrong answer in a new Lesson costs one, and starts the wait for its return', () => {
    let s = toCheck(open(seasoned(), 's4', 5000));
    s = wrongNow(s, 6000);
    expect(s.hearts).toMatchObject({ n: 4, at: 6000 });
    expect(s.events).toContain('heart-lost');
  });

  it('a wrong answer in a replayed Lesson costs none, and passing it gives one back', () => {
    let s = toCheck(open(seasoned(), 's4'));
    s = R(wrongNow(s), { type: 'BACK_TO_PATH' });
    expect(s.hearts.n).toBe(4);
    s = toCheck(open(s, 's1'));
    s = wrongNow(s);
    expect(s.hearts.n).toBe(4);
    s = play(s);
    expect(s.hearts.n).toBe(5);
    expect(s.hearts.at).toBe(null);
  });

  it('a wrong answer in the Fare of a new Lesson costs one', () => {
    let s = open(seasoned(), 's4');
    let guard = 400;
    while (s.phase !== 'fare' && guard-- > 0) s = s.phase === 'check' ? R(s, { type: 'ANSWER', value: FI.content.item('s4', s.current).answer }) : R(s, { type: 'CONTINUE' });
    s = wrongNow(s);
    expect(s.hearts.n).toBe(4);
  });

  it('never goes below zero', () => {
    let s = { ...seasoned(), hearts: { n: 0, at: 0, day: 100 } };
    s = toCheck(open({ ...s, hearts: { n: 1, at: 0, day: 100 } }, 's4'));
    s = wrongNow(wrongNow(s, 10), 20);
    expect(s.hearts.n).toBe(0);
  });
});

describe('At zero hearts', () => {
  const empty = () => { let s = toCheck(open({ ...seasoned(), hearts: { n: 1, at: 0, day: 100 } }, 's4')); return wrongNow(s, 100); };

  it('the Lesson pauses: the wall opens, the place is kept and no answer is taken', () => {
    const s = empty();
    expect(s.hearts.n).toBe(0);
    expect(s.heartWall).toBe(true);
    expect(s.events).toContain('hearts-out');
    expect(s.paused).toMatchObject({ stationId: 's4' });
    const k = FI.content.item('s4', s.current);
    const tried = R(s, { type: 'ANSWER', value: k.answer, at: 200 });
    expect(tried.phase).toBe(s.phase);
    expect(tried.heartWall).toBe(true);
  });

  it('a new Lesson is locked, but Review and a replay stay open', () => {
    const s = R(empty(), { type: 'BACK_TO_PATH' });
    expect(s.heartWall).toBe(false);
    const locked = open(s, 's5', 300);
    expect(locked.screen).toBe('path');
    expect(locked.heartWall).toBe(true);
    expect(open(s, 's1', 300).screen).toBe('station');
    expect(R(s, { type: 'OPEN_REVIEW' }).screen).toBe('review');
  });

  it('with a heart back, the paused Lesson opens at its place and is not judged clean', () => {
    let s = R(empty(), { type: 'BACK_TO_PATH' });
    const pos = s.paused.pos;
    s = R(s, day(100, 100 + 4 * H));
    expect(s.hearts.n).toBe(1);
    s = open(s, 's4', 100 + 4 * H);
    expect(s.screen).toBe('station');
    expect(s.run.pos).toBeGreaterThanOrEqual(pos);
    expect(s.tally.partial).toBe(pos > 0);
    s = play(s, 0, 100 + 4 * H);
    expect(s.paused).toBe(null);
  });

  it('a heart bought inside the Lesson closes the wall and the Lesson goes on', () => {
    let s = { ...empty(), coins: 100, earned: 100 };
    s = R(s, { type: 'BUY_HEART', at: 200 });
    expect(s.hearts.n).toBe(1);
    expect(s.coins).toBe(100 - E.HEART_PRICE);
    expect(s.heartWall).toBe(false);
    expect(s.screen).toBe('station');
  });
});

describe('Hearts come back', () => {
  const down = (n, at = 0) => ({ ...seasoned(), hearts: { n, at, day: 100 } });

  it('one every four hours, counted from when the wait began', () => {
    let s = R(down(2, 0), day(100, 4 * H - 1));
    expect(s.hearts.n).toBe(2);
    s = R(s, day(100, 4 * H));
    expect(s.hearts).toMatchObject({ n: 3, at: 4 * H });
    s = R(s, day(100, 9 * H));
    expect(s.hearts).toMatchObject({ n: 4, at: 8 * H });
    s = R(s, day(100, 30 * H));
    expect(s.hearts).toMatchObject({ n: 5, at: null });
  });

  it('all five at the day change', () => {
    const s = R(down(0, 0), day(101, 60 * 1000));
    expect(s.hearts).toMatchObject({ n: 5, at: null, day: 101 });
  });

  it('one for a finished Review', () => {
    let s = down(3, 0);
    s = R(s, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: FI.content.station('s1').items.find((i) => i.kind === 'card').id } });
    for (const e of Object.values(s.deck)) e.due = s.today; // due now
    s = R(s, { type: 'OPEN_REVIEW' });
    expect(s.review.ids.length).toBeGreaterThan(0);
    let guard = 60;
    while (s.review.phase !== 'done' && guard-- > 0) {
      const e = s.deck[s.review.ids[s.review.index]];
      if (s.review.phase === 'check') s = R(s, { type: 'REVIEW_ANSWER', value: e.check.answer });
      else if (s.review.phase === 'card' && !e.check) s = R(s, { type: 'REVIEW_RATE', value: 'knew' });
      else s = R(s, { type: 'REVIEW_NEXT' });
    }
    expect(s.review.phase).toBe('done');
    expect(s.hearts.n).toBe(4);
  });

  it('one bought with Coins, never above five and never without the Coins', () => {
    let s = R({ ...down(4, 0), coins: 100, earned: 100 }, { type: 'BUY_HEART', at: 10 });
    expect(s.hearts).toMatchObject({ n: 5, at: null });
    expect(R(s, { type: 'BUY_HEART', at: 20 }).coins).toBe(s.coins);
    expect(R({ ...down(2, 0), coins: E.HEART_PRICE - 1 }, { type: 'BUY_HEART', at: 10 }).hearts.n).toBe(2);
  });

  it('a clock that runs backwards gives nothing and restarts the wait', () => {
    const s = R(down(2, 10 * H), day(100, 1 * H));
    expect(s.hearts).toMatchObject({ n: 2, at: 1 * H });
  });
});

describe('What the player sees', () => {
  it('the header shows the hearts only once they can be lost', () => {
    expect(html(start())).not.toContain('class="heartchip');
    expect(html(seasoned())).toContain('class="heartchip');
  });

  it('the wall names the three ways to get a heart and carries the countdown', () => {
    let s = toCheck(open({ ...seasoned(), hearts: { n: 1, at: 0, day: 100 }, coins: 100, earned: 100 }, 's4'));
    const out = html(wrongNow(s, 100));
    expect(out).toContain('class="overlay heartoverlay"');
    expect(out).toContain('Out of hearts');
    expect(out).toContain('data-heart-at="0"');
    expect(out).toContain(q({ type: 'OPEN_REVIEW' }));
    expect(out).toContain(q({ type: 'OPEN_STATION', value: 's3' }));
    expect(out).toContain(q({ type: 'BUY_HEART' }));
    expect(out).toContain(q({ type: 'DISMISS_HEARTS' }));
    expect((out.match(/class="hrt on"/g) || []).length).toBe(0);
  });

  it('the scoreboard shows the hearts left', () => {
    const s = play(open(seasoned(), 's4'), 1);
    expect(s.end.hearts).toBe(4);
    expect(html(s)).toContain('class="heartsleft"');
  });

  it('every hearts string exists in both languages', () => {
    for (const mode of ['EN', 'FA']) {
      const s = { ...toCheck(open({ ...seasoned(), hearts: { n: 1, at: 0, day: 100 } }, 's4')), mode };
      expect(html(wrongNow(s, 100))).not.toMatch(/undefined|\{n\}/);
    }
  });
});

describe('Saved progress', () => {
  it('keeps hearts and the paused place, and loads a save from before hearts with five', () => {
    const load = (d) => R(E.initial(), { type: 'HYDRATE', value: d });
    expect(load({}).hearts).toEqual({ n: 5, at: null, day: null });
    const s = load({ hearts: { n: 2, at: 5000, day: 99 }, paused: { stationId: 's4', pos: 3 } });
    expect(s.hearts).toEqual({ n: 2, at: 5000, day: 99 });
    expect(s.paused).toEqual({ stationId: 's4', pos: 3 });
    expect(E.badKeys({ hearts: { n: 6, at: null, day: 1 } })).toContain('hearts');
    expect(E.badKeys({ hearts: { n: 2, at: 'x', day: 1 } })).toContain('hearts');
    expect(E.badKeys({ paused: { stationId: 's4' } })).toContain('paused');
  });

  it('a reload does not refill the hearts by itself: the same day keeps them', () => {
    let s = R(E.initial(), { type: 'HYDRATE', value: { hearts: { n: 1, at: 1000, day: 100 }, farePassed: { s1: true, s2: true, s3: true }, lit: { s1: true, s2: true, s3: true } } });
    s = R(s, day(100, 2000));
    expect(s.hearts.n).toBe(1);
  });
});
