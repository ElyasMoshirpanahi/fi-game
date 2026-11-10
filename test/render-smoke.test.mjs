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

  it('Basics Station, Tools, Bookmarks and FA mode render', () => {
    expect(html(R(FI.engine.initial(), { type: 'OPEN_STATION', value: 's1' }))).toContain('panel card');
    expect(html(R(FI.engine.initial(), { type: 'OPEN_TOOLS', value: 's6' }))).toContain('data-widget="shelf"');
    expect(html(R(FI.engine.initial(), { type: 'OPEN_BOOKMARKS' }))).toContain('class="station tools');
    html(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }));
    expect(globalThis.document.documentElement.dir).toBe('rtl');
  });
});
