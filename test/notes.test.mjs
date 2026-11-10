import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';
import { reducer, fakeStorage } from './helpers.mjs';

// Spec 4 (issue #11): Notes, the player's own page for a book. Kept in the browser, saved as typed.
const here = path.dirname(fileURLToPath(import.meta.url));
let FI, R, root;
beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  R = reducer(FI.engine, FI.content);
  const b = JSON.parse(fs.readFileSync(path.join(here, '..', 'content', 'books', 'v3', 'b04.json'), 'utf8'));
  FI.content.registerBook(b, b.id);
  root = { innerHTML: '', querySelector: () => null };
});
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const note = (bookId, text, edited = '2026-11-10') => ({ type: 'SET_NOTE', value: { bookId, text, edited } });
// Pass one Lesson: every Card known, every Check right, the Fare right.
function pass(s, id) {
  s = R(s, { type: 'OPEN_STATION', value: id });
  let guard = 400;
  while (s.phase !== 'fare-passed' && guard-- > 0) {
    if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    else if (s.phase === 'check' || s.phase === 'fare') s = R(s, { type: 'ANSWER', value: FI.content.item(id, s.current).answer });
    else s = R(s, { type: 'CONTINUE' });
  }
  return s;
}

describe('Writing Notes', () => {
  it('SET_NOTE keeps the text and the day it was edited, per book', () => {
    const s = R(FI.engine.initial(), note('b04', 'Housel argues behaviour beats formulas.'), note('b01', 'نکته‌های من'));
    expect(s.notes.b04).toEqual({ text: 'Housel argues behaviour beats formulas.', edited: '2026-11-10' });
    expect(s.notes.b01.text).toBe('نکته‌های من');
  });

  it('caps a note at 20,000 characters', () => {
    const s = R(FI.engine.initial(), note('b04', 'x'.repeat(25000)));
    expect(s.notes.b04.text).toHaveLength(20000);
  });

  it('ignores a book that does not exist, text that is not text, and a date that is not a date', () => {
    let s = R(FI.engine.initial(), note('b99', 'nope'), { type: 'SET_NOTE', value: { bookId: 'b04', text: 42 } }, { type: 'SET_NOTE', value: null });
    expect(s.notes).toEqual({});
    s = R(s, note('b04', 'kept', '<b>'));
    expect(s.notes.b04).toEqual({ text: 'kept', edited: '' });
  });

  it('a page emptied again is removed, so the Shelf does not show an empty note', () => {
    const s = R(FI.engine.initial(), note('b04', 'draft'), note('b04', '   \n'));
    expect(s.notes.b04).toBeUndefined();
  });

  it('counts words in English and in Farsi; a page is about 300 words', () => {
    expect(FI.engine.wordCount('')).toBe(0);
    expect(FI.engine.wordCount('  one two\nthree  ')).toBe(3);
    expect(FI.engine.wordCount('رفتار مهم‌تر از فرمول است')).toBe(5);
    expect(FI.engine.wordCount('... --- !!!')).toBe(0);
    expect(FI.engine.wordCount('- one, two.')).toBe(2);
    expect(FI.engine.NOTE_PAGE_WORDS).toBe(300);
  });
});

describe('Notes are as safe as progress', () => {
  it('survive a reload', () => {
    const storage = fakeStorage();
    FI.store.save(storage, R(FI.engine.initial(), note('b04', 'my page')));
    const again = R(FI.engine.initial(), { type: 'HYDRATE', value: FI.store.load(storage) });
    expect(again.notes.b04.text).toBe('my page');
  });

  it('travel in a backup and come back on restore', () => {
    const s = R(FI.engine.initial(), note('b04', 'my page'));
    const parsed = FI.store.parseBackup(FI.store.backup(s, '2026-11-10'));
    expect(parsed.ok).toBe(true);
    expect(R(FI.engine.initial(), { type: 'RESTORE', value: parsed.data }).notes.b04.text).toBe('my page');
  });

  it('a backup with malformed notes is refused; a saved document drops them', () => {
    const tooLong = { b04: { text: 'x'.repeat(20001), edited: '' } };
    const script = { b04: { text: 'ok', edited: '<img src=x onerror=alert(1)>' } };
    for (const notes of [{ b04: 5 }, { b04: { text: 5, edited: '' } }, [], 'text', script, tooLong, { zzz: { text: 'a', edited: '' } }, { b04: { text: 'a', edited: '', extra: 1 } }, { b04: { text: 'a', edited: '2026-13-99x' } }]) {
      const doc = JSON.stringify({ app: 'fi-roadmap', format: 1, exported: '2026-11-10', data: { v: 1, notes } });
      expect(FI.store.parseBackup(doc), JSON.stringify(notes)).toEqual({ ok: false, reason: 'damaged' });
      expect(R(FI.engine.initial(), { type: 'HYDRATE', value: { notes } }).notes).toEqual({});
    }
  });

  it('RESET clears them with the rest', () => {
    expect(R(FI.engine.initial(), note('b04', 'x'), { type: 'RESET' }).notes).toEqual({});
  });
});

