import { describe, it, expect, beforeAll } from 'vitest';
import { checkWording, lengthBalance, lengthSignal, LENGTH_SLACK, RANK_MIN_SET } from '../scripts/validate-book-v3.mjs';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 3 (issue #10): tap options that give nothing away by length, in either language, and a Fare that asks in other words.
const P = (en, fa = en) => ({ en, fa });
const tap = (id, options, answer, extra = {}) => ({ kind: 'check', id, type: 'tap', source: 'c1', prompt: P('Which one is it?', 'کدام است؟'), fare: P('Pick the right one.', 'درست را بردار.'), options: options.map((o) => (typeof o === 'string' ? P(o) : o)), answer, ...extra });
// A tap Check whose correct option holds the given length rank in both languages.
const ranked = (id, rank) => tap(id, rank === 'longest' ? ['aaaaaaaaaaaaaa', 'bbbbbbbbbbbb', 'cccccccccccc'] : rank === 'shortest' ? ['aaaaaaaaaaaa', 'bbbbbbbbbbbbbb', 'cccccccccccccc'] : ['aaaaaaaaaaaaa', 'bbbbbbbbbbbb', 'cccccccccccccc'], 0);
const set = (longest, shortest, between) => [...Array(longest).fill('longest'), ...Array(shortest).fill('shortest'), ...Array(between).fill('between')].map((r, i) => ranked(`k${i}`, r));

describe('Spread of option lengths in one Check', () => {
  it('flags options far apart in length, in English', () => {
    const errs = checkWording([tap('k1', ['Buy', 'Hold a broad index fund for decades', 'Sell'], 1)], 'L', []);
    expect(errs.join('\n')).toMatch(/k1: en options differ too much in length/);
  });

  it('flags the same in Farsi even when the English is even', () => {
    const k = tap('k1', [P('Hold an index fund', 'صندوق'), P('Trade on the news', 'معامله بر اساس خبرهای روز بازار'), P('Pick one winner', 'انتخاب یک سهم')], 0);
    expect(lengthSignal(k, 'en').spread).toBe(false);
    expect(lengthSignal(k, 'fa').spread).toBe(true);
    expect(checkWording([k], 'L', []).join('\n')).toMatch(/k1: fa options differ too much in length/);
  });

  it('allows short options that are only a few characters apart, up to the slack and not beyond', () => {
    expect(lengthSignal(tap('k1', ['€2k', '€20k', '€200k'], 0)).spread).toBe(false);
    const at = (extra) => tap('k', ['abc', 'abcd', 'abc' + 'x'.repeat(extra)], 0);
    expect(lengthSignal(at(LENGTH_SLACK)).spread).toBe(false);
    expect(lengthSignal(at(LENGTH_SLACK + 1)).spread).toBe(true);
  });
});

describe('Rank of the correct option across a set of Checks', () => {
  it('names the rank: longest, shortest, or between (a tie counts as between)', () => {
    expect(lengthSignal(ranked('a', 'longest')).rank).toBe('longest');
    expect(lengthSignal(ranked('a', 'shortest')).rank).toBe('shortest');
    expect(lengthSignal(ranked('a', 'between')).rank).toBe('between');
    expect(lengthSignal(tap('t', ['same size', 'same size', 'tiny'], 0)).rank).toBe('between');
  });

  it('accepts an even spread of ranks', () => {
    expect(lengthBalance(set(3, 3, 3), 'B', [])).toEqual([]);
    expect(lengthBalance(set(4, 3, 2), 'B', [])).toEqual([]);
  });

  it('flags a set where the correct option is too often the longest, the shortest, or neither', () => {
    expect(lengthBalance(set(6, 2, 1), 'B', []).join('\n')).toMatch(/B: in en, the correct option is the longest in 6 of 9 tap checks, at most 5 allowed/);
    expect(lengthBalance(set(1, 6, 2), 'B', []).join('\n')).toMatch(/the shortest in 6 of 9/);
    expect(lengthBalance(set(1, 2, 6), 'B', []).join('\n')).toMatch(/neither the longest nor the shortest in 6 of 9/);
  });

  it('judges each language on its own', () => {
    const k = (i) => tap(`k${i}`, [P('aaaaaaaaaaaaa', 'ااااااااااااااا'), P('bbbbbbbbbbbb', 'بببببببببببب'), P('cccccccccccccc', 'پپپپپپپپپپپپ')], 0);
    const errs = lengthBalance([0, 1, 2, 3, 4, 5].map(k), 'B', []).join('\n');
    expect(errs).toMatch(/in en, the correct option is neither/);
    expect(errs).toMatch(/in fa, the correct option is the longest/);
  });

  it('leaves a set too small to judge alone', () => {
    expect(lengthBalance(set(RANK_MIN_SET - 1, 0, 0), 'B', [])).toEqual([]);
    expect(lengthBalance(set(RANK_MIN_SET, 0, 0), 'B', [])).not.toEqual([]);
  });
});

describe('Fare wording', () => {
  const tf = (id, extra) => ({ kind: 'check', id, type: 'tf', source: 'c1', prompt: P('Costs compound.', 'هزینه‌ها مرکب می‌شوند.'), answer: true, ...extra });
  it('every Check needs one, different from its prompt in both languages', () => {
    expect(checkWording([tf('k1', {})], 'L', []).join('\n')).toMatch(/k1: needs a "fare" prompt/);
    expect(checkWording([tf('k2', { fare: P('Costs compound.', 'هزینه‌ها روی هم جمع می‌شوند.') })], 'L', []).join('\n')).toMatch(/k2: the "fare" prompt must differ/);
    expect(checkWording([tf('k3', { fare: P('Fees grow on top of fees.', 'هزینه‌ها مرکب می‌شوند.') })], 'L', []).join('\n')).toMatch(/k3: the "fare" prompt must differ/);
    expect(checkWording([tf('k4', { fare: P('Fees grow on top of fees.', 'کارمزدها روی هم انباشته می‌شوند.') })], 'L', [])).toEqual([]);
  });

  it('a change of case, spacing or punctuation is not another wording', () => {
    expect(checkWording([tf('k5', { fare: P('costs  compound', 'هزینه‌ها مرکب می‌شوند!') })], 'L', []).join('\n')).toMatch(/k5: the "fare" prompt must differ/);
  });
});

describe('Basics Stations follow the same rules', () => {
  const { content } = loadModules(['content', 'engine', 'store']);
  const basics = content.stations.filter((x) => x.items && !x.book);
  for (const st of basics) {
    it(`${st.id}: no Check has options far apart in length, and every Check has a Fare wording`, () => {
      const errs = checkWording(st.items.filter((i) => i.kind === 'check'), st.id, []);
      expect(errs, errs.join('\n')).toEqual([]);
    });
  }
  it('taken together, the correct option holds no length rank too often', () => {
    const errs = lengthBalance(basics.flatMap((st) => st.items.filter((i) => i.kind === 'check')), 'Basics', []);
    expect(errs, errs.join('\n')).toEqual([]);
  });
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

  it('a Check shows its prompt in the Lesson and its Fare wording in the Fare, judged against the same answer', () => {
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

  it('Review shows the prompt, and a Deck entry made before Fare wordings existed still opens', () => {
    let s = R(FI.engine.initial(), { type: 'TICK', value: 100 }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'TICK', value: 101 }, { type: 'OPEN_REVIEW' }, { type: 'REVIEW_NEXT' });
    expect(s.deck.s1c1.check.fare).toBeUndefined();
    expect(strip(html(s))).toContain(FI.content.item('s1', 's1k1').prompt.en);
  });
});
