import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';
import { reducer, fakeStorage } from './helpers.mjs';

// Spec 7 (issue #14): Continue, search, and the phone pass. Continue and search are pure and tested here;
// the 360 px check runs in a headless browser.
const here = path.dirname(fileURLToPath(import.meta.url));
const book = (id) => JSON.parse(fs.readFileSync(path.join(here, '..', 'content', 'books', 'v3', `${id}.json`), 'utf8'));
let FI, R, node;
beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  R = reducer(FI.engine, FI.content);
  FI.content.registerBook(book('b04'), 'b04');
  node = { innerHTML: '', querySelector: () => null };
});
const html = (s) => { FI.render.render(node, s, FI.content); return node.innerHTML; };
const litAll = (s, ids) => { for (const id of ids) s.lit[id] = true; return s; };

describe('Continue', () => {
  it('with no history it is the first unlit Station in Path order', () => {
    expect(FI.engine.continueTarget(FI.engine.initial(), FI.content)).toEqual({ stationId: 's1', sectionId: 'basics' });
    const s = litAll(FI.engine.initial(), ['s1', 's2']);
    expect(FI.engine.continueTarget(s, FI.content).stationId).toBe('s3');
  });

  it('follows the Section last played, not the list order', () => {
    const sec = FI.content.sectionOf('b04');
    let s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: sec.runs[0] }, { type: 'BACK_TO_PATH' });
    expect(s.lastSection).toBe(sec.id);
    expect(FI.engine.continueTarget(s, FI.content)).toEqual({ stationId: sec.runs[0], sectionId: sec.id });
    s = litAll(s, [sec.runs[0]]);
    expect(FI.engine.continueTarget(s, FI.content).stationId).toBe(sec.runs[1]);
  });

  it('falls back to Path order when the Section last played is finished', () => {
    const sec = FI.content.sectionOf('b04');
    let s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: sec.runs[0] }, { type: 'BACK_TO_PATH' });
    s = litAll(s, sec.runs);
    expect(FI.engine.continueTarget(s, FI.content)).toEqual({ stationId: 's1', sectionId: 'basics' });
  });

  it('a Station whose Fare is passed counts as done even while it waits to light (the Library)', () => {
    const s = litAll(FI.engine.initial(), ['s1', 's2', 's3', 's4', 's5']);
    s.farePassed.s6 = true;
    const first = FI.content.sections[1];
    expect(FI.engine.continueTarget(s, FI.content)).toEqual({ stationId: first.runs[0], sectionId: first.id });
  });

  it('is null when everything is lit', () => {
    const s = litAll(FI.engine.initial(), FI.content.sections.flatMap((x) => x.runs));
    expect(FI.engine.continueTarget(s, FI.content)).toBeNull();
  });

  it('the Section last played is saved, and a bad value is dropped on load', () => {
    const sec = FI.content.sectionOf('b04');
    const s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: sec.runs[0] });
    const storage = fakeStorage(); FI.store.save(storage, s);
    expect(R(FI.engine.initial(), { type: 'HYDRATE', value: FI.store.load(storage) }).lastSection).toBe(sec.id);
    expect(R(FI.engine.initial(), { type: 'HYDRATE', value: { lastSection: { x: 1 } } }).lastSection).toBeNull();
    expect(R(FI.engine.initial(), { type: 'HYDRATE', value: { lastSection: 'x'.repeat(41) } }).lastSection).toBeNull();
    // a save from before Continue existed: resuming inside a Lesson sets it
    const resumed = R(FI.engine.initial(), { type: 'HYDRATE', value: { run: { stationId: sec.runs[1], pos: 1 } } });
    expect(resumed.lastSection).toBe(sec.id);
    expect(FI.engine.continueTarget(R(FI.engine.initial(), { type: 'HYDRATE', value: { lastSection: 'sec-gone' } }), FI.content).stationId).toBe('s1');
  });

  it('opening a Card from a bookmark also sets it; Basics set it to the Basics Section', () => {
    expect(R(FI.engine.initial(), { type: 'OPEN_STATION', value: 's2' }).lastSection).toBe('basics');
    const sec = FI.content.sectionOf('b04');
    const lesson = FI.content.station(sec.runs[1]);
    const card = lesson.items.find((i) => i.kind === 'card');
    expect(R(FI.engine.initial(), { type: 'OPEN_AT', value: { stationId: lesson.id, cardId: card.id } }).lastSection).toBe(sec.id);
  });
});