describe('The Notes screen', () => {
  it('opens for a book, shows the three prompts, the page and the count, and goes back to the Path', () => {
    let s = R(FI.engine.initial(), { type: 'OPEN_NOTES', value: 'b04' });
    expect(s.screen).toBe('notes');
    const h = html(s);
    expect(h).toContain('data-note="b04"');
    expect(h).toMatch(/<textarea[^>]*dir="auto"/);
    expect(h).toContain('What does the book argue?');
    expect(h).toContain('What will you do differently?');
    expect(h).toContain('What do you disagree with?');
    expect(h).toContain(FI.content.sectionOf('b04').title);
    expect(h).toMatch(/0 words/);
    s = R(s, { type: 'BACK_TO_PATH' });
    expect(s.screen).toBe('path');
  });

  it('shows what was written, escaped, with its count against a page', () => {
    const s = R(FI.engine.initial(), note('b04', 'three <b>short</b> words'), { type: 'OPEN_NOTES', value: 'b04' });
    const h = html(s);
    expect(h).toContain('three &lt;b&gt;short&lt;/b&gt; words');
    expect(h).toMatch(/3 words/);
    expect(h).toContain('300');
  });

  it('does not open for a book that does not exist', () => {
    expect(R(FI.engine.initial(), { type: 'OPEN_NOTES', value: 'b99' }).screen).toBe('path');
  });

  it('is in Farsi in FA mode, with Persian digits', () => {
    const s = R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }, note('b04', 'یک دو سه'), { type: 'OPEN_NOTES', value: 'b04' });
    const h = html(s);
    expect(h).toContain('کتاب چه می‌گوید؟');
    expect(h).toMatch(/۳ واژه/);
  });
});

describe('Where Notes are reached from', () => {
  const open = (id) => JSON.stringify({ type: 'OPEN_NOTES', value: id }).replace(/"/g, '&quot;');

  it('the open book Section has a Notes button', () => {
    FI.render.handleUi({ type: 'UI_OPEN_SECTION', value: 'sec-b04' });
    expect(html(FI.engine.initial())).toContain(open('b04'));
    FI.render.handleUi({ type: 'UI_OPEN_SECTION', value: 'sec-b04' });
  });

  it('every Shelf card has a Notes button, and a card with notes says so', () => {
    let s = R(FI.engine.initial(), { type: 'OPEN_TOOLS', value: 's6' });
    expect(html(s)).toContain(open('b01'));
    expect(html(s)).not.toContain('class="noted"');
    s = R(FI.engine.initial(), note('b04', 'one two'), { type: 'OPEN_TOOLS', value: 's6' });
    expect(html(s).match(/class="noted"/g)).toHaveLength(1);
  });

  it('finishing a book Section invites the page of notes', () => {
    const sec = FI.content.sectionOf('b04');
    let s = FI.engine.initial();
    for (const lesson of sec.runs) { s = pass(s, lesson); if (lesson !== sec.runs[sec.runs.length - 1]) s = R(s, { type: 'CONTINUE' }); }
    expect(s.events).toContain('section');
    const h = html(s);
    expect(h).toContain(open('b04'));
    expect(h).toContain('Write your page of notes');
    // it does not depend on the one paint that carries the event: a mode switch keeps it
    expect(html(R(s, { type: 'SET_MODE', value: 'BOTH' }))).toContain(open('b04'));
  });
});

describe('Notes review fixes', () => {
  it('a date that is not a day never reaches the page as markup', () => {
    const s = R(FI.engine.initial(), note('b04', 'ok'), { type: 'OPEN_NOTES', value: 'b04' });
    s.notes.b04.edited = '<img src=x onerror=alert(1)>';
    expect(html(s)).not.toContain('<img src=x');
  });

  it('says "1 word", and the bar is full only at a full page', () => {
    const at = (n) => html(R(FI.engine.initial(), note('b04', Array(n).fill('word').join(' ')), { type: 'OPEN_NOTES', value: 'b04' }));
    expect(at(1)).toMatch(/1 word</);
    expect(at(299)).toContain('width:99%');
    expect(at(299)).not.toContain('One page written');
    expect(at(300)).toContain('width:100%');
    expect(at(300)).toContain('One page written');
  });

  it('the restore summary counts notes', () => {
    const s = R(FI.engine.initial(), note('b04', 'a'), note('b01', 'b'));
    expect(FI.engine.preview(FI.store.durable(s), FI.content).notes).toBe(2);
  });

  it('a failed save is said on the page, and cleared when saving works again', () => {
    expect(html(FI.engine.initial())).toMatch(/class="savewarn" role="alert" hidden/);
    FI.render.setSaveFailed(true);
    expect(html(FI.engine.initial())).toMatch(/class="savewarn" role="alert">Not saved/);
    FI.render.setSaveFailed(false);
    expect(html(FI.engine.initial())).toMatch(/class="savewarn" role="alert" hidden/);
  });

  it('the Basics pass panel keeps its single button; only a finished book gets the Notes invite', () => {
    const h = html(pass(FI.engine.initial(), 's1'));
    expect(h).not.toContain('OPEN_NOTES');
    expect(h).not.toContain('class="actions"');
  });
});
