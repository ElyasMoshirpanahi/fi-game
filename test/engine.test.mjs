import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

const { content, engine } = loadModules(['content', 'engine']);

const R = (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
const open = (id) => ({ type: 'OPEN_STATION', value: id });
const knew = { type: 'RATE', value: 'knew' };
const didnt = { type: 'RATE', value: 'didnt' };
const cont = { type: 'CONTINUE' };
const right = (stationId, id) => ({ type: 'ANSWER', value: content.item(stationId, id).answer });
const wrong = (stationId, id) => {
  const k = content.item(stationId, id);
  if (k.type === 'tf') return { type: 'ANSWER', value: !k.answer };
  if (k.type === 'order') return { type: 'ANSWER', value: [...k.answer].reverse() };
  return { type: 'ANSWER', value: (k.answer + 1) % k.options.length };
};

// Walk a Station answering every Check right and rating every Card "knew it",
// stopping when the Fare starts.
function walkToFare(s, stationId, { miss = {} } = {}) {
  s = R(s, open(stationId));
  let guard = 200;
  while (s.phase !== 'fare' && guard-- > 0) {
    if (s.phase === 'card') s = R(s, knew);
    else if (s.phase === 'check') s = R(s, miss[s.current] ? wrong(stationId, s.current) : right(stationId, s.current));
    else if (s.phase === 'correct' || s.phase === 'revealed' || s.phase === 'widget') s = R(s, cont);
    else throw new Error(`unexpected phase ${s.phase}`);
  }
  if (guard <= 0) throw new Error('walkToFare did not reach the Fare');
  return s;
}
function answerFare(s, stationId, { missIndex = -1 } = {}) {
  const qs = s.fare.questions;
  qs.forEach((id, i) => { s = R(s, i === missIndex ? wrong(stationId, id) : right(stationId, id)); });
  return s;
}

describe('Coins increment only on a correct answer', () => {
  it('a correct Check answer earns exactly one Coin and a coin event', () => {
    let s = R(engine.initial(), open('s1'), knew);
    expect(s.phase).toBe('check');
    const before = s.coins;
    s = R(s, right('s1', s.current));
    expect(s.coins).toBe(before + 1);
    expect(s.events).toContain('coin');
  });

  it('a wrong answer, a Rating, opening a Station and flipping a Card earn nothing', () => {
    let s = R(engine.initial(), open('s1'));
    expect(s.coins).toBe(0);
    s = R(s, { type: 'FLIP' }, didnt);
    expect(s.coins).toBe(0);
    s = R(s, wrong('s1', s.current));
    expect(s.coins).toBe(0);
    expect(s.events).not.toContain('coin');
    s = R(s, wrong('s1', s.current));
    expect(s.coins).toBe(0);
    expect(s.phase).toBe('revealed');
  });

  it('a Check answered correctly twice (after a Return or a replay) pays only once', () => {
    let s = walkToFare(engine.initial(), 's1');
    const checks = content.station('s1').items.filter((i) => i.kind === 'check').length;
    expect(s.coins).toBe(checks);
    s = R(s, { type: 'BACK_TO_PATH' });
    s = walkToFare(s, 's1');
    expect(s.coins).toBe(checks);
  });

  it('Coins never decrease', () => {
    let s = walkToFare(engine.initial(), 's1');
    const c = s.coins;
    s = answerFare(s, 's1', { missIndex: 1 });
    expect(s.phase).toBe('fare-failed');
    expect(s.coins).toBe(c);
    s = R(s, { type: 'RESET' });
    expect(s.coins).toBe(0); // RESET is the only way down, and it is behind a confirm in the UI
  });
});

describe('A missed Card Returns later in the same session', () => {
  it('a Card rated "didn’t know" comes back, with its Check, after the queue and before the Fare', () => {
    let s = R(engine.initial(), open('s1'), didnt);           // s1c1 rated didn't know
    expect(s.returns).toEqual(['s1c1']);
    let seenAgain = false;
    let guard = 100;
    while (s.phase !== 'fare' && guard-- > 0) {
      if (s.phase === 'card') { if (s.current === 's1c1' && s.queue.length <= 1) seenAgain = true; s = R(s, knew); }
      else if (s.phase === 'check') s = R(s, right('s1', s.current));
      else s = R(s, cont);
    }
    expect(seenAgain).toBe(true);
    expect(s.phase).toBe('fare');
  });

  it('a Check missed twice reveals the answer and Returns its source Card', () => {
    let s = R(engine.initial(), open('s1'), knew);
    const k = s.current;
    s = R(s, wrong('s1', k));
    expect(s.hint).toBe(true);
    expect(s.events).toContain('hint');
    s = R(s, wrong('s1', k));
    expect(s.phase).toBe('revealed');
    expect(s.returns).toContain(content.item('s1', k).source);
  });

  it('a Card never Returns twice for the same miss (dedupe)', () => {
    let s = R(engine.initial(), open('s1'), didnt);
    s = R(s, wrong('s1', s.current), wrong('s1', s.current));
    expect(s.returns).toEqual(['s1c1']);
  });

  it('Returns are forgotten when the player leaves the Station', () => {
    let s = R(engine.initial(), open('s1'), didnt, { type: 'BACK_TO_PATH' });
    expect(s.returns).toEqual([]);
    expect(s.queue).toEqual([]);
  });
});

describe('A Station is Lit only after its Fare passes', () => {
  it('answering every Check correctly does not light the Station', () => {
    const s = walkToFare(engine.initial(), 's1');
    expect(s.lit.s1).toBeUndefined();
    expect(s.phase).toBe('fare');
    expect(s.fare.questions).toHaveLength(content.station('s1').fareSize);
  });

  it('passing the Fare lights the Station, awards XP and a lit event, then Continue returns to the Path', () => {
    let s = walkToFare(engine.initial(), 's1');
    s = answerFare(s, 's1');
    expect(s.phase).toBe('fare-passed');
    expect(s.lit.s1).toBe(true);
    expect(s.xp).toBeGreaterThan(0);
    expect(s.events).toContain('lit');
    s = R(s, cont);
    expect(s.screen).toBe('path');
  });

  it('failing one Fare question does not light the Station, replays only that Card, then draws a fresh Fare', () => {
    let s = walkToFare(engine.initial(), 's1');
    const first = s.fare.questions;
    s = answerFare(s, 's1', { missIndex: 1 });
    expect(s.lit.s1).toBeUndefined();
    s = R(s, cont);
    expect(s.phase).toBe('card');
    expect(s.current).toBe(content.item('s1', first[1]).source);
    s = R(s, knew, right('s1', first[1]), cont);
    expect(s.phase).toBe('fare');
    expect(s.fare.questions).not.toEqual(first);
    expect(s.fare.attempt).toBe(2);
  });

  it('no Hint is offered during the Fare', () => {
    let s = walkToFare(engine.initial(), 's1');
    s = R(s, wrong('s1', s.fare.questions[0]));
    expect(s.hint).toBe(false);
  });

  it('passing an already Lit Station again awards no new XP', () => {
    let s = walkToFare(engine.initial(), 's1');
    s = answerFare(s, 's1');
    const xp = s.xp;
    s = R(s, cont);
    s = walkToFare(s, 's1');
    s = answerFare(s, 's1');
    expect(s.xp).toBe(xp);
  });
});

describe('Language Mode', () => {
  it('defaults to EN and switches', () => {
    let s = engine.initial();
    expect(s.mode).toBe('EN');
    s = R(s, { type: 'SET_MODE', value: 'BOTH' });
    expect(s.mode).toBe('BOTH');
    s = R(s, { type: 'SET_MODE', value: 'KLINGON' });
    expect(s.mode).toBe('BOTH');
  });
});