describe('Search', () => {
  const find = (q, limit) => FI.content.search(q, limit);
  const kinds = (rows) => rows.map((r) => r.kind);

  it('needs at least two characters', () => {
    expect(find('')).toEqual([]);
    expect(find(' m ')).toEqual([]);
  });

  it('finds a book by its title or author and leads to its Section', () => {
    const rows = find('psychology of money');
    expect(rows[0]).toMatchObject({ kind: 'section', sectionId: 'sec-b01' });
    expect(find('housel').some((r) => r.kind === 'section' && r.sectionId === 'sec-b01')).toBe(true);
  });

  it('finds a Lesson by its title and says which book and Circle it is in', () => {
    const sec = FI.content.sectionOf('b04');
    const lesson = FI.content.station(sec.runs[0]);
    const rows = find(lesson.name.en.toLowerCase());
    const hit = rows.find((r) => r.kind === 'lesson' && r.stationId === lesson.id);
    expect(hit).toBeTruthy();
    expect(hit.book).toBe(sec.title);
    expect(hit.circle).toEqual(FI.content.circleOf(lesson.id).title);
  });

  it('finds a Basics Station by name', () => {
    const st = FI.content.station('s3');
    expect(find(st.name.en).some((r) => r.kind === 'lesson' && r.stationId === 's3')).toBe(true);
  });

  it('finds a Card by its text and says where to open it', () => {
    const card = FI.content.station('s1').items.find((i) => i.id === 's1c3');
    const word = card.text.en.split(' ').find((w) => w.length > 7).replace(/[^\w]/g, '');
    const hit = find(word).find((r) => r.kind === 'card' && r.cardId === 's1c3');
    expect(hit).toMatchObject({ stationId: 's1', cardId: 's1c3' });
    expect(hit.text).toEqual(card.text);
  });

  it('matches Farsi, whichever form of ی and ک was typed, with or without the half-space', () => {
    const card = FI.content.station('s1').items.find((i) => i.id === 's1c3');
    const word = card.text.fa.split(' ').find((w) => w.length > 5);
    expect(find(word, 500).some((r) => r.cardId === 's1c3')).toBe(true); // a common word: look past the default limit
    expect(find(word.replace(/ی/g, 'ي').replace(/ک/g, 'ك'), 500).some((r) => r.cardId === 's1c3')).toBe(true);
    expect(find('سرمايه').length).toBeGreaterThan(0); // typed with the Arabic ي
    expect(find('می شود', 5000).length).toBe(find('می‌شود', 5000).length);
    expect(find('میشود', 5000).length).toBe(find('می‌شود', 5000).length); // typed with no half-space at all
  });

  it('forgives how people type: apostrophes, accents, Farsi vowel marks, any digit set', () => {
    const n = (q) => find(q, 5000).length;
    expect(n('don’t')).toBe(n("don't"));
    expect(n("don't")).toBeGreaterThan(0);
    expect(n('٢٥')).toBe(n('25'));
    expect(n('۲۵')).toBe(n('25'));
    expect(n('25')).toBeGreaterThan(0);
    expect(n('اینده')).toBe(n('آینده'));
    const marked = FI.content.stations.flatMap((st) => st.items || []).find((i) => i.kind === 'card' && /[\u064B-\u0652]/.test(i.text.fa));
    if (marked) {
      const word = marked.text.fa.split(' ').find((w) => /[\u064B-\u0652]/.test(w));
      expect(find(word.replace(/[\u064B-\u0652]/g, ''), 5000).some((r) => r.cardId === marked.id)).toBe(true);
    }
    expect(FI.content.matcher('m')).toBeNull();
    expect(FI.content.matcher('ca')('Café')).toBe(true);
  });

  it('searches Cards only in books that are loaded', () => {
    const b05 = book('b05');
    const card = b05.circles[0].lessons[0].items.find((i) => i.kind === 'card' && !i.frame);
    const phrase = card.text.en.slice(0, 28).toLowerCase();
    expect(find(phrase).some((r) => r.cardId === card.id)).toBe(false);
    FI.content.registerBook(b05, 'b05');
    expect(find(phrase).some((r) => r.cardId === card.id)).toBe(true);
  });

  it('lists Sections first, then Lessons, then Cards, and stops at the limit', () => {
    const rows = find('money', 40);
    const order = kinds(rows).map((k) => ['section', 'lesson', 'card'].indexOf(k));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(find('the', 7)).toHaveLength(7);
    expect(find('zzzzqqq')).toEqual([]);
  });
});

