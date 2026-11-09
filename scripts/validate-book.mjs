// Validate a Book Unit JSON file against the content rules used by the tests.
// Usage: node scripts/validate-book.mjs content/books/b01.json [more files]
import fs from 'node:fs';

const tokens = (s) => s.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9€%]+/).filter((t) => t.length >= 4 || /^\d+$/.test(t));
const appearsIn = (needle, hay) => { const h = tokens(hay); return tokens(needle).every((t) => h.some((x) => x.startsWith(t.slice(0, 4)))); };
const sentences = (s) => (s.match(/[.!?](\s|$)/g) || []).length;
const isPair = (p) => p && typeof p.en === 'string' && p.en.trim() && typeof p.fa === 'string' && p.fa.trim();

let failed = 0;
for (const file of process.argv.slice(2)) {
  const errs = [];
  let b;
  try { b = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.log(`${file}: INVALID JSON: ${e.message}`); failed++; continue; }
  if (!/^b\d\d$/.test(b.id || '')) errs.push('id must look like b01');
  if (!b.title) errs.push('title missing');
  if (!isPair(b.author)) errs.push('author must be {en, fa}');
  if (!isPair(b.why)) errs.push('why must be {en, fa}');
  if (!isPair(b.badge)) errs.push('badge must be {en, fa}');
  if (!Number.isInteger(b.year)) errs.push('year must be an integer');
  if (![1, 2, 3, 5, 6].includes(b.stage)) errs.push('stage must be 1, 2, 3, 5 or 6');
  if (typeof b.must !== 'boolean') errs.push('must must be boolean');
  const items = b.items || [];
  const cards = items.filter((i) => i.kind === 'card');
  const checks = items.filter((i) => i.kind === 'check');
  if (cards.length < 4 || cards.length > 6) errs.push(`need 4 to 6 cards, got ${cards.length}`);
  if (checks.length < 3 || checks.length > 4) errs.push(`need 3 to 4 checks, got ${checks.length}`);
  const ids = new Set();
  items.forEach((it, idx) => {
    if (!it.id || !it.id.startsWith(b.id)) errs.push(`${it.id}: id must start with ${b.id}`);
    if (ids.has(it.id)) errs.push(`${it.id}: duplicate id`); ids.add(it.id);
    if (it.kind === 'card') {
      if (!isPair(it.text)) errs.push(`${it.id}: text must be {en, fa}`);
      else {
        if (sentences(it.text.en) > 2) errs.push(`${it.id}: en text has ${sentences(it.text.en)} sentences, max 2`);
        if (it.text.en.length > 220) errs.push(`${it.id}: en text ${it.text.en.length} chars, max 220`);
      }
      if (!it.source) errs.push(`${it.id}: source (chapter or idea reference) missing`);
    } else if (it.kind === 'check') {
      if (!isPair(it.prompt)) errs.push(`${it.id}: prompt must be {en, fa}`);
      const srcIdx = items.findIndex((i) => i.id === it.source && i.kind === 'card');
      if (srcIdx < 0) errs.push(`${it.id}: source card ${it.source} not found`);
      else if (srcIdx > idx) errs.push(`${it.id}: source card ${it.source} must come BEFORE the check`);
      const src = items[srcIdx];
      if (it.type === 'tap') {
        if (!Array.isArray(it.options) || it.options.length < 3) errs.push(`${it.id}: tap needs 3+ options`);
        else {
          it.options.forEach((o, i) => { if (!isPair(o)) errs.push(`${it.id}: option ${i} must be {en, fa}`); });
          if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer >= it.options.length) errs.push(`${it.id}: answer must be an option index`);
          else if (src && isPair(it.options[it.answer]) && !appearsIn(it.options[it.answer].en, src.text.en)) errs.push(`${it.id}: correct option "${it.options[it.answer].en}" is not worded in source card ${it.source} (every 4+ letter word must appear there)`);
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
    } else errs.push(`item ${idx}: kind must be card or check`);
  });
  if (errs.length) { failed++; console.log(`${file}: FAIL\n  - ${errs.join('\n  - ')}`); }
  else console.log(`${file}: OK (${cards.length} cards, ${checks.length} checks)`);
}
process.exit(failed ? 1 : 0);
