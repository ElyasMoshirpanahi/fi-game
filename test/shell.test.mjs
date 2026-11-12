import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Specs 10 to 13 (issues #27 to #30): the open Path, the Lesson pop-up, the navigation with the Profile,
// and the desktop rail. Driven through the actions a tap sends, read from the markup the player gets.
const here = path.dirname(fileURLToPath(import.meta.url));
let FI, R, root, sec, circle;
const q = (action) => JSON.stringify(action).replace(/"/g, '&quot;');
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const part = (out, open, close) => { const a = out.indexOf(open); return a < 0 ? '' : out.slice(a, out.indexOf(close, a)); };
const lit = (s, ...ids) => { const n = structuredClone(s); for (const id of ids) n.lit[id] = true; return n; };

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  R = reducer(FI.engine, FI.content);
  const b = JSON.parse(fs.readFileSync(path.join(here, '..', 'content', 'books', 'v3', 'b04.json'), 'utf8'));
  FI.content.registerBook(b, b.id);
  root = { innerHTML: '', querySelector: () => null };
  sec = FI.content.sectionOf('b04'); circle = sec.circles[0];
});
beforeEach(() => { FI.render.handleUi({ type: 'UI_CLOSE_CIRCLE' }); });

describe('Every Section is open on the Path (spec 13)', () => {
  it('writes the nodes of every Section and no header that toggles', () => {
    const out = html(FI.engine.initial());
    expect((out.match(/<ol class="nodes/g) || []).length).toBe(FI.content.sections.length);
    expect(out).not.toMatch(/<button class="sechead/);
    expect(part(out, '<header class="sechead', '</header>')).not.toContain('aria-expanded');
  });

  it('shows a book Section whole with nothing sent first: banner, edition, Notes, Circles', () => {
    const b04 = part(html(FI.engine.initial()), '<section class="sec book open " id="sec-b04"', '</section>');
    expect(b04).toContain('class="sechead banner"');
    expect(b04).toContain('class="edition"');
    expect(b04).toContain(q({ type: 'OPEN_NOTES', value: 'b04' }));
    expect((b04.match(/class="node circle/g) || []).length).toBe(sec.circles.length);
  });

  it('can no longer fold a Section', () => {
    expect(FI.render.handleUi({ type: 'UI_OPEN_SECTION', value: 'sec-b04' })).toBe(false);
  });

  it('has one GO marker on the whole Path, in the Section Continue points to', () => {
    let s = FI.engine.initial();
    expect(html(s).match(/class="go"/g)).toHaveLength(1);
    expect(part(html(s), '<section class="sec basics', '</section>')).toContain('class="go"');
    s = R(s, { type: 'OPEN_STATION', value: circle.lessons[0] }, { type: 'BACK_TO_PATH' });
    expect(FI.engine.continueTarget(s, FI.content).sectionId).toBe(sec.id);
    const out = html(s);
    expect(out.match(/class="go"/g)).toHaveLength(1);
    expect(part(out, '<section class="sec book open " id="sec-b04"', '</section>')).toContain('class="go"');
    expect(part(out, '<section class="sec basics', '</section>')).toContain('class="node cur"'); // other Sections keep a soft mark
  });
});

describe('The Lesson pop-up (spec 11)', () => {
  const pop = (s) => part(html(s), '<div class="lpop"', '</div>\n    </li>');
  const open = () => FI.render.handleUi({ type: 'UI_OPEN_CIRCLE', value: circle.id });
  const name = (lid) => FI.content.station(lid).name.en.replace(/&/g, '&amp;').replace(/'/g, '&#39;');

  it('a tap on a Circle writes a pop-up naming its first unlit Lesson, with one Start for it', () => {
    expect(html(FI.engine.initial())).not.toContain('class="lpop"');
    open();
    const p = pop(FI.engine.initial());
    expect(p).toContain(name(circle.lessons[0]));
    expect(p).toContain(`Lesson 1 of ${circle.lessons.length}`);
    expect(p.match(/OPEN_STATION/g)).toHaveLength(1);
    expect(p).toContain(q({ type: 'OPEN_STATION', value: circle.lessons[0] }));
    expect(p).toContain('>Start<');
  });

  it('moves on to the next Lesson once the first is lit', () => {
    open();
    const p = pop(lit(FI.engine.initial(), circle.lessons[0]));
    expect(p).toContain(name(circle.lessons[1]));
    expect(p).toContain(q({ type: 'OPEN_STATION', value: circle.lessons[1] }));
    expect(p).toContain('class="ldot lit"');
  });

  it('offers Replay of the first Lesson when the whole Circle is lit', () => {
    open();
    const p = pop(lit(FI.engine.initial(), circle.id, ...circle.lessons));
    expect(p).toContain(q({ type: 'OPEN_STATION', value: circle.lessons[0] }));
    expect(p).toContain('>Replay<');
  });

  it('lets the player pick another Lesson in the numbered row', () => {
    open();
    const last = circle.lessons[circle.lessons.length - 1];
    expect(pop(FI.engine.initial())).toContain(q({ type: 'UI_PICK_LESSON', value: last }));
    FI.render.handleUi({ type: 'UI_PICK_LESSON', value: last });
    const p = pop(FI.engine.initial());
    expect(p).toContain(name(last));
    expect(p).toContain(q({ type: 'OPEN_STATION', value: last }));
  });

  it('forgets the pick when another Circle opens, and closes on a second tap or on close', () => {
    open();
    FI.render.handleUi({ type: 'UI_PICK_LESSON', value: circle.lessons[1] });
    const other = FI.content.sections.find((x) => x.kind === 'book' && x.id !== sec.id).circles[0];
    FI.render.handleUi({ type: 'UI_OPEN_CIRCLE', value: other.id });
    expect(pop(FI.engine.initial())).toContain(q({ type: 'OPEN_STATION', value: other.lessons[0] }));
    FI.render.handleUi({ type: 'UI_OPEN_CIRCLE', value: other.id });
    expect(html(FI.engine.initial())).not.toContain('class="lpop"');
    open(); FI.render.handleUi({ type: 'UI_CLOSE_CIRCLE' });
    expect(html(FI.engine.initial())).not.toContain('class="lpop"');
  });

  it('is gone after a Lesson was played', () => {
    open();
    const s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: circle.lessons[0] });
    html(s);
    expect(html(R(s, { type: 'BACK_TO_PATH' }))).not.toContain('class="lpop"');
  });

  it('is in Farsi in FA mode', () => {
    open();
    const p = pop(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }));
    expect(p).toContain('>شروع<');
    expect(p).toMatch(/درس ۱/);
  });
});

describe('Navigation and the Profile (spec 12)', () => {
  const nav = (s) => part(html(s), '<nav class="nav', '</nav>');

  it('the Profile is a screen like Bookmarks: it ends a run, Back returns to the Path, and it is never saved', () => {
    let s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'OPEN_PROFILE' });
    expect(s.screen).toBe('profile');
    expect(s.phase).toBe(null);
    expect('screen' in FI.store.durable(s)).toBe(false);
    s = R(s, { type: 'BACK_TO_PATH' });
    expect(s.screen).toBe('path');
  });

  it('every screen has the navigation: five destinations, exactly one current', () => {
    const s0 = FI.engine.initial();
    const screens = {
      learn: s0,
      review: R(s0, { type: 'OPEN_REVIEW' }),
      shelf: R(s0, { type: 'OPEN_TOOLS', value: 's6' }),
      bookmarks: R(s0, { type: 'OPEN_BOOKMARKS' }),
      profile: R(s0, { type: 'OPEN_PROFILE' }),
    };
    for (const [key, s] of Object.entries(screens)) {
      const n = nav(s);
      expect(n.match(/class="navitem"/g), key).toHaveLength(5);
      expect(n.match(/aria-current="page"/g), key).toHaveLength(1);
      expect(n, key).toMatch(new RegExp(`data-nav="${key}"[^>]*aria-current="page"`));
    }
    expect(nav(R(s0, { type: 'OPEN_TOOLS', value: 's1' }))).toMatch(/data-nav="learn"[^>]*aria-current="page"/);
    expect(nav(R(s0, { type: 'OPEN_STATION', value: 's1' }))).toMatch(/data-nav="learn"[^>]*aria-current="page"/);
  });

  it('steps aside during a Lesson and a Review run, and comes back when the Review is done', () => {
    const s0 = FI.engine.initial();
    expect(nav(s0)).toContain('<nav class="nav"');
    expect(nav(R(s0, { type: 'OPEN_STATION', value: 's1' }))).toContain('<nav class="nav run"');
    expect(nav(R(s0, { type: 'OPEN_REVIEW' }))).toContain('<nav class="nav"'); // an empty Deck: the Review is done at once
    const due = R(s0, { type: 'TICK', value: 100 }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'TICK', value: 101 });
    expect(nav(due)).toMatch(/class="navbadge">1</);
    expect(nav(R(due, { type: 'OPEN_REVIEW' }))).toContain('<nav class="nav run"');
  });

  it('moves backup, offline and reset from the Path to the Profile', () => {
    const s0 = R(FI.engine.initial(), { type: 'TICK', value: 100 });
    const onPath = html(s0);
    for (const type of ['BACKUP', 'UI_RESTORE_OPEN', 'UI_RESET_ASK']) expect(onPath, type).not.toContain(q({ type }));
    expect(onPath).not.toContain('class="offline"');
    const onProfile = html(R(s0, { type: 'OPEN_PROFILE' }));
    for (const type of ['BACKUP', 'UI_RESTORE_OPEN', 'UI_RESET_ASK']) expect(onProfile, type).toContain(q({ type }));
    expect(onProfile).toContain('class="offline"');
  });

  it('the Profile shows the numbers, the Badges earned, Language Mode and sound', () => {
    const s0 = R(FI.engine.initial(), { type: 'OPEN_PROFILE' });
    const fresh = html(s0);
    expect(fresh).toContain('No badges yet.');
    expect(fresh).toContain(`0/${FI.content.sections.length}`);
    expect(part(fresh, '<main', '</main>')).toContain(q({ type: 'SET_MODE', value: 'FA' }));
    expect(part(fresh, '<main', '</main>')).toContain(q({ type: 'TOGGLE_MUTE' }));
    const some = lit(s0, 's1', sec.id);
    const out = part(html(some), '<main', '</main>');
    expect(out).toContain(FI.content.station('s1').badge.en);
    expect(out).toContain(sec.badge.en);
    expect(out).not.toContain('No badges yet.');
  });

  it('asks before a reset, on the Profile only', () => {
    const s = R(FI.engine.initial(), { type: 'OPEN_PROFILE' });
    FI.render.handleUi({ type: 'UI_RESET_ASK' });
    expect(html(s)).toContain(q({ type: 'RESET' }));
    expect(html(R(s, { type: 'BACK_TO_PATH' }))).not.toContain(q({ type: 'RESET' }));
    expect(html(s)).not.toContain(q({ type: 'RESET' })); // leaving the Profile withdrew the question
  });

  it('labels the navigation in Farsi in FA mode', () => {
    const n = nav(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }));
    for (const word of ['یادگیری', 'مرور', 'قفسه', 'نشانک‌ها', 'نمایه']) expect(n).toContain(word);
  });
});

