import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

// Decisions 22 to 28: the Path is Sections of Units; books join the Path in reading order.
const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
const right = (stationId, id) => ({ type: 'ANSWER', value: content.item(stationId, id).answer });

function passUnit(s, stationId) {
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
  return s;
}

describe('Sections on the Path', () => {
  const secs = content.sections;
  const books = secs.filter((x) => x.kind === 'book');

  it('Section 1 is Basics with the six Stations, then one Section per book, 29 in all', () => {
    expect(secs[0].id).toBe('basics');
    expect(secs[0].units).toEqual(['s1', 's2', 's3', 's4', 's5', 's6']);
    expect(secs).toHaveLength(29);
    expect(books).toHaveLength(28);
  });

  it('book Sections follow the reading order, then stage order with must-reads first (decision 24)', () => {
    const ids = books.map((b) => b.bookId);
    expect(ids.slice(0, 10)).toEqual(content.readingOrder);
    const rest = books.slice(10);
    for (let i = 1; i < rest.length; i++) {
      const a = rest[i - 1], b = rest[i];
      const key = (x) => x.stage * 2 + (x.must ? 0 : 1);
      expect(key(a) <= key(b), `${a.bookId} before ${b.bookId}`).toBe(true);
    }
  });

  it('every book Section has three Units: two halves of the book and "Put it to work" (decision 23)', () => {
    for (const sec of books) {
      expect(sec.units).toEqual([`${sec.bookId}u1`, `${sec.bookId}u2`, `${sec.bookId}u3`]);
      for (const uid of sec.units) {
        const u = content.station(uid);
        expect(u, uid).toBeTruthy();
        expect(u.book).toBe(true);
        expect(u.bookId).toBe(sec.bookId);
        expect(u.xp).toBe(20); // decision 26
        const checks = u.items.filter((i) => i.kind === 'check');
        expect(checks.length, uid).toBeGreaterThanOrEqual(2); // decision 23: a two-question Fare at least
        expect(u.fareSize, uid).toBeLessThanOrEqual(checks.length);
      }
      const u3 = content.station(`${sec.bookId}u3`);
      expect(u3.items.filter((i) => i.kind === 'card')).toHaveLength(4);
      expect(u3.items.every((i) => i.id.startsWith(`${sec.bookId}a`))).toBe(true);
      expect(u3.addition).toBe(true);
    }
  });

  it('Units 1 and 2 together hold exactly the original Cards and Checks, each Check with its source Card', () => {
    for (const sec of books) {
      const u1 = content.station(`${sec.bookId}u1`), u2 = content.station(`${sec.bookId}u2`);
      for (const u of [u1, u2]) for (const k of u.items.filter((i) => i.kind === 'check')) expect(u.items.some((i) => i.id === k.source), `${k.id} source in its Unit`).toBe(true);
      const ids = [...u1.items, ...u2.items].map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.every((id) => /^b\d\d[ck]\d+$/.test(id))).toBe(true);
    }
  });

  it('sectionOf(bookId) and the Shelf jump target', () => {
    expect(content.sectionOf('b01').id).toBe('sec-b01');
    expect(content.sectionOf('nope')).toBeUndefined();
  });

  it('totalXp sums Units, Section bonuses, Basics Stations and the Milestone', () => {
    const sum = content.stations.reduce((a, st) => a + st.xp, 0) + books.length * content.SECTION_XP + content.MILESTONE_XP;
    expect(content.totalXp()).toBe(sum);
  });
});

describe('Section rewards (decision 26)', () => {
  it('a Unit Fare pays 20 XP and no badge; the third Unit completes the Section: badge and 30 XP', () => {
    let s = passUnit(engine.initial(), 'b01u1');
    expect(s.lit.b01u1).toBe(true);
    expect(s.xp).toBe(20);
    expect(s.lit['sec-b01']).toBeUndefined();
    s = R(s, { type: 'CONTINUE' });
    s = passUnit(s, 'b01u2');
    s = R(s, { type: 'CONTINUE' });
    s = passUnit(s, 'b01u3');
    expect(s.lit['sec-b01']).toBe(true);
    expect(s.events).toContain('section');
    expect(s.xp).toBe(3 * content.station('b01u1').xp + content.SECTION_XP);
    expect(content.sectionOf('b01').badge.en).toBeTruthy();
  });

  it('the Library lights only when the ten reading-order Sections are complete', () => {
    let s = passUnit(engine.initial(), 's6');
    s = R(s, { type: 'CONTINUE' });
    expect(s.lit.s6).toBeUndefined();
    for (const b of content.readingOrder) for (const u of content.sectionOf(b).units) { s = passUnit(s, u); s = R(s, { type: 'CONTINUE' }); }
    expect(s.lit.s6).toBe(true);
  });

  it('after a Unit Fare, Continue returns to the Path, not the Shelf', () => {
    let s = passUnit(engine.initial(), 'b23u1');
    s = R(s, { type: 'CONTINUE' });
    expect(s.screen).toBe('path');
  });
});

describe('Migration from v1 progress (decision 27)', () => {
  const v1 = {
    v: 1, mode: 'EN', muted: false, coins: 9, xp: 70, milestone: false,
    lit: { s1: true, b01: true }, farePassed: { s1: true, b01: true },
    awarded: { s1k1: true, b01k1: true, b01k2: true, b01k3: true, b01k4: true },
    rings: { s1: 1, b01: 4 },
    bookmarks: [{ stationId: 'b01', cardId: 'b01c5' }, { stationId: 's1', cardId: 's1c1' }],
    run: { stationId: 'b01', pos: 3 },
    shelf: { b01: 'read' },
  };

  it('a lit book becomes Units 1 and 2 lit; XP, coins, shelf and Station progress are kept', () => {
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v1) }) });
    expect(s.lit.b01u1).toBe(true);
    expect(s.lit.b01u2).toBe(true);
    expect(s.lit.b01u3).toBeUndefined();
    expect(s.lit.b01).toBeUndefined();
    expect(s.lit.s1).toBe(true);
    expect(s.farePassed.b01u1).toBe(true);
    expect(s.xp).toBe(70);
    expect(s.coins).toBe(9);
    expect(s.shelf.b01).toBe('read');
  });

  it('rings are recounted per Unit from awarded Checks', () => {
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v1) }) });
    const u1 = content.station('b01u1').items.filter((i) => i.kind === 'check').length;
    const u2 = content.station('b01u2').items.filter((i) => i.kind === 'check').length;
    expect(s.rings.b01u1).toBe(u1);
    expect(s.rings.b01u2).toBe(u2);
    expect(s.rings.b01).toBeUndefined();
  });

  it('bookmarks move to the Unit that holds their Card; a run inside a book is dropped', () => {
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v1) }) });
    const holder = ['b01u1', 'b01u2'].find((u) => content.item(u, 'b01c5'));
    expect(s.bookmarks).toEqual([{ stationId: holder, cardId: 'b01c5' }, { stationId: 's1', cardId: 's1c1' }]);
    expect(s.screen).toBe('path');
  });

  it('migration runs once: a v2 document passes through unchanged', () => {
    const v2 = { ...v1, lit: { s1: true, b01u1: true, b01u2: true }, farePassed: { s1: true, b01u1: true, b01u2: true }, rings: { s1: 1, b01u1: 2, b01u2: 2 }, bookmarks: [], run: null };
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v2) }) });
    expect(s.lit).toEqual({ s1: true, b01u1: true, b01u2: true });
    expect(s.rings).toEqual({ s1: 1, b01u1: 2, b01u2: 2 });
  });
});
