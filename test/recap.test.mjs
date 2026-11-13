import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 15 (issue #34): a Card has one button and answers decide what was missed; every Section ends with a Recap.
const here = path.dirname(fileURLToPath(import.meta.url));
let FI, R, E, root, sec;
const q = (action) => JSON.stringify(action).replace(/"/g, '&quot;');
const html = (s) => { FI.render.render(root, s, FI.content); return root.innerHTML; };
const wrongFor = (k) => (k.type === 'tf' ? !k.answer : k.type === 'order' ? [...k.answer].reverse() : (k.answer + 1) % k.options.length);
const cont = { type: 'CONTINUE' };

beforeAll(() => {
  globalThis.document = { documentElement: { lang: '', dir: '' } };
  globalThis.CSS = { escape: (x) => x };
  FI = loadModules(['content', 'engine', 'store', 'render']);
  E = FI.engine; R = reducer(E, FI.content);
  const b = JSON.parse(fs.readFileSync(path.join(here, '..', 'content', 'books', 'v3', 'b04.json'), 'utf8'));
  FI.content.registerBook(b, b.id);
  root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  sec = FI.content.sectionOf('b04');
});

// Play a Station to its passed Fare, as the page now plays it: Continue on a Card, no rating.
// `missIds` are Checks answered wrong once and then right with the Hint.
function pass(s, id, missIds = []) {
  s = R(s, { type: 'OPEN_STATION', value: id });
  const missed = new Set(); let guard = 800;
  while (s.phase !== 'fare-passed' && guard-- > 0) {
    if (s.phase === 'check' || s.phase === 'fare') {
      const k = FI.content.item(id, s.current);
      if (s.phase === 'check' && missIds.includes(k.id) && !missed.has(k.id)) { missed.add(k.id); s = R(s, { type: 'ANSWER', value: wrongFor(k) }); }
      s = R(s, { type: 'ANSWER', value: k.answer });
    } else s = R(s, cont);
  }
  return s;
}
const lesson = (s, id, missIds) => R(pass(s, id, missIds), { type: 'BACK_TO_PATH' });
const checksOf = (id) => FI.content.station(id).items.filter((i) => i.kind === 'check');
const playAll = (s, missIds = []) => sec.runs.reduce((st, id) => lesson(st, id, missIds), s);
function recap(s, wrongAt = []) {
  s = R(s, { type: 'OPEN_RECAP', value: sec.id });
  let n = 0; let guard = 100;
  while (s.review && s.review.phase !== 'done' && guard-- > 0) {
    if (s.review.phase === 'check') { const k = s.review.pool[s.review.ids[s.review.index]].check; s = R(s, { type: 'REVIEW_ANSWER', value: wrongAt.includes(n) ? wrongFor(k) : k.answer }); n += 1; }
    else s = R(s, { type: 'REVIEW_NEXT' });
  }
  return s;
}

describe('A Card has one button', () => {
  it('Continue moves on from a Card', () => {
    let s = R(E.initial(), { type: 'OPEN_STATION', value: 's1' });
    expect(s.phase).toBe('card');
    const first = s.current;
    s = R(s, cont);
    expect(s.current).not.toBe(first);
  });

  it('the Card shows Continue and no rating', () => {
    const out = html(R(E.initial(), { type: 'OPEN_STATION', value: 's1' }));
    expect(out).toContain(q(cont));
    expect(out).not.toContain('RATE');
    expect(out).not.toContain('Knew it');
    expect(out).not.toContain("Didn't know");
  });
});

describe('The first wrong answer decides', () => {
  const toFirstCheck = () => { let s = R(E.initial(), { type: 'OPEN_STATION', value: 's1' }); let g = 20; while (s.phase !== 'check' && g-- > 0) s = R(s, cont); return s; };

  it('queues the Card to Return in this Lesson and puts it in the Deck', () => {
    let s = toFirstCheck();
    const k = FI.content.item('s1', s.current);
    s = R(s, { type: 'ANSWER', value: wrongFor(k) });
    expect(s.hint).toBe(true);
    expect(s.returns).toContain(k.source);
    expect(s.deck[k.source]).toMatchObject({ missed: true });
    s = R(s, { type: 'ANSWER', value: k.answer });
    expect(s.phase).toBe('correct');
    expect(s.returns).toContain(k.source);
  });

  it('a right first answer queues nothing', () => {
    let s = toFirstCheck();
    s = R(s, { type: 'ANSWER', value: FI.content.item('s1', s.current).answer });
    expect(s.returns).toEqual([]);
    expect(Object.keys(s.deck)).toEqual([]);
  });

  it('the Lesson end names a Card missed once and answered with the Hint', () => {
    const k = checksOf('s1')[0];
    const s = pass(E.initial(), 's1', [k.id]);
    expect(s.end.missed).toEqual([k.source]);
    expect(s.end.clean).toBe(false);
  });
});

describe('The Recap of a Section', () => {
  it('is closed until every Lesson has a passed Fare', () => {
    let s = E.initial();
    expect(E.recapOpen(s, FI.content, sec)).toBe(false);
    expect(R(s, { type: 'OPEN_RECAP', value: sec.id }).screen).toBe('path');
    for (const id of sec.runs.slice(0, -1)) s = lesson(s, id);
    expect(E.recapOpen(s, FI.content, sec)).toBe(false);
    s = lesson(s, sec.runs[sec.runs.length - 1]);
    expect(E.recapOpen(s, FI.content, sec)).toBe(true);
  });

  it('asks one question from each Lesson when nothing was missed, at most twelve', () => {
    const s = R(playAll(E.initial()), { type: 'OPEN_RECAP', value: sec.id });
    expect(s.screen).toBe('review');
    expect(s.review).toMatchObject({ recap: sec.id, phase: 'check', index: 0 });
    const entries = s.review.ids.map((id) => s.review.pool[id]);
    expect(entries.length).toBe(Math.min(E.RECAP_MAX, sec.runs.length));
    expect(new Set(entries.map((e) => e.stationId)).size).toBe(entries.length);
  });

  it('asks first about the Cards that were missed', () => {
    const last = sec.runs[sec.runs.length - 1];
    const k = checksOf(last)[1];
    const s = R(playAll(E.initial(), [k.id]), { type: 'OPEN_RECAP', value: sec.id });
    expect(s.review.pool[s.review.ids[0]]).toMatchObject({ stationId: last, cardId: k.source });
    const fromLast = s.review.ids.map((id) => s.review.pool[id]).filter((e) => e.stationId === last);
    expect(fromLast.every((e) => e.cardId === k.source)).toBe(true);
  });

  it('a wrong answer shows the result and sends the Card to Review; a right one moves no ladder', () => {
    let s = R(playAll(E.initial()), { type: 'OPEN_RECAP', value: sec.id });
    const e = s.review.pool[s.review.ids[0]];
    s = R(s, { type: 'REVIEW_ANSWER', value: wrongFor(e.check) });
    expect(s.review).toMatchObject({ phase: 'result', ok: false });
    expect(s.deck[e.cardId]).toMatchObject({ missed: true, box: 0 });
    s = R(s, { type: 'REVIEW_NEXT' });
    expect(s.review.phase).toBe('check');
    const e2 = s.review.pool[s.review.ids[1]];
    s = R(s, { type: 'REVIEW_ANSWER', value: e2.check.answer });
    expect(s.review.ok).toBe(true);
    expect(s.deck[e2.cardId]).toBeUndefined();
    expect(s.reviewed).toBeNull();
  });

  it('pays once, marks the Section recapped and counts for the streak', () => {
    let s = R(playAll(E.initial()), { type: 'TICK', value: 500 });
    const before = s.coins;
    s = recap(s, [0]);
    expect(s.review).toMatchObject({ phase: 'done', right: s.review.ids.length - 1 });
    expect(s.coins).toBe(before + E.RECAP_PAY);
    expect(s.recaps[sec.id]).toBe(true);
    expect(s.events).toContain('recap-done');
    expect(s.streak).toMatchObject({ n: 1, last: 500 });
    const again = recap(R(s, { type: 'BACK_TO_PATH' }));
    expect(again.coins).toBe(s.coins);
  });

  it('survives a save and a backup, and a damaged value is refused', () => {
    const s = recap(playAll(E.initial()));
    expect(R(E.initial(), { type: 'HYDRATE', value: FI.store.durable(s) }).recaps).toEqual({ [sec.id]: true });
    expect(R(E.initial(), { type: 'HYDRATE', value: { coins: 3 } }).recaps).toEqual({});
    expect(E.badKeys({ recaps: { a: 'yes' } })).toContain('recaps');
  });
});

describe('The Recap on screen', () => {
  const stop = (out) => { const a = out.indexOf('class="recapstop', out.indexOf(`id="${sec.id}"`)); return out.slice(a, out.indexOf('</div>', a)); };

  it('every Section ends with a Recap stop', () => {
    const out = html(E.initial());
    expect((out.match(/class="recapstop/g) || []).length).toBe(FI.content.sections.length);
  });

  it('is closed with a reason, then open, then done', () => {
    expect(stop(html(E.initial()))).toContain('recapstop closed');
    expect(stop(html(E.initial()))).not.toContain('OPEN_RECAP');
    const open = playAll(E.initial());
    expect(stop(html(open))).toContain('recapstop open');
    expect(stop(html(open))).toContain(q({ type: 'OPEN_RECAP', value: sec.id }));
    const done = R(recap(open), { type: 'BACK_TO_PATH' });
    expect(stop(html(done))).toContain('recapstop done');
    expect(stop(html(done))).toContain(q({ type: 'OPEN_RECAP', value: sec.id }));
  });

  it('the last Lesson of a Section leads into the Recap', () => {
    let s = E.initial();
    for (const id of sec.runs.slice(0, -1)) s = lesson(s, id);
    s = pass(s, sec.runs[sec.runs.length - 1]);
    let guard = 6; while (s.end.step !== 'onward' && guard-- > 0) s = R(s, s.end.step === 'chest' ? { type: 'OPEN_CHEST', value: 0 } : cont, ...(s.end.step === 'chest' ? [cont] : []));
    const out = html(s);
    const at = out.indexOf(q({ type: 'OPEN_RECAP', value: sec.id }));
    expect(at).toBeGreaterThan(-1);
    expect(out.slice(at - 60, at)).toContain('btn primary');
  });

  it('asks the question without the Card, shows the answer when wrong, and ends on a score', () => {
    let s = R(playAll(E.initial()), { type: 'OPEN_RECAP', value: sec.id });
    let out = html(s);
    expect(out).toContain('class="prompt"');
    expect(out).not.toContain('class="ctext"');
    expect(out).toContain('Recap');
    const e = s.review.pool[s.review.ids[0]];
    out = html(R(s, { type: 'REVIEW_ANSWER', value: wrongFor(e.check) }));
    expect(out).toContain('feedback bad');
    expect(out).toContain('class="ans"');
    const done = recap(playAll(E.initial()), [0]);
    out = html(done);
    expect(out).toContain('class="recapscore"');
    expect(out).toContain(`${done.review.ids.length - 1}`);
  });

  it('renders in Farsi', () => {
    const s = R(playAll(E.initial()), { type: 'SET_MODE', value: 'FA' });
    expect(stop(html(s))).toContain('recapstop open');
    expect(html(R(s, { type: 'OPEN_RECAP', value: sec.id }))).toContain('class="prompt"');
  });
});
