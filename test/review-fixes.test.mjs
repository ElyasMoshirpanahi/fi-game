import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 1 code review (docs/review/spec1-review-code-review.md): one test per finding that was fixed.
const { content, engine } = loadModules(['content', 'engine', 'store']);
const R = reducer(engine, content);
const DAY = 20000;
const start = () => R(engine.initial(), { type: 'TICK', value: DAY });
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
const mark = (stationId, cardId) => ({ type: 'TOGGLE_BOOKMARK', value: { stationId, cardId } });
const checksOf = (stationId) => content.station(stationId).items.filter((i) => i.kind === 'check');

function toFare(s, stationId) {
  s = R(s, { type: 'OPEN_STATION', value: stationId });
  let guard = 300;
  while (s.phase !== 'fare' && guard-- > 0) {
    if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
    else if (s.phase === 'check') s = R(s, { type: 'ANSWER', value: content.item(stationId, s.current).answer });
    else s = R(s, { type: 'CONTINUE' });
  }
  if (s.phase !== 'fare') throw new Error('did not reach the Fare');
  return s;
}
const reviewOne = (s, ok = true) => {
  const id = s.review.ids[s.review.index];
  const k = s.deck[id].check;
  if (!k) return R(s, { type: 'REVIEW_RATE', value: ok ? 'knew' : 'didnt' }, { type: 'REVIEW_NEXT' });
  return R(s, { type: 'REVIEW_NEXT' }, { type: 'REVIEW_ANSWER', value: ok ? k.answer : wrongFor(k) }, { type: 'REVIEW_NEXT' });
};

describe('Coins in Review', () => {
  it('leaving and rejoining the Deck does not pay the same step twice', () => {
    let s = R(start(), mark('s2', 's2c1'));
    let day = DAY;
    for (let i = 0; i < 6; i++) {
      day += 1;
      s = R(s, { type: 'TICK', value: day }, { type: 'OPEN_REVIEW' });
      s = reviewOne(s);
      s = R(s, { type: 'BACK_TO_PATH' }, mark('s2', 's2c1'), mark('s2', 's2c1'));
    }
    expect(s.coins).toBe(1);
  });

  it('a Card pays one Coin per step on the way up: five in all', () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'BACK_TO_PATH' });
    let day = DAY + 1;
    for (let i = 0; i < 5; i++) {
      s = R(s, { type: 'TICK', value: day }, { type: 'OPEN_REVIEW' });
      if (s.deck.s1c1) day = DAY + 1000 * (i + 1);
      s = reviewOne(s);
      s = R(s, { type: 'BACK_TO_PATH' });
    }
    expect(s.deck.s1c1).toBeUndefined();
    expect(s.coins).toBe(5);
  });
});

describe('What the Deck stores', () => {
  it('a missed Fare question puts its Card in the Deck with that question', () => {
    let s = toFare(start(), 's1');
    const id = s.fare.questions[0];
    const k = content.item('s1', id);
    s = R(s, { type: 'ANSWER', value: wrongFor(k) });
    expect(s.deck[k.source].missed).toBe(true);
    expect(s.deck[k.source].check.id).toBe(id);
  });

  it('stores the Check that was missed, not the first Check of the Card', () => {
    const st = content.stations.filter((x) => x.items).find((x) => checksOf(x.id).some((k) => checksOf(x.id).filter((o) => o.source === k.source).length > 1));
    if (!st) return; // no Card in the built-in Stations has two Checks
    const second = checksOf(st.id).filter((k, _, all) => all.filter((o) => o.source === k.source).length > 1)[1];
    let s = R(start(), { type: 'OPEN_STATION', value: st.id });
    let guard = 300;
    while (s.current !== second.id && guard-- > 0) {
      if (s.phase === 'card') s = R(s, { type: 'RATE', value: 'knew' });
      else if (s.phase === 'check') s = R(s, { type: 'ANSWER', value: content.item(st.id, s.current).answer });
      else s = R(s, { type: 'CONTINUE' });
    }
    s = R(s, { type: 'ANSWER', value: wrongFor(second) }, { type: 'ANSWER', value: wrongFor(second) });
    expect(s.deck[second.source].check.id).toBe(second.id);
  });

  it('a Card both bookmarked and missed is one entry carrying both reasons', () => {
    let s = R(start(), mark('s1', 's1c1'), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' });
    expect(Object.keys(s.deck)).toEqual(['s1c1']);
    expect(s.deck.s1c1).toMatchObject({ marked: true, missed: true, box: 0 });
  });

  it('a miss on a Card that is due today leaves it due today', () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'BACK_TO_PATH' }, { type: 'TICK', value: DAY + 1 });
    expect(engine.dueCount(s)).toBe(1);
    s = R(s, { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'BACK_TO_PATH' });
    expect(engine.dueCount(s)).toBe(1);
  });

  it('a corrected Card text reaches the Deck when Review opens', () => {
    let s = R(start(), mark('s2', 's2c1'));
    s.deck.s2c1.text = { en: 'old wording', fa: 'old' };
    s = R(s, { type: 'TICK', value: DAY + 1 }, { type: 'OPEN_REVIEW' });
    expect(s.deck.s2c1.text).toEqual(content.item('s2', 's2c1').text);
  });

  it('RESET empties the Deck and the day count', () => {
    let s = R(start(), mark('s2', 's2c1'), { type: 'TICK', value: DAY + 1 }, { type: 'OPEN_REVIEW' });
    s = R(reviewOne(s), { type: 'RESET' });
    expect(s.deck).toEqual({});
    expect(s.reviewed).toBeNull();
    expect(s.today).toBe(DAY + 1);
  });
});

