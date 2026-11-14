import { describe, it, expect, beforeAll } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 14, release 2 (issue #31): a day streak with a freeze bought with Coins, and three quests a day with a chest.
// Days move with TICK; the quest deal and the chest draw are numbers the app passes in.
let FI, R, E, root;
const q = (action) => JSON.stringify(action).replace(/"/g, '&quot;');
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
const cont = { type: 'CONTINUE' };
const day = (n, roll = 0) => ({ type: 'TICK', value: n, roll });

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  E = FI.engine; R = reducer(E, FI.content);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
});

// Play a Station to its passed Fare and back to the Path. `miss` Checks are answered wrong.
function pass(s, id, miss = 0) {
  s = R(s, { type: 'OPEN_STATION', value: id });
  let left = miss; let guard = 600;
  while (s.phase !== 'fare-passed' && guard-- > 0) {
    if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    else if (s.phase === 'check' || s.phase === 'fare') {
      const k = FI.content.item(id, s.current);
      if (s.phase === 'check' && left > 0) { left -= 1; s = R(s, { type: 'ANSWER', value: wrongFor(k) }, { type: 'ANSWER', value: wrongFor(k) }); }
      else s = R(s, { type: 'ANSWER', value: k.answer });
    } else s = R(s, cont);
  }
  return s;
}
const lesson = (s, id, miss) => R(pass(s, id, miss), { type: 'BACK_TO_PATH' });
// Finish today's Review, answering every Card right.
function review(s) {
  s = R(s, { type: 'OPEN_REVIEW' });
  let guard = 200;
  while (s.review.phase !== 'done' && guard-- > 0) {
    const e = s.deck[s.review.ids[s.review.index]];
    if (s.review.phase === 'check') s = R(s, { type: 'REVIEW_ANSWER', value: e.check.answer });
    else if (s.review.phase === 'card' && !e.check) s = R(s, { type: 'REVIEW_RATE', value: 'knew' });
    else s = R(s, { type: 'REVIEW_NEXT' });
  }
  return s;
}
const start = () => R(E.initial(), day(100));

describe('The day streak', () => {
  it('starts at nothing and counts the first Lesson passed today, once', () => {
    let s = start();
    expect(s.streak).toEqual({ n: 0, best: 0, last: null });
    s = lesson(s, 's1');
    expect(s.streak).toEqual({ n: 1, best: 1, last: 100, from: 100 });
    s = lesson(s, 's2');
    expect(s.streak.n).toBe(1);
    expect(E.streakToday(s)).toBe(true);
  });

  it('grows on the next day and keeps the best', () => {
    let s = lesson(start(), 's1');
    s = R(s, day(101));
    expect(E.streakToday(s)).toBe(false);
    s = lesson(s, 's2');
    expect(s.streak).toEqual({ n: 2, best: 2, last: 101, from: 100 });
  });

  it('a finished Review counts as well as a Lesson', () => {
    let s = lesson(start(), 's1', 1);
    s = R(s, day(101));
    expect(E.dueCount(s)).toBeGreaterThan(0);
    s = review(s);
    expect(s.review.phase).toBe('done');
    expect(s.streak).toMatchObject({ n: 2, last: 101 });
    expect(s.events).toContain('streak');
  });

  it('opening a Review with nothing due does not count', () => {
    const s = review(start());
    expect(s.streak.n).toBe(0);
  });

  it('a missed day with no freeze ends it, and the best stays', () => {
    let s = lesson(start(), 's1');
    s = lesson(R(s, day(101)), 's2');
    s = R(s, day(103));
    expect(s.streak).toEqual({ n: 0, best: 2, last: null });
    expect(s.events).toContain('streak-lost');
    expect(s.streakNote).toEqual({ kind: 'lost', n: 2 });
    s = lesson(s, 's3');
    expect(s.streak).toEqual({ n: 1, best: 2, last: 103, from: 103 });
    expect(s.streakNote).toBeNull();
  });

  it('the same day sent again changes nothing', () => {
    let s = lesson(start(), 's1');
    const again = R(s, day(100), day(100));
    expect(again.streak).toEqual(s.streak);
  });
});