describe('The desktop rail (spec 10)', () => {
  const railOf = (s) => part(html(s), '<aside class="rail"', '</aside>');

  it('stands beside the Path with the numbers, the Review count and one row per Section', () => {
    const due = R(FI.engine.initial(), { type: 'TICK', value: 100 }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'TICK', value: 101 });
    const r = railOf(due);
    expect(r).toContain('class="stats"');
    expect(r).toMatch(/class="railnum"><b>1<\/b> due/);
    expect(r).toContain(q({ type: 'OPEN_REVIEW' }));
    expect((r.match(/data-sec="/g) || []).length).toBe(FI.content.sections.length);
    expect(r).toContain(q({ type: 'UI_JUMP_SECTION', value: 'sec-b04' }));
  });

  it('is written on the Path only', () => {
    const s0 = FI.engine.initial();
    for (const a of [{ type: 'OPEN_STATION', value: 's1' }, { type: 'OPEN_REVIEW' }, { type: 'OPEN_BOOKMARKS' }, { type: 'OPEN_PROFILE' }, { type: 'OPEN_TOOLS', value: 's6' }]) expect(railOf(R(s0, a)), a.type).toBe('');
  });

  it('never lets a hidden copy of a cover own its gradient: each place draws its own', () => {
    FI.render.handleUi({ type: 'UI_PICKER' });
    const out = html(FI.engine.initial());
    FI.render.handleUi({ type: 'UI_PICKER' });
    const ids = [...out.matchAll(/<linearGradient id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('The layout is CSS over one markup (specs 10 and 12)', () => {
  const page = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');
  const css = page.slice(page.indexOf('<style>'), page.indexOf('</style>'));
  it('has a phone bar, a tablet rail and a desktop sidebar at the three widths', () => {
    expect(css).toMatch(/@media \(max-width: 699px\) \{\s*\.nav\.run \{ display: none; \}/);
    expect(css).toMatch(/@media \(min-width: 700px\) \{\s*#app \{[^}]*display: grid/);
    expect(css).toMatch(/@media \(min-width: 1100px\) \{[\s\S]*#app > \.rail \{ display: grid/);
    expect(css).toMatch(/\.nav \{[^}]*env\(safe-area-inset-bottom/);
  });
  it('shows the pop-up below desktop width and the Lesson list from it', () => {
    expect(css).toMatch(/\n\.lessons \{[^}]*display: none/);
    expect(css).toMatch(/@media \(min-width: 1100px\) \{[\s\S]*\.picker, \.sheet, \.lpop \{ display: none; \}\s*\.lessons \{ display: grid; \}/);
  });
  it('render never reads the viewport to choose a layout', () => {
    const render = page.slice(page.indexOf('<script data-module="render">'), page.indexOf('<script data-module="fx">'));
    expect(render).not.toMatch(/innerWidth|matchMedia\('\((min|max)-width/);
  });
});
