import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Smoke test for the render block: every screen renders to markup without throwing.
// Added after a rename broke pathScreen while all engine tests stayed green (Lessons review).
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

describe('render smoke', () => {
  it('Path: all Sections, Basics open, picker button', () => {
    const out = html(FI.engine.initial());
    expect((out.match(/class="sec /g) || []).length).toBe(FI.content.sections.length);
    expect(out).toContain('class="picker"');
  });

  it('Path with a book Section open shows Circles; an open Circle lists its Lessons', () => {
    const sec = FI.content.sectionOf('b04');
    FI.render.handleUi({ type: 'UI_JUMP_SECTION', value: sec.id });
    FI.render.handleUi({ type: 'UI_OPEN_CIRCLE', value: sec.circles[0].id });
    const out = html(FI.engine.initial());
    expect(out).toContain('node circle');
    expect((out.match(/class="lesson /g) || []).length).toBe(sec.circles[0].lessons.length);
  });

  it('a Lesson run renders the framing Point, then a Check', () => {
    const lid = FI.content.sectionOf('b04').circles[0].lessons[0];
    let s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: lid });
    expect(html(s)).toContain('class="bookhead"');
    while (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    expect(html(s)).toContain('class="prompt"');
  });

  it('Review: empty Deck, a due Card, its Check and the result all render', () => {
    expect(html(R(FI.engine.initial(), { type: 'OPEN_REVIEW' }))).toContain('class="panel result"');
    let s = R(FI.engine.initial(), { type: 'TICK', value: 100 }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'TICK', value: 101 });
    expect(html(s)).toContain('footbtn hot');
    s = R(s, { type: 'OPEN_REVIEW' });
    expect(html(s)).toContain('class="ctext"');
    s = R(s, { type: 'REVIEW_NEXT' });
    expect(html(s)).toContain('class="prompt"');
    s = R(s, { type: 'REVIEW_ANSWER', value: s.deck.s1c1.check.answer });
    expect(html(s)).toContain('feedback ok');
  });

  it('Basics Station, Tools, Bookmarks and FA mode render', () => {
    expect(html(R(FI.engine.initial(), { type: 'OPEN_STATION', value: 's1' }))).toContain('panel card');
    expect(html(R(FI.engine.initial(), { type: 'OPEN_TOOLS', value: 's6' }))).toContain('data-widget="shelf"');
    expect(html(R(FI.engine.initial(), { type: 'OPEN_BOOKMARKS' }))).toContain('class="station tools');
    html(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }));
    expect(globalThis.document.documentElement.dir).toBe('rtl');
  });
});
