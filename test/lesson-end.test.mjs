import { describe, it, expect, beforeAll } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer, fakeStorage } from './helpers.mjs';

// Spec 14, release 1 (issue #31): the Combo pays, a Lesson ends on a scoreboard, a chest and an onward screen,
// and Continue offers a due Review first. Driven by the actions a tap sends; days move with TICK.
let FI, R, root;
const q = (action) => JSON.stringify(action).replace(/"/g, '&quot;');
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
const cont = { type: 'CONTINUE' };

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  R = reducer(FI.engine, FI.content);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
});

// Play a Station to its passed Fare. `miss` is how many Checks are answered wrong (twice, so the answer is revealed).
function pass(s, id, { miss = 0, at } = {}) {
  s = R(s, { type: 'OPEN_STATION', value: id, at });
  let left = miss; let guard = 600;
  while (s.phase !== 'fare-passed' && guard-- > 0) {
    if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    else if (s.phase === 'check' || s.phase === 'fare') {
      const k = FI.content.item(id, s.current);
      if (s.phase === 'check' && left > 0) { left -= 1; s = R(s, { type: 'ANSWER', value: wrongFor(k) }, { type: 'ANSWER', value: wrongFor(k) }); }
      else s = R(s, { type: 'ANSWER', value: k.answer, at: at === undefined ? undefined : at + 95000 });
    } else s = R(s, cont);
  }
  return s;
}
const checks = (id) => FI.content.station(id).items.filter((i) => i.kind === 'check');

describe('The Combo pays Coins', () => {
  it('pays 1, 1, 2, 2, 3 for right answers in a row', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(FI.engine.comboPay)).toEqual([1, 1, 2, 2, 3, 3, 4]);
    // the Combo runs on across Lessons, so the pay stops climbing
    expect([9, 10, 40, 400].map(FI.engine.comboPay)).toEqual([5, 5, 5, 5]);
  });

  it('a clean Lesson pays the Combo ladder plus the clean bonus', () => {
    const s = pass(FI.engine.initial(), 's1');
    const n = checks('s1').length;
    const ladder = Array.from({ length: n }, (_, i) => FI.engine.comboPay(i + 1)).reduce((a, b) => a + b, 0);
    expect(s.coins).toBe(ladder + FI.engine.CLEAN_BONUS);
    expect(s.earned).toBe(s.coins);
  });

  it('a wrong answer restarts the ladder at one Coin', () => {
    let s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: 's1' });
    let paid = []; let guard = 200; let missed = false;
    while (paid.length < 3 && guard-- > 0) {
      if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
      else if (s.phase === 'check') {
        const k = FI.content.item('s1', s.current);
        if (paid.length === 2 && !missed) { missed = true; s = R(s, { type: 'ANSWER', value: wrongFor(k) }, { type: 'ANSWER', value: wrongFor(k) }); }
        else { s = R(s, { type: 'ANSWER', value: k.answer }); paid.push(s.paid); }
      } else s = R(s, cont);
    }
    expect(paid).toEqual([1, 1, 1]);
  });

  it('pays nothing for a Check answered right a second time', () => {
    let s = pass(FI.engine.initial(), 's1');
    s = R(s, { type: 'BACK_TO_PATH' });
    const held = s.coins;
    s = pass(s, 's1');
    s = R(s, { type: 'BACK_TO_PATH' });
    expect(s.coins).toBe(held);
  });
});

describe('The summary of a passed Lesson', () => {
  it('counts first-try answers, the best Combo, the time and what was earned', () => {
    const s = pass(FI.engine.initial(), 's1', { at: 1000 });
    const n = checks('s1').length;
    expect(s.end).toMatchObject({ step: 'score', replay: false, right: n, total: n, clean: true, secs: 95, missed: [] });
    expect(s.end.best).toBeGreaterThanOrEqual(n);
    expect(s.end.xp).toBe(FI.content.station('s1').xp);
    expect(s.end.coins).toBe(s.coins);
  });

  it('names the Cards that were missed and is not clean', () => {
    const s = pass(FI.engine.initial(), 's1', { miss: 1 });
    expect(s.end.clean).toBe(false);
    expect(s.end.right).toBe(s.end.total - 1);
    expect(s.end.missed).toHaveLength(1);
    expect(s.deck[s.end.missed[0]]).toBeTruthy();
    expect(s.awarded['clean:s1']).toBeUndefined();
  });

  it('leaves the time out when the app sent none', () => {
    expect(pass(FI.engine.initial(), 's1').end.secs).toBeNull();
  });
});