describe('Continue and search on the Path', () => {
  const action = (a) => JSON.stringify(a).replace(/"/g, '&quot;');

  it('Continue names the next Lesson and opens it', () => {
    const h = html(FI.engine.initial());
    expect(h).toContain('class="btn primary wide continue"');
    expect(h).toContain(action({ type: 'OPEN_STATION', value: 's1' }));
    expect(h).toContain(FI.content.station('s1').name.en);
  });

  it('Continue names the book for a book Lesson', () => {
    const sec = FI.content.sectionOf('b04');
    const s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: sec.runs[0] }, { type: 'BACK_TO_PATH' });
    const h = html(s);
    expect(h).toContain(action({ type: 'OPEN_STATION', value: sec.runs[0] }));
    expect(h.slice(h.indexOf('continue"'), h.indexOf('continue"') + 900)).toContain(sec.title);
  });

  it('says "Everything is lit" when nothing remains', () => {
    const s = litAll(FI.engine.initial(), FI.content.sections.flatMap((x) => x.runs));
    const h = html(s);
    expect(h).toContain('Everything is lit');
    expect(h).not.toContain('class="btn primary wide continue"');
  });

  it('typing in the search field does not rebuild the page; results show the three kinds and lead somewhere', () => {
    expect(html(FI.engine.initial())).toContain('data-find');
    expect(FI.render.handleUi({ type: 'UI_FIND', value: 'psychology' })).toBe('partial');
    const h = html(FI.engine.initial());
    expect(h).toContain(action({ type: 'UI_JUMP_SECTION', value: 'sec-b01' }));
    FI.render.handleUi({ type: 'UI_FIND', value: FI.content.station('s1').items.find((i) => i.id === 's1c3').text.en.slice(0, 20) });
    expect(html(FI.engine.initial())).toContain(action({ type: 'OPEN_AT', value: { stationId: 's1', cardId: 's1c3' } }));
    FI.render.handleUi({ type: 'UI_FIND', value: 'zzzzqqq' });
    expect(html(FI.engine.initial())).toContain('Nothing found');
    FI.render.setFinding(true);
    expect(html(FI.engine.initial())).toContain('Reading the books on this device');
    FI.render.setFinding(false);
    FI.render.handleUi({ type: 'UI_FIND', value: '<img src=x>' });
    expect(html(FI.engine.initial())).not.toContain('<img src=x>');
    FI.render.handleUi({ type: 'UI_FIND', value: '' });
    expect(html(FI.engine.initial())).not.toContain('class="found"');
  });
  it('shows a few of each kind and counts the rest, so Cards are not pushed out by Lessons', () => {
    FI.render.handleUi({ type: 'UI_FIND', value: 'money' });
    const h = html(FI.engine.initial());
    const kinds = [...h.matchAll(/class="k">([^<]+)</g)].map((m) => m[1]);
    expect(kinds.filter((k) => k === 'Card').length).toBeGreaterThan(4);
    expect(kinds.filter((k) => k === 'Lesson').length).toBeLessThanOrEqual(6);
    expect(h).toMatch(/\d+ found · \d+ more/);
    FI.render.handleUi({ type: 'UI_FIND', value: '' });
  });

  it('a Basics Section in the results is called a Section, not a Book', () => {
    FI.render.handleUi({ type: 'UI_FIND', value: FI.content.sections[0].name.en });
    const h = html(FI.engine.initial());
    expect(h).toContain(action({ type: 'UI_JUMP_SECTION', value: 'basics' }));
    expect(h.slice(h.indexOf('class="found"'), h.indexOf('basics')).includes('>Book<')).toBe(false);
    FI.render.handleUi({ type: 'UI_FIND', value: '' });
  });

  it('finds a Card that is in the Deck even when its book is not loaded', () => {
    const b06 = book('b06');
    const lesson = b06.circles[0].lessons[0];
    const card = lesson.items.find((i) => i.kind === 'card' && !i.frame);
    const s = FI.engine.initial();
    s.deck[card.id] = { stationId: lesson.id, cardId: card.id, text: card.text, check: null, box: 0, due: 1, missed: true, marked: false };
    FI.render.handleUi({ type: 'UI_FIND', value: card.text.en.slice(0, 30) });
    expect(html(s)).toContain(action({ type: 'OPEN_AT', value: { stationId: lesson.id, cardId: card.id } }));
    FI.render.handleUi({ type: 'UI_FIND', value: '' });
  });
});
