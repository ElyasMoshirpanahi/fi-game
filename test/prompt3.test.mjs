import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
const right = (stationId, id) => ({ type: 'ANSWER', value: content.item(stationId, id).answer });

function passStation(s, stationId) {
  s = R(s, { type: 'OPEN_STATION', value: stationId });
  let guard = 400;
  while (s.phase !== 'fare' && guard-- > 0) {
    if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    else if (s.phase === 'widget') s = R(s, { type: 'CONTINUE' });
    else if (s.phase === 'check') s = R(s, right(stationId, s.current));
    else if (s.phase === 'correct' || s.phase === 'revealed') s = R(s, { type: 'CONTINUE' });
    else throw new Error(`unexpected phase ${s.phase} in ${stationId}`);
  }
  if (guard <= 0) throw new Error(`no Fare reached in ${stationId}`);
  for (const id of s.fare.questions) s = R(s, right(stationId, id));
  return R(s, { type: 'CONTINUE' });
}

describe('Prompt 3: six Stations on the Path, Book Units off the Path', () => {
  it('the Path has exactly six Stations, all with content', () => {
    const all = content.allStations();
    expect(all.map((s) => s.id)).toEqual(['s1', 's2', 's3', 's4', 's5', 's6']);
    for (const st of all) expect(st.items.length, st.id).toBeGreaterThan(0);
  });

  it('Book Units exist as Stations with book: true and are not on the Path', () => {
    const books = content.stations.filter((s) => s.book);
    expect(books.length).toBeGreaterThanOrEqual(1);
    for (const b of books) {
      expect(content.allStations().some((s) => s.id === b.id)).toBe(false);
      expect(b.items.filter((i) => i.kind === 'check').length).toBeGreaterThanOrEqual(b.fareSize);
    }
  });

  it('Station 3 derives only true/false Checks and has at least four', () => {
    const s3 = content.station('s3');
    const checks = s3.items.filter((i) => i.kind === 'check');
    expect(checks.length).toBeGreaterThanOrEqual(4);
    expect(checks.every((k) => k.type === 'tf')).toBe(true);
  });
});

describe('Widgets: sliders, habits, journal, checklists, shelf', () => {
  it('a widget item is a phase of its own and Continue moves on', () => {
    let s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' });
    let guard = 50;
    while (s.phase !== 'widget' && guard-- > 0) s = R(s, s.phase === 'card' ? { type: 'RATE', value: 'knew' } : s.phase === 'check' ? right('s1', s.current) : { type: 'CONTINUE' });
    expect(s.phase).toBe('widget');
    expect(content.item('s1', s.current).widget).toBe('sliders');
    s = R(s, { type: 'CONTINUE' });
    expect(['card', 'check', 'fare']).toContain(s.phase);
  });

  it('SET_SLIDER stores a value and it is durable', () => {
    const s = R(engine.initial(), { type: 'SET_SLIDER', value: { key: 'capital', value: 100000 } });
    expect(s.sliders.capital).toBe(100000);
    expect(store.durable(s).sliders.capital).toBe(100000);
  });

  it('a new ISO week starts the tracker empty (Step 9 review finding)', () => {
    let s = R(engine.initial(), { type: 'TOGGLE_HABIT', value: { habit: 'read', day: 1, week: '2026-W46' } });
    expect(s.habits.read[1]).toBe(true);
    expect(s.habitsWeek).toBe('2026-W46');
    s = R(s, { type: 'TOGGLE_HABIT', value: { habit: 'body', day: 3, week: '2026-W47' } });
    expect(s.habits.read).toBeUndefined();
    expect(s.habits.body[3]).toBe(true);
    expect(store.durable(s).habitsWeek).toBe('2026-W47');
  });

  it('TOGGLE_HABIT flips one cell of the weekly tracker', () => {
    let s = R(engine.initial(), { type: 'TOGGLE_HABIT', value: { habit: 'read', day: 2 } });
    expect(s.habits.read[2]).toBe(true);
    s = R(s, { type: 'TOGGLE_HABIT', value: { habit: 'read', day: 2 } });
    expect(s.habits.read[2]).toBe(false);
  });

  it('SET_JOURNAL keeps the text and a review date, no Date call inside the engine', () => {
    const s = R(engine.initial(), { type: 'SET_JOURNAL', value: { text: 'Bought VWCE because...', reviewDate: '2027-05-09' } });
    expect(s.journal).toEqual({ text: 'Bought VWCE because...', reviewDate: '2027-05-09' });
  });

  it('SET_SHELF sets a book reading state to one of To-read, Reading, Read', () => {
    let s = R(engine.initial(), { type: 'SET_SHELF', value: { bookId: 'b01', state: 'reading' } });
    expect(s.shelf.b01).toBe('reading');
    s = R(s, { type: 'SET_SHELF', value: { bookId: 'b01', state: 'bogus' } });
    expect(s.shelf.b01).toBe('reading');
  });

  it('OPEN_TOOLS shows a Station’s widgets without starting its run', () => {
    const s = R(engine.initial(), { type: 'OPEN_TOOLS', value: 's4' });
    expect(s.screen).toBe('tools');
    expect(s.stationId).toBe('s4');
    expect(s.queue).toEqual([]);
  });
});

