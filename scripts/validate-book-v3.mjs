// Validate a v3 book file (Section > Circles > Lessons > Points) against the content rules.
// Usage: node scripts/validate-book-v3.mjs content/books/v3/b01.json [more files]
// Decisions 30 to 37: tiers high 3 Circles, mid 2, low 1; 3 to 5 Lessons per Circle;
// 10 to 15 Points per Lesson, the first Point framed (why this matters); a Check after
// every 2 to 3 Points; fairness (the correct option is worded in its source Card).
import fs from 'node:fs';

const TIER_CIRCLES = { high: 3, mid: 2, low: 1 };
// Complexity sets Lessons per Circle and Points per Lesson (docs/sizing-complexity.md, owner-approved 2026-11-10).
export const COMPLEXITY = { 1: { lessons: [3, 3], points: [10, 11] }, 2: { lessons: [3, 3], points: [11, 12] }, 3: { lessons: [4, 4], points: [12, 13] }, 4: { lessons: [4, 5], points: [13, 14] }, 5: { lessons: [5, 5], points: [14, 15] } };
const tokens = (s) => s.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9€%]+/).filter((t) => t.length >= 4 || /^\d+$/.test(t));
const appearsIn = (needle, hay) => { const h = tokens(hay); return tokens(needle).every((t) => h.some((x) => x.startsWith(t.slice(0, 4)))); };
const sentences = (s) => (s.match(/[.!?](\s|$)/g) || []).length;
const isPair = (p) => p && typeof p.en === 'string' && p.en.trim() && typeof p.fa === 'string' && p.fa.trim();

