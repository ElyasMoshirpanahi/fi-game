import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 8 (issue #16): neon overhaul. Combo at the engine seam; the road at the render seam.
const here = path.dirname(fileURLToPath(import.meta.url));
const page = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');
const css = page.slice(page.indexOf('<style>'), page.indexOf('</style>'));
let FI, R, root;
beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  R = reducer(FI.engine, FI.content);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
});
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
// Play Station 1 until `n` Checks were met, answering each as `plan[i]` says (true = right).
function play(s, plan) {
  s = R(s, { type: 'OPEN_STATION', value: 's1' });
  let met = 0; let guard = 300;
  while (met < plan.length && guard-- > 0) {
    if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    else if (s.phase === 'check') {
      const k = FI.content.item('s1', s.current);
      if (plan[met]) s = R(s, { type: 'ANSWER', value: k.answer });
      else s = R(s, { type: 'ANSWER', value: wrongFor(k) }, { type: 'ANSWER', value: wrongFor(k) });
      met += 1;
    } else s = R(s, { type: 'CONTINUE' });
  }
  return s;
}

describe('Combo', () => {
  it('counts right answers in a row and reports the event from the second one', () => {
    let s = play(FI.engine.initial(), [true]);
    expect(s.combo).toBe(1);
    expect(s.events).not.toContain('combo');
    s = play(FI.engine.initial(), [true, true, true]);
    expect(s.combo).toBe(3);
    expect(s.events).toContain('combo');
  });

  it('a wrong answer resets it', () => {
    const s = play(FI.engine.initial(), [true, true, false]);
    expect(s.combo).toBe(0);
    expect(play(FI.engine.initial(), [true, false, true]).combo).toBe(1);
  });

  it('is not saved and pays nothing', () => {
    const s = play(FI.engine.initial(), [true, true]);
    expect(FI.engine.DURABLE).not.toContain('combo');
    expect(FI.store.durable(s).combo).toBeUndefined();
    expect(s.coins).toBe(2);
  });

  it('carries into Review and resets on a wrong Review answer', () => {
    let s = R(FI.engine.initial(), { type: 'TICK', value: 100 }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'TICK', value: 101 });
    s = play(s, [true]);
    s = R(s, { type: 'BACK_TO_PATH' }, { type: 'OPEN_REVIEW' }, { type: 'REVIEW_NEXT' });
    s = R(s, { type: 'REVIEW_ANSWER', value: s.deck.s1c1.check.answer });
    expect(s.combo).toBe(2);
    expect(s.events).toContain('combo');
    s = R(s, { type: 'REVIEW_NEXT' }, { type: 'BACK_TO_PATH' }, { type: 'TICK', value: 200 }, { type: 'OPEN_REVIEW' }, { type: 'REVIEW_NEXT' });
    s = R(s, { type: 'REVIEW_ANSWER', value: wrongFor(s.deck.s1c1.check) });
    expect(s.combo).toBe(0);
  });

  it('a Card that is only rated is no part of the Combo: it neither adds, resets, nor counts as wrong', () => {
    const st = FI.content.station('s1');
    const bare = st.items.find((i) => i.kind === 'card' && !st.items.some((k) => k.kind === 'check' && k.source === i.id));
    let s = R(play(FI.engine.initial(), [true, true]), { type: 'BACK_TO_PATH' }, { type: 'TICK', value: 100 }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: bare.id } }, { type: 'TICK', value: 101 }, { type: 'OPEN_REVIEW' });
    expect(s.combo).toBe(2);
    s = R(s, { type: 'REVIEW_RATE', value: 'didnt' });
    expect(s.combo).toBe(2);
    expect(s.events).not.toContain('wrong');
    s = R(s, { type: 'REVIEW_NEXT' }, { type: 'BACK_TO_PATH' }, { type: 'TICK', value: 102 }, { type: 'OPEN_REVIEW' }, { type: 'REVIEW_RATE', value: 'knew' });
    expect(s.combo).toBe(2);
    expect(s.events).not.toContain('correct');
    expect(s.deck[bare.id].box).toBe(1);
  });

  it('is shown on every Lesson screen while it runs, the Fare included, and not on the Path', () => {
    let s = play(FI.engine.initial(), [true, true]);
    s = R(s, { type: 'CONTINUE' });
    expect(html(s)).toContain('class="combo"');
    expect(html(R(s, { type: 'BACK_TO_PATH' }))).not.toContain('class="combo"');
  });

  it('shows on the feedback from the second right answer', () => {
    expect(html(play(FI.engine.initial(), [true]))).not.toContain('class="combo"');
    expect(html(play(FI.engine.initial(), [true, true]))).toContain('class="combo"');
  });
});

