import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';
import { reducer, fakeStorage } from './helpers.mjs';

// Spec 1 (issue #8): Daily Review of missed and bookmarked Cards. The engine never reads the
// clock; the app sends the day number with TICK.
const { content, engine, store } = loadModules(['content', 'engine', 'store']);
const R = reducer(engine, content);
const DAY = 20000;
const start = () => R(engine.initial(), { type: 'TICK', value: DAY });
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);

describe('Deck: what joins it', () => {
  it('a Card rated "didn’t know" joins the Deck, due tomorrow, with its text and Check snapshotted', () => {
    const s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' });
    const e = s.deck.s1c1;
    expect(e).toBeTruthy();
    expect(e.due).toBe(DAY + 1);
    expect(e.box).toBe(0);
    expect(e.text).toEqual(content.item('s1', 's1c1').text);
    expect(e.check.id).toBe('s1k1');
    expect(e.check.answer).toEqual(content.item('s1', 's1k1').answer);
    expect(e.missed).toBe(true);
  });

  it('a Check missed twice (answer revealed) puts its source Card in the Deck', () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' });
    const k = content.item('s1', s.current);
    s = R(s, { type: 'ANSWER', value: wrongFor(k) }, { type: 'ANSWER', value: wrongFor(k) });
    expect(s.deck[k.source]).toBeTruthy();
  });

  it('a Card answered right never joins', () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'knew' });
    s = R(s, { type: 'ANSWER', value: content.item('s1', s.current).answer });
    expect(s.deck).toEqual({});
  });

  it('a bookmark joins; removing it removes the Card unless it was also missed', () => {
    let s = R(start(), { type: 'TOGGLE_BOOKMARK', value: { stationId: 's2', cardId: 's2c1' } });
    expect(s.deck.s2c1.marked).toBe(true);
    s = R(s, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's2', cardId: 's2c1' } });
    expect(s.deck.s2c1).toBeUndefined();
    s = R(s, { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'BACK_TO_PATH' },
      { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } }, { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: 's1c1' } });
    expect(s.deck.s1c1.missed).toBe(true);
    expect(s.deck.s1c1.marked).toBe(false);
  });
});

describe('Review session', () => {
  const withDue = () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'BACK_TO_PATH' });
    return R(s, { type: 'TICK', value: DAY + 1 });
  };

  it('nothing is due on the day a Card joins; it is due the next day', () => {
    let s = R(start(), { type: 'OPEN_STATION', value: 's1' }, { type: 'RATE', value: 'didnt' }, { type: 'BACK_TO_PATH' });
    expect(engine.dueCount(s)).toBe(0);
    expect(engine.dueCount(R(s, { type: 'TICK', value: DAY + 1 }))).toBe(1);
  });

  it('OPEN_REVIEW shows the Card, then its Check; a right answer pays a Coin and moves it up the ladder', () => {
    let s = R(withDue(), { type: 'OPEN_REVIEW' });
    expect(s.screen).toBe('review');
    expect(s.review.phase).toBe('card');
    s = R(s, { type: 'REVIEW_NEXT' });
    expect(s.review.phase).toBe('check');
    const coins = s.coins;
    s = R(s, { type: 'REVIEW_ANSWER', value: s.deck.s1c1.check.answer });
    expect(s.review.phase).toBe('result');
    expect(s.review.ok).toBe(true);
    expect(s.coins).toBe(coins + 1);
    expect(s.deck.s1c1.box).toBe(1);
    expect(s.deck.s1c1.due).toBe(DAY + 1 + engine.LADDER[1]);
    expect(s.events).toContain('correct');
    s = R(s, { type: 'REVIEW_NEXT' });
    expect(s.review.phase).toBe('done');
  });

  it('a wrong answer sends the Card back to the first step, due tomorrow, with no Coin', () => {
    let s = R(withDue(), { type: 'OPEN_REVIEW' }, { type: 'REVIEW_NEXT' });
    const coins = s.coins;
    s = R(s, { type: 'REVIEW_ANSWER', value: wrongFor(s.deck.s1c1.check) });
    expect(s.review.ok).toBe(false);
    expect(s.coins).toBe(coins);
    expect(s.deck.s1c1.box).toBe(0);
    expect(s.deck.s1c1.due).toBe(DAY + 2);
  });

  it('the ladder is 1, 3, 7, 16, 35 days and a Card retires after the last step', () => {
    expect(engine.LADDER).toEqual([1, 3, 7, 16, 35]);
    let s = withDue(); let day = DAY + 1;
    for (let i = 1; i <= 5; i++) {
      s = R(s, { type: 'TICK', value: day }, { type: 'OPEN_REVIEW' }, { type: 'REVIEW_NEXT' });
      s = R(s, { type: 'REVIEW_ANSWER', value: s.deck.s1c1.check.answer });
      if (i < 5) { expect(s.deck.s1c1.box).toBe(i); day = s.deck.s1c1.due; } else expect(s.deck.s1c1).toBeUndefined();
      s = R(s, { type: 'REVIEW_NEXT' }, { type: 'BACK_TO_PATH' });
    }
  });

  it('a Card with no Check is rated instead', () => {
    // s1c5 has no Check of its own in Station 1
    const noCheck = content.station('s1').items.find((i) => i.kind === 'card' && !content.station('s1').items.some((k) => k.kind === 'check' && k.source === i.id));
    let s = R(start(), { type: 'TOGGLE_BOOKMARK', value: { stationId: 's1', cardId: noCheck.id } }, { type: 'TICK', value: DAY + 1 }, { type: 'OPEN_REVIEW' });
    expect(s.deck[noCheck.id].check).toBeNull();
    s = R(s, { type: 'REVIEW_RATE', value: 'knew' });
    expect(s.review.phase).toBe('result');
    expect(s.deck[noCheck.id].box).toBe(1);
  });

  it('a session holds at most 20 Cards, earliest due first; an empty Deck opens as done', () => {
    let s = start();
    const cards = content.stations.filter((st) => st.items).flatMap((st) => st.items.filter((i) => i.kind === 'card').map((i) => ({ stationId: st.id, cardId: i.id }))).slice(0, 25);
    for (const c of cards) s = R(s, { type: 'TOGGLE_BOOKMARK', value: c });
    s = R(s, { type: 'TICK', value: DAY + 1 }, { type: 'OPEN_REVIEW' });
    expect(s.review.ids).toHaveLength(20);
    expect(R(start(), { type: 'OPEN_REVIEW' }).review.phase).toBe('done');
  });

  it('the Deck survives a reload', () => {
    const storage = fakeStorage();
    const s = withDue();
    store.save(storage, s);
    const again = R(engine.initial(), { type: 'HYDRATE', value: store.load(storage) }, { type: 'TICK', value: DAY + 1 });
    expect(again.deck.s1c1.check.id).toBe('s1k1');
    expect(engine.dueCount(again)).toBe(1);
  });
});
