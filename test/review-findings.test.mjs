import { describe, it, expect, beforeAll } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Findings of the two-axis review of specs 14 (releases 1 and 2), 15 and 16, fixed on 2026-11-14.
let FI, R, E, root;
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
const day = (n, roll = 0) => ({ type: 'TICK', value: n, roll });

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  E = FI.engine; R = reducer(E, FI.content);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
});

// Play the open Station to its passed Fare. With `missFirst` the first Check met is answered wrong once.
function finish(s, missFirst) {
  let missed = !missFirst; let guard = 800;
  while (s.phase !== 'fare-passed' && guard-- > 0) {
    if (s.phase === 'check' || s.phase === 'fare') {
      const k = FI.content.item(s.stationId, s.current);
      if (s.phase === 'check' && !missed) { missed = true; s = R(s, { type: 'ANSWER', value: wrongFor(k) }); } else s = R(s, { type: 'ANSWER', value: k.answer });
    } else s = R(s, { type: 'CONTINUE' });
  }
  return s;
}
const start = () => R(E.initial(), day(100));

describe('A Lesson entered part-way is never judged clean', () => {
  it('a miss before a reload still costs the clean bonus and the gold chest', () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1', at: 1000 });
    while (s.phase !== 'check') s = R(s, { type: 'CONTINUE' });
    s = R(s, { type: 'ANSWER', value: wrongFor(FI.content.item('s1', s.current)) });
    const saved = JSON.parse(JSON.stringify(FI.store.durable(s)));
    let again = R(R(E.initial(), { type: 'HYDRATE', value: saved }), day(100));
    expect(again.tally.partial).toBe(true);
    again = finish(again);
    expect(again.end.clean).toBe(false);
    expect(again.end.chest.gold).toBe(false);
    expect(again.awarded['clean:s1']).toBeUndefined();
  });

  it('a Lesson opened at its last Card from a bookmark is not clean either', () => {
    const cards = FI.content.station('s1').items.filter((i) => i.kind === 'card');
    const s = finish(R(start(), { type: 'OPEN_AT', value: { stationId: 's1', cardId: cards[cards.length - 1].id }, at: 0 }));
    expect(s.end.clean).toBe(false);
    expect(s.end.chest.gold).toBe(false);
  });

  it('a Lesson played from its first Card with no miss is still clean', () => {
    const s = finish(R(start(), { type: 'OPEN_STATION', value: 's1', at: 0 }));
    expect(s.end.clean).toBe(true);
    expect(s.end.chest.gold).toBe(true);
  });
});

describe('The rail on the Shelf, Bookmarks and the Profile', () => {
  it('a Section row leads back to the Path', () => {
    expect(FI.render.handleUi({ type: 'UI_JUMP_SECTION', value: FI.content.sections[1].id })).toBe('path');
  });
});

describe('The Milestone is a Badge', () => {
  it('is listed among the Badges on the Profile once it is earned', () => {
    const profile = (milestone) => html(R({ ...start(), milestone }, { type: 'OPEN_PROFILE' }));
    const chips = (out) => (out.match(/class="bchip"/g) || []).length;
    expect(chips(profile(true))).toBe(chips(profile(false)) + 1);
  });
});

describe('The Navigation during a Recap', () => {
  it('marks Learn, not Review', () => {
    let s = start();
    for (const id of FI.content.sections[0].runs) s = R(finish(R(s, { type: 'OPEN_STATION', value: id, at: 0 })), { type: 'BACK_TO_PATH' });
    s = R(s, { type: 'OPEN_RECAP', value: FI.content.sections[0].id });
    expect(s.review && s.review.recap).toBeTruthy();
    const current = (html(s).match(/<button class="navitem[^>]*aria-current="page"[^>]*>/) || [''])[0];
    expect(current).toContain('BACK_TO_PATH');
  });
});

describe('The header on a phone', () => {
  it('drops the XP number below 700 px, the width where a phone ends', async () => {
    const fs = await import('node:fs');
    const css = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    expect(css).toMatch(/@media \(max-width: 699px\) \{ \.top \.xpnum \{ display: none; \}/);
  });
});