describe('The chest', () => {
  it('is gold after a clean Lesson: pays inside its range and always gives a shard', () => {
    const base = pass(FI.engine.initial(), 's1');
    const [lo, hi] = FI.engine.CHEST.gold;
    expect(base.end.chest).toMatchObject({ gold: true, lo, hi, open: false });
    const low = R(base, cont, { type: 'OPEN_CHEST', value: 0 });
    const high = R(base, cont, { type: 'OPEN_CHEST', value: 0.9999 });
    expect(low.coins - base.coins).toBe(lo);
    expect(high.coins - base.coins).toBe(hi);
    expect(low.end.chest).toMatchObject({ open: true, won: lo });
    expect(low.shards).toBe(1);
    expect(low.events).toEqual(expect.arrayContaining(['chest', 'shard', 'coin']));
  });

  it('is plain after a Lesson with a miss: a smaller range and no shard', () => {
    const base = pass(FI.engine.initial(), 's1', { miss: 1 });
    const [lo, hi] = FI.engine.CHEST.plain;
    expect(base.end.chest).toMatchObject({ gold: false, lo, hi });
    const s = R(base, cont, { type: 'OPEN_CHEST', value: 0.5 });
    expect(s.coins - base.coins).toBeGreaterThanOrEqual(lo);
    expect(s.coins - base.coins).toBeLessThanOrEqual(hi);
    expect(s.shards).toBe(0);
  });

  it('opens once', () => {
    const once = R(pass(FI.engine.initial(), 's1'), cont, { type: 'OPEN_CHEST', value: 0.5 });
    const twice = R(once, { type: 'OPEN_CHEST', value: 0.5 });
    expect(twice.coins).toBe(once.coins);
    expect(twice.shards).toBe(1);
  });

  it('is not lost when the player leaves before opening it', () => {
    const base = pass(FI.engine.initial(), 's1');
    const s = R(base, { type: 'BACK_TO_PATH' });
    expect(s.coins - base.coins).toBe(FI.engine.CHEST.gold[0]);
    expect(s.shards).toBe(1);
    expect(s.owed).toBeNull();
  });

  it('is not lost on a reload before opening it', () => {
    const base = pass(FI.engine.initial(), 's1');
    const storage = fakeStorage();
    FI.store.save(storage, base);
    const s = R(FI.engine.initial(), { type: 'HYDRATE', value: FI.store.load(storage) });
    expect(s.coins - base.coins).toBe(FI.engine.CHEST.gold[0]);
    expect(s.owed).toBeNull();
    expect(R(s, { type: 'HYDRATE', value: FI.store.durable(s) }).coins).toBe(s.coins);
  });

  it('a replayed Lesson gives no chest, no Coins and no shard', () => {
    let s = R(pass(FI.engine.initial(), 's1'), cont, { type: 'OPEN_CHEST', value: 0 }, cont, cont);
    expect(s.screen).toBe('path');
    const before = { coins: s.coins, shards: s.shards, xp: s.xp };
    s = pass(s, 's1');
    expect(s.end).toMatchObject({ step: 'onward', replay: true });
    s = R(s, cont);
    expect(s.screen).toBe('path');
    expect({ coins: s.coins, shards: s.shards, xp: s.xp }).toEqual(before);
  });
});

