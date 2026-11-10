import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';

// Decisions 30 to 37, ADR-0010: books are Sections of Circles of Lessons, loaded on demand.
const here = path.dirname(fileURLToPath(import.meta.url));
const v3dir = path.join(here, '..', 'content', 'books', 'v3');
const files = fs.existsSync(v3dir) ? fs.readdirSync(v3dir).filter((f) => /^b\d\d\.json$/.test(f)).sort() : [];
const readBook = (f) => JSON.parse(fs.readFileSync(path.join(v3dir, f), 'utf8'));

const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
const right = (stationId, id) => ({ type: 'ANSWER', value: content.item(stationId, id).answer });
const fixture = files.length ? readBook(files[0]) : null; // smallest id on disk; the pilot low-tier book when present

function passLesson(s, stationId) {
  s = R(s, { type: 'OPEN_STATION', value: stationId });
  let guard = 600;
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

describe('Manifest: Sections of Circles of Lessons', () => {
  const books = content.sections.filter((x) => x.kind === 'book');
  it('every book Section carries Circles and Lessons sized by tier (decisions 31 and 35)', () => {
    expect(books.length).toBeGreaterThanOrEqual(1);
    for (const sec of books) {
      const want = { high: 3, mid: 2, low: 1 }[sec.tier];
      expect(sec.circles.length, `${sec.bookId} circles`).toBe(want);
      for (const c of sec.circles) {
        expect(c.lessons.length, c.id).toBeGreaterThanOrEqual(3);
        expect(c.lessons.length, c.id).toBeLessThanOrEqual(5);
        expect(c.xp).toBe(content.CIRCLE_XP);
      }
      expect(sec.xp).toBe(content.SECTION_XP);
      expect(sec.units).toEqual(sec.circles.flatMap((c) => c.lessons));
    }
  });

  it('the ten reading-order books are high tier; other must-reads mid; optionals low', () => {
    for (const sec of books) {
      const expected = content.readingOrder.includes(sec.bookId) ? 'high' : sec.must ? 'mid' : 'low';
      expect(sec.tier, sec.bookId).toBe(expected);
    }
  });

  it('a Lesson is a station stub until its book is registered', () => {
    const sec = books[0];
    const lessonId = sec.circles[0].lessons[0];
    const st = content.station(lessonId);
    expect(st.book).toBe(true);
    expect(st.bookId).toBe(sec.bookId);
    expect(st.circleId).toBe(sec.circles[0].id);
    expect(st.xp).toBe(content.LESSON_XP);
    expect(st.points).toBeGreaterThanOrEqual(10);
    expect(st.minutes).toBeGreaterThan(0);
    expect(content.isLoaded(sec.bookId)).toBe(false);
    expect(st.items).toBeNull();
    expect(content.bookUrl(sec.bookId)).toBe(`content/books/v3/${sec.bookId}.json`);
  });

  it('registerBook fills the Lessons of that book with items', () => {
    expect(fixture, 'a v3 book file on disk').toBeTruthy();
    content.registerBook(fixture);
    expect(content.isLoaded(fixture.id)).toBe(true);
    const l = fixture.circles[0].lessons[0];
    expect(content.station(l.id).items.length).toBe(l.items.length);
    expect(content.item(l.id, l.items[0].id).frame).toBe(true);
    expect(content.circleOf(l.id).id).toBe(fixture.circles[0].id);
  });

  it('totalXp sums Basics, Lessons, Circles, Sections and the Milestone', () => {
    const lessons = content.stations.filter((st) => st.book).length;
    const circles = books.reduce((a, sec) => a + sec.circles.length, 0);
    const sum = content.allStations().reduce((a, st) => a + st.xp, 0) + lessons * content.LESSON_XP + circles * content.CIRCLE_XP + books.length * content.SECTION_XP + content.MILESTONE_XP;
    expect(content.totalXp()).toBe(sum);
  });
});

describe('Engine: Lessons, Circles, Sections (decision 37)', () => {
  it('opening an unloaded Lesson is ignored; the app loads the book first', () => {
    const unloaded = content.stations.find((st) => st.book && !content.isLoaded(st.bookId));
    if (!unloaded) return; // only one book on disk and it is loaded
    const s = R(engine.initial(), { type: 'OPEN_STATION', value: unloaded.id });
    expect(s.screen).toBe('path');
  });

  it('a Lesson Fare pays 10 XP; the last Lesson completes the Circle (+25); the last Circle completes the Section (badge, +50)', () => {
    content.registerBook(fixture);
    const sec = content.sectionOf(fixture.id);
    let s = engine.initial();
    let lessonsDone = 0;
    for (const c of sec.circles) {
      for (const lid of c.lessons) {
        s = passLesson(s, lid); lessonsDone++;
        expect(s.lit[lid]).toBe(true);
      }
      expect(s.lit[c.id]).toBe(true);
    }
    expect(s.lit[sec.id]).toBe(true);
    const circles = sec.circles.length;
    expect(s.xp).toBe(lessonsDone * content.LESSON_XP + circles * content.CIRCLE_XP + content.SECTION_XP);
  });

  it('events: circle on the Circle, section on the Section', () => {
    content.registerBook(fixture);
    const sec = content.sectionOf(fixture.id);
    let s = engine.initial();
    const c = sec.circles[0];
    for (const lid of c.lessons.slice(0, -1)) s = passLesson(s, lid);
    const last = c.lessons[c.lessons.length - 1];
    s = R(s, { type: 'OPEN_STATION', value: last });
    let guard = 600;
    while (s.phase !== 'fare' && guard-- > 0) s = s.phase === 'card' ? R(s, { type: 'RATE', value: 'knew' }) : s.phase === 'check' ? R(s, right(last, s.current)) : R(s, { type: 'CONTINUE' });
    for (const id of s.fare.questions) s = R(s, right(last, id));
    expect(s.events).toContain('lit');
    expect(s.events).toContain('circle');
    if (sec.circles.length === 1) expect(s.events).toContain('section'); else expect(s.events).not.toContain('section');
  });

  it('a bookmark snapshots the Card text so the list works without the book loaded', () => {
    content.registerBook(fixture);
    const l = fixture.circles[0].lessons[0];
    const card = l.items.find((i) => i.kind === 'card');
    const s = R(engine.initial(), { type: 'TOGGLE_BOOKMARK', value: { stationId: l.id, cardId: card.id } });
    expect(s.bookmarks[0]).toEqual({ stationId: l.id, cardId: card.id, text: card.text });
  });
});

describe('Migration v2 to v3 (decision 33): Basics kept, book progress fresh', () => {
  const v2 = {
    v: 1, mode: 'FA', coins: 31, xp: 50 + 20 + 20 + 100, milestone: true,
    lit: { s1: true, b01u1: true, b01u2: true, s3: false },
    farePassed: { s1: true, b01u1: true, b01u2: true },
    awarded: { s1k1: true, s1k2: true, b01k1: true, b01ak1: true },
    rings: { s1: 2, b01u1: 2, b01u2: 2 },
    bookmarks: [{ stationId: 'b01u2', cardId: 'b01c5' }, { stationId: 's1', cardId: 's1c1' }],
    run: { stationId: 'b01u3', pos: 2 },
    shelf: { b01: 'read' }, checklists: { before: [true, true, true], after: [true, true, true] },
  };
  it('drops Unit, Section and book Check keys, book bookmarks and a book run; keeps Basics, coins, shelf, checklists; recomputes XP', () => {
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v2) }) });
    expect(Object.keys(s.lit).filter((k) => /^b\d\d/.test(k))).toEqual([]);
    expect(s.lit.s1).toBe(true);
    expect(Object.keys(s.farePassed)).toEqual(['s1']);
    expect(Object.keys(s.awarded).sort()).toEqual(['s1k1', 's1k2']);
    expect(s.rings).toEqual({ s1: 2 });
    expect(s.bookmarks).toEqual([{ stationId: 's1', cardId: 's1c1' }]);
    expect(s.screen).toBe('path');
    expect(s.coins).toBe(31);
    expect(s.shelf.b01).toBe('read');
    expect(s.milestone).toBe(true);
    expect(s.xp).toBe(content.station('s1').xp + content.MILESTONE_XP);
    expect(s.mode).toBe('FA');
  });

  it('a v1 document (whole-book keys) migrates the same way', () => {
    const v1 = { v: 1, xp: 70, lit: { s1: true, b01: true }, farePassed: { s1: true, b01: true }, rings: { s1: 1, b01: 4 }, awarded: { s1k1: true, b01k1: true }, bookmarks: [{ stationId: 'b01', cardId: 'b01c5' }], run: { stationId: 'b01', pos: 3 } };
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v1) }) });
    expect(s.lit).toEqual({ s1: true });
    expect(s.xp).toBe(content.station('s1').xp);
    expect(s.bookmarks).toEqual([]);
  });

  it('a v3 document passes through untouched', () => {
    content.registerBook(fixture);
    const lid = fixture.circles[0].lessons[0].id;
    const v3 = { v: 1, xp: 60, lit: { s1: true, [lid]: true }, farePassed: { s1: true, [lid]: true }, rings: { s1: 1, [lid]: 3 }, awarded: {}, bookmarks: [], run: null };
    const s = R(engine.initial(), { type: 'HYDRATE', value: store.load({ getItem: () => JSON.stringify(v3) }) });
    expect(s.lit).toEqual({ s1: true, [lid]: true });
    expect(s.xp).toBe(60);
  });
});