export function validateBook(b, errs) {
  if (!/^b\d\d$/.test(b.id || '')) errs.push('id must look like b01');
  if (!b.title) errs.push('title missing');
  for (const k of ['author', 'why', 'badge']) if (!isPair(b[k])) errs.push(`${k} must be {en, fa}`);
  if (!Number.isInteger(b.year)) errs.push('year must be an integer');
  if (![1, 2, 3, 5, 6].includes(b.stage)) errs.push('stage must be 1, 2, 3, 5 or 6');
  if (typeof b.must !== 'boolean') errs.push('must must be boolean');
  if (!TIER_CIRCLES[b.tier]) errs.push('tier must be high, mid or low');
  const cx = COMPLEXITY[b.complexity];
  if (!cx) errs.push('complexity must be 1 to 5');
  const circles = b.circles || [];
  if (TIER_CIRCLES[b.tier] && circles.length !== TIER_CIRCLES[b.tier]) errs.push(`tier ${b.tier} needs ${TIER_CIRCLES[b.tier]} circles, got ${circles.length}`);
  const ids = new Set();
  const uniq = (id, where) => { if (ids.has(id)) errs.push(`${where}: duplicate id ${id}`); ids.add(id); };
  circles.forEach((c, ci) => {
    const cid = `${b.id}c${ci + 1}`;
    if (c.id !== cid) errs.push(`circle ${ci + 1}: id must be ${cid}`);
    uniq(c.id, 'circle');
    if (!isPair(c.title)) errs.push(`${cid}: title must be {en, fa}`);
    const lessons = c.lessons || [];
    if (lessons.length < 3 || lessons.length > 5) errs.push(`${cid}: 3 to 5 lessons, got ${lessons.length}`);
    if (cx && (lessons.length < cx.lessons[0] || lessons.length > cx.lessons[1])) errs.push(`${cid}: complexity ${b.complexity} needs ${cx.lessons.join(' to ')} lessons, got ${lessons.length}`);
    lessons.forEach((l, li) => {
      const lid = `${cid}l${li + 1}`;
      if (l.id !== lid) errs.push(`${cid} lesson ${li + 1}: id must be ${lid}`);
      uniq(l.id, 'lesson');
      if (!isPair(l.title)) errs.push(`${lid}: title must be {en, fa}`);
      const items = l.items || [];
      const cards = items.filter((i) => i.kind === 'card');
      const checks = items.filter((i) => i.kind === 'check');
      if (cards.length < 10 || cards.length > 15) errs.push(`${lid}: 10 to 15 points, got ${cards.length}`);
      if (cx && (cards.length < cx.points[0] || cards.length > cx.points[1])) errs.push(`${lid}: complexity ${b.complexity} needs ${cx.points.join(' to ')} points, got ${cards.length}`);
      if (!cards.length || cards[0].frame !== true) errs.push(`${lid}: the first point must carry "frame": true (why this matters)`);
      if (items[0] && items[0].kind !== 'card') errs.push(`${lid}: must start with a card`);
      const minChecks = Math.floor(cards.length / 3), maxChecks = Math.ceil(cards.length / 2);
      if (checks.length < minChecks || checks.length > maxChecks) errs.push(`${lid}: ${cards.length} points need ${minChecks} to ${maxChecks} checks (one every 2 to 3 points), got ${checks.length}`);
      // gap rule: never more than 3 cards in a row without a check, except the last stretch may be 3
      let run = 0;
      for (const it of items) { if (it.kind === 'card') { run++; if (run > 3) { errs.push(`${lid}: more than 3 points in a row without a check`); break; } } else run = 0; }
      if (!checks.some((k) => k.type === 'tap')) errs.push(`${lid}: needs at least one tap check`);
      if (!checks.some((k) => k.type === 'tf')) errs.push(`${lid}: needs at least one true/false check`);
      if (Number.isInteger(l.minutes) && Math.abs(l.minutes - cards.length) > 4) errs.push(`${lid}: minutes should be about one per point`);
      items.forEach((it, idx) => {
        if (!it.id || !it.id.startsWith(lid)) errs.push(`${it.id}: id must start with ${lid}`);
        uniq(it.id, lid);
        if (it.kind === 'card') {
          if (!isPair(it.text)) errs.push(`${it.id}: text must be {en, fa}`);
          else {
            if (sentences(it.text.en) > 2) errs.push(`${it.id}: en text has ${sentences(it.text.en)} sentences, max 2`);
            if (it.text.en.length > 220) errs.push(`${it.id}: en text ${it.text.en.length} chars, max 220`);
          }
        } else if (it.kind === 'check') {
          if (!isPair(it.prompt)) errs.push(`${it.id}: prompt must be {en, fa}`);
          const srcIdx = items.findIndex((i) => i.id === it.source && i.kind === 'card');
          if (srcIdx < 0) errs.push(`${it.id}: source card ${it.source} not found in this lesson`);
          else if (srcIdx > idx) errs.push(`${it.id}: source card ${it.source} must come BEFORE the check`);
          const src = items[srcIdx];
          if (it.type === 'tap') {
            if (!Array.isArray(it.options) || it.options.length < 3) errs.push(`${it.id}: tap needs 3+ options`);
            else {
              it.options.forEach((o, i) => { if (!isPair(o)) errs.push(`${it.id}: option ${i} must be {en, fa}`); });
              if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer >= it.options.length) errs.push(`${it.id}: answer must be an option index`);
              else if (src && isPair(it.options[it.answer]) && !appearsIn(it.options[it.answer].en, src.text.en)) errs.push(`${it.id}: correct option "${it.options[it.answer].en}" is not worded in source card ${it.source}`);
            }
          } else if (it.type === 'tf') {
            if (typeof it.answer !== 'boolean') errs.push(`${it.id}: tf answer must be boolean`);
          } else if (it.type === 'order') {
            if (!Array.isArray(it.options) || it.options.length < 3 || it.options.length > 5) errs.push(`${it.id}: order needs 3 to 5 options`);
            else {
              const n = it.options.length;
              if (!Array.isArray(it.answer) || new Set(it.answer).size !== n || it.answer.some((x) => !Number.isInteger(x) || x < 0 || x >= n)) errs.push(`${it.id}: order answer must be a permutation of 0..${n - 1}`);
              it.options.forEach((o, i) => { if (!isPair(o)) errs.push(`${it.id}: option ${i} must be {en, fa}`); else if (src && !appearsIn(o.en, src.text.en)) errs.push(`${it.id}: option "${o.en}" is not worded in source card ${it.source}`); });
            }
          } else errs.push(`${it.id}: type must be tap, tf or order`);
        } else errs.push(`${lid} item ${idx}: kind must be card or check`);
      });
    });
  });
  return errs;
}

if (process.argv[1] && /validate-book-v3\.mjs$/.test(process.argv[1])) {
  let failed = 0;
  for (const file of process.argv.slice(2)) {
    let b;
    try { b = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.log(`${file}: INVALID JSON: ${e.message}`); failed++; continue; }
    const errs = validateBook(b, []);
    const lessons = (b.circles || []).reduce((a, c) => a + (c.lessons || []).length, 0);
    const points = (b.circles || []).reduce((a, c) => a + (c.lessons || []).reduce((x, l) => x + (l.items || []).filter((i) => i.kind === 'card').length, 0), 0);
    if (errs.length) { failed++; console.log(`${file}: FAIL (${errs.length})\n  - ${errs.slice(0, 40).join('\n  - ')}${errs.length > 40 ? `\n  - ... ${errs.length - 40} more` : ''}`); }
    else console.log(`${file}: OK (${(b.circles || []).length} circles, ${lessons} lessons, ${points} points)`);
  }
  process.exit(failed ? 1 : 0);
}
