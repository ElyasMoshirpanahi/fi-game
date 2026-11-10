import { describe, it, expect, beforeAll } from 'vitest';
import { checkWording, lengthSignal, LENGTH_RATIO } from '../scripts/validate-book-v3.mjs';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 3 (issue #10): tap options that give nothing away by length, and a Fare that asks in other words.
const P = (en, fa = 'فا ' + en) => ({ en, fa });
const tap = (id, options, answer, extra = {}) => ({ kind: 'check', id, type: 'tap', source: 'c1', prompt: P('Which one?'), fare: P('Pick the right one.'), options: options.map((o) => P(o)), answer, ...extra });

describe('Length of tap options', () => {
  it('flags a Check whose longest option is far longer than its shortest', () => {
    const k = tap('k1', ['Buy', 'Hold a broad index fund for decades', 'Sell'], 1);
    expect(lengthSignal(k).spread).toBe(true);
    expect(checkWording([k], 'L', []).join('\n')).toMatch(/k1: options differ too much in length/);
  });

  it('accepts options of similar length, and short options whose difference is only a few characters', () => {
    expect(checkWording([tap('k1', ['Hold a broad index fund', 'Trade the news each week', 'Pick last year’s winner'], 2)], 'L', [])).toEqual([]);
    expect(lengthSignal(tap('k2', ['€2k', '€20k', '€200k'], 0)).spread).toBe(false);
    expect(LENGTH_RATIO).toBe(1.6);
  });

  it('flags a Lesson where the correct option is the longest more often than one in three', () => {
    const long = (id) => tap(id, ['An option of some size', 'Another of that size', 'The right one, a touch longer'], 2);
    const fair = (id) => tap(id, ['The right one, shorter', 'A wrong one, a bit longer', 'A wrong one of this size'], 0);
    expect(checkWording([long('k1'), long('k2'), fair('k3')], 'L', []).join('\n')).toMatch(/L: the correct option is the longest in 2 of 3 tap checks, at most 1 allowed/);
    expect(checkWording([long('k1'), fair('k2'), fair('k3')], 'L', [])).toEqual([]);
  });
});

describe('Fare wording', () => {
  it('every Check needs a fare prompt that differs from its prompt in both languages', () => {
    const tf = (id, extra) => ({ kind: 'check', id, type: 'tf', source: 'c1', prompt: P('Costs compound.', 'هزینه‌ها مرکب می‌شوند.'), answer: true, ...extra });
    expect(checkWording([tf('k1', {})], 'L', []).join('\n')).toMatch(/k1: needs a "fare" prompt/);
    expect(checkWording([tf('k2', { fare: P('Costs compound.', 'هزینه‌ها روی هم جمع می‌شوند.') })], 'L', []).join('\n')).toMatch(/k2: the "fare" prompt must differ/);
    expect(checkWording([tf('k3', { fare: P('Fees grow on top of fees.', 'هزینه‌ها مرکب می‌شوند.') })], 'L', []).join('\n')).toMatch(/k3: the "fare" prompt must differ/);
    expect(checkWording([tf('k4', { fare: P('Fees grow on top of fees.', 'کارمزدها روی هم انباشته می‌شوند.') })], 'L', [])).toEqual([]);
  });
});

describe('Basics Stations follow the same rules', () => {
  const { content } = loadModules(['content', 'engine', 'store']);
  for (const st of content.stations.filter((x) => x.items && !x.book)) {
    it(`${st.id}: tap options carry no length signal and every Check has a fare prompt`, () => {
      const errs = checkWording(st.items.filter((i) => i.kind === 'check'), st.id, []);
      expect(errs, errs.join('\n')).toEqual([]);
    });
  }
});

describe('The Fare asks in other words', () => {
  let FI, R, root;
  beforeAll(() => {
    globalThis.document = { documentElement: { lang: '', dir: '' } };
    globalThis.CSS = { escape: (x) => x };
    FI = loadModules(['content', 'engine', 'store', 'render']);
    R = reducer(FI.engine, FI.content);
    root = { innerHTML: '', querySelector: () => null };
  });
  const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
  const strip = (h) => h.replace(/<[^>]+>/g, '');
  function toFare(s, id) {
    s = R(s, { type: 'OPEN_STATION', value: id });
    let guard = 300;
    while (s.phase !== 'fare' && guard-- > 0) {
      if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
      else if (s.phase === 'check') s = R(s, { type: 'ANSWER', value: FI.content.item(id, s.current).answer });
      else s = R(s, { type: 'CONTINUE' });
    }
    return s;
  }

  it('a Check shows its prompt in the Lesson and its fare prompt in the Fare, judged against the same answer', () => {
    let s = R(FI.engine.initial(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' });
    const first = FI.content.item('s1', s.current);
    expect(strip(html(s))).toContain(first.prompt.en);
    expect(strip(html(s))).not.toContain(first.fare.en);
    s = toFare(FI.engine.initial(), 's1');
    const k = FI.content.item('s1', s.current);
    expect(strip(html(s))).toContain(k.fare.en);
    expect(strip(html(s))).not.toContain(k.prompt.en);
    const before = s.fare.missed.length;
    s = R(s, { type: 'ANSWER', value: k.answer });
    expect(s.fare ? s.fare.missed.length : 0).toBe(before);
  });
});