describe('Milestone: First €100 of ownership income', () => {
  const lists = content.checklists;
  const completeAll = (s) => {
    lists.forEach((l) => { l.items.forEach((_, i) => { s = R(s, { type: 'TOGGLE_CHECK', value: { list: l.id, index: i } }); }); });
    return s;
  };

  it('two Checklists exist, taken from the source', () => {
    expect(lists.map((l) => l.id)).toEqual(['before', 'after']);
    expect(lists[0].items).toHaveLength(3);
    expect(lists[1].items).toHaveLength(3);
  });

  it('is granted only when every item of both Checklists is checked, once, with XP', () => {
    let s = engine.initial();
    expect(s.milestone).toBe(false);
    s = R(s, { type: 'TOGGLE_CHECK', value: { list: 'before', index: 0 } });
    expect(s.milestone).toBe(false);
    s = completeAll(s); // toggles 'before' 0 back off
    expect(s.milestone).toBe(false);
    s = R(s, { type: 'TOGGLE_CHECK', value: { list: 'before', index: 0 } });
    expect(s.milestone).toBe(true);
    expect(s.events).toContain('milestone');
    const xp = s.xp;
    s = R(s, { type: 'TOGGLE_CHECK', value: { list: 'after', index: 2 } }, { type: 'TOGGLE_CHECK', value: { list: 'after', index: 2 } });
    expect(s.milestone).toBe(true); // never revoked
    expect(s.xp).toBe(xp);
  });

  it('the Milestone, farePassed and checklists survive a reload (bug found in the Prompt 3 play-test)', () => {
    let s = completeAll(engine.initial());
    s = R(s, { type: 'OPEN_STATION', value: 's3' });
    const d = store.durable(s);
    expect(d.milestone).toBe(true);
    expect(d).toHaveProperty('farePassed');
    const again = R(engine.initial(), { type: 'HYDRATE', value: JSON.parse(JSON.stringify(d)) });
    expect(again.milestone).toBe(true);
    expect(again.checklists.after).toEqual([true, true, true]);
  });
});

describe('Rewards on three horizons', () => {
  it('a Station Fare pays the Station’s own XP; a Book Unit pays 20', () => {
    const book = content.stations.find((s) => s.book);
    let s = passStation(engine.initial(), 's3');
    expect(s.lit.s3).toBe(true);
    expect(s.xp).toBe(content.station('s3').xp);
    const before = s.xp;
    s = passStation(s, book.id);
    expect(s.lit[book.id]).toBe(true);
    expect(s.xp).toBe(before + 20);
  });

  it('the Library lights only when its Fare passed and all ten Reading Order books are Lit', () => {
    let s = passStation(engine.initial(), 's6');
    expect(s.farePassed.s6).toBe(true);
    expect(s.lit.s6).toBeUndefined();
    for (const id of content.readingOrder) s = passStation(s, id);
    expect(s.lit.s6).toBe(true);
    expect(s.xp).toBe(content.station('s6').xp + content.readingOrder.length * 20);
  });

  it('total XP available is the sum over Path Stations and Book Units', () => {
    const total = content.totalXp();
    const sum = content.stations.reduce((a, st) => a + st.xp, 0) + content.MILESTONE_XP;
    expect(total).toBe(sum);
  });
});

describe('Resume after a correct answer skips the answered Check', () => {
  it('reload after Correct lands on the next item', () => {
    let s = R(engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' }, right('s1', 's1k1'));
    expect(s.phase).toBe('correct');
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.durable(s) });
    expect(again.current).not.toBe('s1k1');
    expect(again.current).toBe(content.station('s1').items[2].id);
  });
});