describe('The streak freeze', () => {
  const rich = (s, coins = 1000) => ({ ...s, coins, earned: Math.max(s.earned, coins) });

  it('is bought with Coins, at most two, and never takes Coins below zero', () => {
    let s = rich(start(), E.FREEZE_PRICE * 2 + 5);
    const earned = s.earned;
    s = R(s, { type: 'BUY_FREEZE' });
    expect(s.freezes).toBe(1);
    expect(s.coins).toBe(E.FREEZE_PRICE + 5);
    expect(s.earned).toBe(earned);
    s = R(s, { type: 'BUY_FREEZE' });
    expect(s.freezes).toBe(2);
    s = R(rich(s), { type: 'BUY_FREEZE' });
    expect(s.freezes).toBe(E.FREEZE_MAX);
    expect(s.coins).toBe(1000);
    const poor = R(rich(start(), E.FREEZE_PRICE - 1), { type: 'BUY_FREEZE' });
    expect(poor.freezes).toBe(0);
    expect(poor.coins).toBe(E.FREEZE_PRICE - 1);
  });

  it('covers a missed day by itself and the streak goes on', () => {
    let s = lesson(start(), 's1');
    s = R(rich(s), { type: 'BUY_FREEZE' });
    s = R(s, day(102));
    expect(s.freezes).toBe(0);
    expect(s.streak).toMatchObject({ n: 1, last: 101 });
    expect(s.marks[101]).toBe('frz');
    expect(s.streakNote).toEqual({ kind: 'frozen', n: 1 });
    s = lesson(s, 's2');
    expect(s.streak).toMatchObject({ n: 2, last: 102 });
  });

  it('two freezes cover two days; a third missed day ends the streak', () => {
    let s = lesson(start(), 's1');
    s = R(rich(s), { type: 'BUY_FREEZE' }, { type: 'BUY_FREEZE' });
    expect(R(s, day(103)).streak.n).toBe(1);
    const lost = R(s, day(104));
    expect(lost.streak.n).toBe(0);
    expect(lost.freezes).toBe(0);
  });

  it('is not spent when there is no streak to save', () => {
    let s = R(rich(start()), { type: 'BUY_FREEZE' });
    s = R(s, day(105));
    expect(s.freezes).toBe(1);
  });
});

describe('The quests of the day', () => {
  it('deals three different quests on a new day, the same for the same draw', () => {
    const s = start();
    const list = E.questsToday(s).list;
    expect(list).toHaveLength(3);
    expect(new Set(list.map((x) => x.kind)).size).toBe(3);
    expect(list.every((x) => x.have === 0 && x.need > 0)).toBe(true);
    expect(E.questsToday(R(E.initial(), day(100))).list).toEqual(list);
    const kinds = new Set();
    for (let i = 0; i < 20; i++) for (const x of E.questsToday(R(E.initial(), day(100, i / 20))).list) kinds.add(x.kind);
    expect([...kinds].sort()).toEqual(['clean', 'combo', 'fare', 'lesson', 'right']);
  });

  it('deals the Review quest only when Cards are due, and then always', () => {
    let s = lesson(start(), 's1', 1);
    for (let i = 0; i < 10; i++) expect(E.questsToday(R(s, day(101, i / 10))).list.map((x) => x.kind)).toContain('review');
  });

  it('counts what the player does and opens the chest once all three are done', () => {
    let s = lesson(start(), 's1');
    const quests = E.questsToday(s);
    expect(quests.list.every((x) => x.have >= x.need)).toBe(true); // a clean first Station does every quest but Review
    expect(quests.chest).toBe('ready');
    const before = s.coins;
    s = R(s, { type: 'OPEN_QUEST_CHEST', value: 0.9999 });
    expect(s.coins - before).toBe(E.QUEST_CHEST[1]);
    expect(E.questsToday(s)).toMatchObject({ chest: 'open', won: E.QUEST_CHEST[1] });
    expect(s.events).toContain('chest');
    expect(R(s, { type: 'OPEN_QUEST_CHEST', value: 0.5 }).coins).toBe(s.coins);
  });

  it('a chest cannot be opened before the quests are done', () => {
    const s = start();
    expect(R(s, { type: 'OPEN_QUEST_CHEST', value: 0.5 }).coins).toBe(s.coins);
  });

  it('a finished Review does the Review quest', () => {
    let s = R(lesson(start(), 's1', 1), day(101));
    s = review(s);
    const item = E.questsToday(s).list.find((x) => x.kind === 'review');
    expect(item.have).toBe(item.need);
  });

  it('unfinished quests vanish on the next day with no penalty; a ready chest is paid', () => {
    let s = start();
    const coins = s.coins;
    s = R(s, day(101, 0.4));
    expect(E.questsToday(s).day).toBe(101);
    expect(s.coins).toBe(coins);
    let done = lesson(start(), 's1');
    const held = done.coins;
    done = R(done, day(101));
    expect(done.coins).toBe(held + E.QUEST_CHEST[0]);
    expect(E.questsToday(done).chest).toBe('shut');
  });

  it('quests from another day are not shown', () => {
    const s = { ...start(), today: 150 };
    expect(E.questsToday(s)).toBeNull();
  });
});