describe('The screens at the end of a Lesson', () => {
  it('go scoreboard, chest, onward, Path with one tap each', () => {
    let s = pass(FI.engine.initial(), 's1');
    expect(s.end.step).toBe('score');
    s = R(s, cont); expect(s.end.step).toBe('chest');
    s = R(s, { type: 'OPEN_CHEST', value: 0.3 }); expect(s.end.step).toBe('chest');
    s = R(s, cont); expect(s.end.step).toBe('onward');
    s = R(s, cont); expect(s.screen).toBe('path');
    expect(s.end).toBeNull();
  });

  it('the scoreboard shows accuracy, time, best Combo and what was earned', () => {
    const s = pass(FI.engine.initial(), 's1', { at: 5000 });
    const out = html(s);
    expect(out).toContain('class="scoreboard"');
    expect(out).toContain('100%');
    expect(out).toContain('1:35');
    expect(out).toContain(`×${s.end.best}`);
    expect(out).toContain(`+${s.end.xp} XP`);
    expect(out).toContain(q(cont));
  });

  it('the chest screen shows the range before it is opened and the amount after', () => {
    let s = R(pass(FI.engine.initial(), 's1'), cont);
    const [lo, hi] = FI.engine.CHEST.gold;
    let out = html(s);
    expect(out).toContain('class="chest gold"');
    expect(out).toContain(`${lo}`); expect(out).toContain(`${hi}`);
    expect(out).toContain('"type":"OPEN_CHEST"'.replace(/"/g, '&quot;'));
    s = R(s, { type: 'OPEN_CHEST', value: 0 });
    out = html(s);
    expect(out).toContain(`+${lo}`);
    expect(out).toContain('class="shardwon"');
    expect(out).toContain(q(cont));
  });

  it('the onward screen names the missed Card, says when it returns and starts the next Lesson', () => {
    let s = R(pass(FI.engine.initial(), 's1', { miss: 1 }), cont, { type: 'OPEN_CHEST', value: 0 }, cont);
    const out = html(s);
    expect(out).toContain('class="onward"');
    expect(out).toContain('class="missedlist"');
    expect(out).toContain('tomorrow');
    expect(out).toContain(q({ type: 'OPEN_STATION', value: 's2' }));
    expect(out).toContain(q(cont));
  });

  it('renders in Farsi with Persian digits', () => {
    const s = pass(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }), 's1', { at: 0 });
    const out = html(s);
    expect(out).toContain('۱۰۰');
    expect(html(R(s, cont))).toContain('class="chest gold"');
  });
});

describe('Continue offers a due Review first', () => {
  it('shows only the Lesson when nothing is due', () => {
    const out = html(FI.engine.initial());
    expect(out).toContain('class="btn primary wide continue"');
    expect(out).not.toContain('reviewfirst');
  });

  it('offers the Review with its count and minutes, then the Lesson', () => {
    let s = R(pass(FI.engine.initial(), 's1', { miss: 2 }), { type: 'BACK_TO_PATH' }, { type: 'TICK', value: 1 });
    const due = FI.engine.dueCount(s);
    expect(due).toBeGreaterThan(0);
    const out = html(s);
    const first = out.indexOf('reviewfirst'); const lesson = out.indexOf(q({ type: 'OPEN_STATION', value: 's2' }));
    expect(first).toBeGreaterThan(-1);
    expect(lesson).toBeGreaterThan(first);
    const block = out.slice(first, lesson);
    expect(block).toContain(q({ type: 'OPEN_REVIEW' }));
    expect(block).toContain(`${due}`);
    expect(block).toContain(`${FI.engine.reviewMinutes(due)} min`);
    expect(FI.engine.reviewMinutes(1)).toBe(1);
    expect(FI.engine.reviewMinutes(9)).toBe(5);
  });
});

describe('Saved progress', () => {
  it('a save from before this release keeps its Coins as held and as earned', () => {
    const s = R(FI.engine.initial(), { type: 'HYDRATE', value: { coins: 42, xp: 60 } });
    expect(s).toMatchObject({ coins: 42, earned: 42, shards: 0, owed: null });
  });

  it('a backup carries Coins earned and shards', () => {
    const s = R(pass(FI.engine.initial(), 's1'), cont, { type: 'OPEN_CHEST', value: 0.5 });
    const back = FI.store.parseBackup(FI.store.backup(s, '2026-11-13'));
    expect(back.ok).toBe(true);
    const r = R(FI.engine.initial(), { type: 'RESTORE', value: back.data });
    expect(r).toMatchObject({ coins: s.coins, earned: s.earned, shards: 1 });
  });

  it('refuses a damaged value for the new fields', () => {
    expect(FI.engine.badKeys({ shards: -1 })).toContain('shards');
    expect(FI.engine.badKeys({ earned: 'many' })).toContain('earned');
    expect(FI.engine.badKeys({ owed: { lo: 5 } })).toContain('owed');
    expect(FI.engine.badKeys({ owed: { lo: 1, hi: 1e9, gold: true } })).toContain('owed');
    expect(FI.engine.badKeys({ owed: null, shards: 2, earned: 9 })).toEqual([]);
  });
});