describe('Road trace', () => {
  it('a node straight below is one line', () => {
    expect(FI.render.trace([{ x: 100, y: 0 }, { x: 100, y: 120 }])).toBe('M100 0L100 120');
  });

  it('a node off to the side is reached by a vertical run, a 45 degree bend and a vertical run', () => {
    expect(FI.render.trace([{ x: 100, y: 0 }, { x: 160, y: 200 }])).toBe('M100 0L100 70L160 130L160 200');
    expect(FI.render.trace([{ x: 160, y: 0 }, { x: 100, y: 200 }])).toBe('M160 0L160 70L100 130L100 200');
  });

  it('a drop shorter than the sideways step falls back to a straight line', () => {
    expect(FI.render.trace([{ x: 0, y: 0 }, { x: 90, y: 40 }])).toBe('M0 0L90 40');
  });

  it('chains through every node and is empty for fewer than two', () => {
    expect(FI.render.trace([{ x: 0, y: 0 }, { x: 0, y: 50 }, { x: 20, y: 150 }])).toBe('M0 0L0 50L0 90L20 110L20 150');
    expect(FI.render.trace([{ x: 5, y: 5 }])).toBe('');
    expect(FI.render.trace([])).toBe('');
  });
});

describe('Road on the Path', () => {
  it('nodes sit on a wave that returns to the centre and mirrors in Farsi', () => {
    const xs = Array.from({ length: 8 }, (_, i) => FI.render.wave(i, false));
    expect(xs[0]).toBe(0);
    expect(xs[4]).toBe(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(76); // 360 px: room for the current node's glow inside the Section
    expect(Math.min(...xs)).toBe(-Math.max(...xs));
    expect(Array.from({ length: 8 }, (_, i) => FI.render.wave(i, true))).toEqual(xs.map((x) => (x === 0 ? 0 : -x)));
    expect(FI.render.wave(8, false)).toBe(xs[0]);
  });

  it('draws the road, offsets each node, and tags only the current node with START', () => {
    const h = html(FI.engine.initial());
    expect(h).toContain('class="road"');
    expect(h).toMatch(/class="node cur"[^>]*--x:0px/);
    expect(h.match(/class="go"/g)).toHaveLength(1);
    expect(h).toContain('>Start<');
    const fa = html(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }));
    expect(fa).toContain('>شروع<');
    expect(fa).toMatch(/--x:-\d+px/);
  });
});

describe('Neon theme', () => {
  it('has one theme: no light scheme switch is left', () => {
    expect(css).not.toMatch(/prefers-color-scheme/);
    expect(css).not.toMatch(/data-theme="light"/);
  });

  it('never puts white text on a bright fill, and never letter-spaces Farsi', () => {
    expect(css).not.toMatch(/color: #fff\b/);
    expect(css).toMatch(/--ink:/);
    expect(css).toMatch(/html\[lang="fa"\] \*[^{]*\{[^}]*letter-spacing: 0/);
  });

  it('keeps every effect switched off under reduced motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none !important/);
    expect(page).toMatch(/prefers-reduced-motion: reduce\)'\)\.matches/);
  });
  it('shows focus where a parent clips it or another outline would win', () => {
    expect(css).toMatch(/\.node\.circle\.open > \.ubtn:focus-visible/);
  });

  it('keeps the jump button and its sheet fixed', () => {
    expect(css).not.toMatch(/\.path > \* \{/);
  });

  it('has no selector left for markup that is gone', () => {
    for (const dead of ['.unum', '.wrongpick', '.coins .plus', '.node.dim', '.node.idle']) expect(css, dead).not.toContain(dead);
    expect(page).not.toContain("'idle'");
  });
});

describe('Rewards in flight', () => {
  it('are written in the Language Mode, with its digits', () => {
    expect(FI.render.rewardText('xp', 50, 'EN')).toBe('+50 XP');
    expect(FI.render.rewardText('xp', 50, 'FA')).toBe('+۵۰ امتیاز');
    expect(FI.render.rewardText('coin', 1, 'FA')).toBe('+۱ ●');
  });

  it('no reward text is hard-coded in fx, and haptics follow mute', () => {
    const fx = page.slice(page.indexOf('FI.fx = '), page.indexOf('data-module="app"'));
    expect(fx).not.toMatch(/XP|●/);
    expect(fx).toMatch(/!state\.muted && !still\(\) && navigator\.vibrate/);
    expect(fx).toMatch(/!has\('restored'\)/);
  });
});