describe('The end of a Lesson with a streak', () => {
  it('adds a streak screen after the chest on the first Lesson of the day only', () => {
    let s = pass(start(), 's1');
    expect(s.end.streak).toEqual({ n: 1, milestone: false });
    s = R(s, cont, { type: 'OPEN_CHEST', value: 0 }, cont);
    expect(s.end.step).toBe('streak');
    expect(html(s)).toContain('class="streakbig"');
    s = R(s, cont);
    expect(s.end.step).toBe('onward');
    s = R(s, cont);
    const second = pass(s, 's2');
    expect(second.end.streak).toBeNull();
    expect(R(second, cont, { type: 'OPEN_CHEST', value: 0 }, cont).end.step).toBe('onward');
  });

  it('marks the seventh day as a milestone and asks once for a backup', () => {
    let s = start();
    const ids = ['s1', 's2', 's3', 's4', 's5', 's1', 's2'];
    for (let i = 0; i < 6; i++) s = lesson(R(s, day(100 + i)), ids[i]);
    expect(s.streak.n).toBe(6);
    expect(s.nudge7).toBeNull();
    s = pass(R(s, day(106)), ids[6]);
    expect(s.end.streak).toEqual({ n: 7, milestone: true });
    s = R(s, { type: 'BACK_TO_PATH' });
    expect(s.nudge7).toBe('due');
    expect(html(s)).toContain('class="nudge7"');
    s = R(s, { type: 'DISMISS_NUDGE' });
    expect(s.nudge7).toBe('done');
    expect(html(s)).not.toContain('class="nudge7"');
    s = lesson(R(s, day(107)), 's3');
    expect(s.nudge7).toBe('done');
  });
});