describe('Bookmarks and the Deck', () => {
  it('a bookmark saved before Review existed joins the Deck', () => {
    const saved = { v: 1, bookmarks: [{ stationId: 's2', cardId: 's2c1', text: content.item('s2', 's2c1').text }] };
    const s = R(engine.initial(), { type: 'HYDRATE', value: saved }, { type: 'TICK', value: DAY });
    expect(s.deck.s2c1).toMatchObject({ marked: true, missed: false, due: DAY + 1 });
    expect(R(s, { type: 'TICK', value: DAY + 1 }).deck.s2c1.due).toBe(DAY + 1);
  });

  it('a bookmark whose Card is gone can still be removed, and its Deck entry goes with it', () => {
    const saved = { v: 1, bookmarks: [{ stationId: 's2', cardId: 'gone-card', text: { en: 'x', fa: 'x' } }] };
    let s = R(engine.initial(), { type: 'HYDRATE', value: saved }, { type: 'TICK', value: DAY });
    expect(s.deck['gone-card']).toBeTruthy();
    s = R(s, mark('s2', 'gone-card'));
    expect(s.bookmarks).toEqual([]);
    expect(s.deck['gone-card']).toBeUndefined();
    expect(R(s, mark('s2', 'gone-card')).bookmarks).toEqual([]);
  });

  it('a saved game with a broken Deck loads with an empty one', () => {
    const s = R(engine.initial(), { type: 'HYDRATE', value: { v: 1, deck: null, bookmarks: null } }, { type: 'TICK', value: DAY });
    expect(s.deck).toEqual({});
    expect(engine.dueCount(s)).toBe(0);
  });
});

describe('Review session', () => {
  const backlog = (n) => {
    let s = start();
    const cards = content.stations.filter((st) => st.items).flatMap((st) => st.items.filter((i) => i.kind === 'card').map((i) => mark(st.id, i.id))).slice(0, n);
    for (const c of cards) s = R(s, c);
    return R(s, { type: 'TICK', value: DAY + 1 });
  };

  it('the cap of 20 is per day: reopening does not serve the rest of a backlog', () => {
    let s = R(backlog(25), { type: 'OPEN_REVIEW' });
    expect(engine.dueCount(s)).toBe(20);
    for (let i = 0; i < 20; i++) s = reviewOne(s);
    expect(s.review.phase).toBe('done');
    s = R(s, { type: 'BACK_TO_PATH' });
    expect(engine.dueCount(s)).toBe(0);
    s = R(s, { type: 'OPEN_REVIEW' });
    expect(s.review.ids).toEqual([]);
    expect(s.review.capped).toBe(true);
    s = R(s, { type: 'BACK_TO_PATH' }, { type: 'TICK', value: DAY + 2 });
    expect(engine.dueCount(s)).toBe(5);
  });

  it('an order Check is answered with the full order', () => {
    const st = content.stations.filter((x) => x.items).find((x) => checksOf(x.id).some((k) => k.type === 'order'));
    const k = checksOf(st.id).find((x) => x.type === 'order');
    let s = R(start(), mark(st.id, k.source), { type: 'TICK', value: DAY + 1 }, { type: 'OPEN_REVIEW' });
    s.deck[k.source].check = { id: k.id, type: k.type, prompt: k.prompt, options: k.options, answer: k.answer };
    s = R(s, { type: 'REVIEW_NEXT' }, { type: 'REVIEW_ANSWER', value: [...k.answer].reverse() });
    expect(s.review.ok).toBe(false);
    s = R(s, { type: 'REVIEW_NEXT' }, { type: 'BACK_TO_PATH' }, { type: 'TICK', value: DAY + 2 }, { type: 'OPEN_REVIEW' }, { type: 'REVIEW_NEXT' });
    s = R(s, { type: 'REVIEW_ANSWER', value: k.answer });
    expect(s.review.ok).toBe(true);
  });
});