describe('What the player sees', () => {
  it('the header shows the streak, lit only once today counts', () => {
    let s = start();
    expect(html(s)).toMatch(/class="streakchip "[^>]*>/);
    s = lesson(s, 's1');
    expect(html(s)).toMatch(/class="streakchip on"/);
  });

  it('the Path lists the quests with their counts and the chest when it is ready', () => {
    let s = start();
    let out = html(s);
    expect(out).toContain('class="panel quests');
    expect((out.match(/class="quest"/g) || []).length).toBeGreaterThanOrEqual(3);
    s = lesson(s, 's1');
    out = html(s);
    expect(out).toContain(q({ type: 'OPEN_QUEST_CHEST' }));
    expect(out).toContain(`${E.QUEST_CHEST[0]}`);
    s = R(s, { type: 'OPEN_QUEST_CHEST', value: 0 });
    expect(html(s)).toContain(`+<span class="cn">${E.QUEST_CHEST[0]}</span>`);
  });

  it('the week of dots starts on the first day of the streak and fills from the start side', () => {
    const dots = (s) => [...html(R(s, { type: 'OPEN_PROFILE' })).matchAll(/class="dayd ([a-z ]*)"/g)].map((m) => m[1].trim());
    let s = start();
    expect(dots(s)).toEqual(['now', '', '', '', '', '', '']); // nothing yet: today is the first circle
    s = lesson(s, 's1');
    expect(dots(s)).toEqual(['on now', '', '', '', '', '', '']);
    s = lesson(R(s, day(101)), 's2');
    expect(dots(s)).toEqual(['on', 'on now', '', '', '', '', '']);
    s = R(s, day(102));
    expect(dots(s)).toEqual(['on', 'on', 'now', '', '', '', '']);
    // the eighth day of a streak starts a new row
    s = { ...s, streak: { n: 7, best: 7, last: 106, from: 100 }, marks: { 100: 'on', 101: 'on', 102: 'on', 103: 'on', 104: 'on', 105: 'on', 106: 'on' } };
    s = R(s, day(107));
    expect(dots(s)).toEqual(['now', '', '', '', '', '', '']);
    // a save from before the first day was kept
    s = { ...s, streak: { n: 3, best: 7, last: 107 }, marks: { 105: 'on', 106: 'on', 107: 'on' } };
    expect(dots(s)).toEqual(['on', 'on', 'on now', '', '', '', '']);
  });

  it('the Profile shows the streak, the last seven days, the freezes and the price', () => {
    let s = lesson(start(), 's1');
    s = R({ ...s, coins: 600, earned: 600 }, { type: 'OPEN_PROFILE' });
    let out = html(s);
    expect(out).toContain('class="streakpanel"');
    expect((out.match(/class="dayd[ "]/g) || []).length).toBe(7);
    expect(out).toContain(q({ type: 'BUY_FREEZE' }));
    expect(out).toContain(`${E.FREEZE_PRICE}`);
    s = R(s, { type: 'BUY_FREEZE' }, { type: 'BUY_FREEZE' });
    out = html(s);
    expect(out).toMatch(/BUY_FREEZE[^>]*disabled/);
    expect(out).toContain('100'); // Coins held after two freezes
    expect(out).toContain('600'); // Coins earned stays
  });

  it('tells the player when a freeze saved the streak and when the streak ended', () => {
    let s = lesson(start(), 's1');
    const saved = R({ ...s, freezes: 1 }, day(102));
    expect(html(saved)).toContain('class="streaknote frozen"');
    expect(html(R(saved, { type: 'DISMISS_STREAK_NOTE' }))).not.toContain('class="streaknote');
    expect(html(R(s, day(102)))).toContain('class="streaknote lost"');
  });

  it('renders in Farsi with Persian digits', () => {
    const s = R(lesson(start(), 's1'), { type: 'SET_MODE', value: 'FA' }, { type: 'OPEN_PROFILE' });
    const out = html(s);
    expect(out).toContain('class="streakpanel"');
    expect(out).toContain('۲۵۰');
  });
});

describe('Saved progress', () => {
  it('a save from before this release loads with no streak', () => {
    const s = R(E.initial(), { type: 'HYDRATE', value: { coins: 9, xp: 50 } }, day(100));
    expect(s).toMatchObject({ streak: { n: 0, best: 0, last: null }, freezes: 0, nudge7: null });
    expect(E.questsToday(s).list).toHaveLength(3);
  });

  it('a backup carries the streak, the freezes, the marks and the quests', () => {
    let s = lesson(start(), 's1');
    s = R({ ...s, coins: 600, earned: 600 }, { type: 'BUY_FREEZE' });
    const back = FI.store.parseBackup(FI.store.backup(s, '2026-11-14'));
    expect(back.ok).toBe(true);
    const r = R({ ...E.initial(), today: 100 }, { type: 'RESTORE', value: back.data });
    expect(r).toMatchObject({ streak: s.streak, freezes: 1, marks: s.marks });
    expect(E.questsToday(r)).toEqual(E.questsToday(s));
  });

  it('refuses damaged values for the new fields', () => {
    const bad = (d) => E.badKeys(d);
    expect(bad({ streak: { n: -1, best: 0, last: null } })).toContain('streak');
    expect(bad({ streak: { n: 1, best: 1 } })).toContain('streak');
    expect(bad({ freezes: 3 })).toContain('freezes');
    expect(bad({ marks: { 100: 'maybe' } })).toContain('marks');
    expect(bad({ quests: { day: 1, list: [{ kind: 'steal', need: 1, have: 0 }], chest: 'shut', won: 0 } })).toContain('quests');
    expect(bad({ quests: { day: 1, list: [], chest: 'wide', won: 0 } })).toContain('quests');
    expect(bad({ nudge7: 'soon' })).toContain('nudge7');
    expect(bad({ streak: { n: 2, best: 4, last: 99 }, freezes: 2, marks: { 99: 'on', 98: 'frz' }, quests: null, nudge7: 'done' })).toEqual([]);
  });
});
