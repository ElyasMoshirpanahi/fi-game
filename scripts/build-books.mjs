// Content generation, not an app build step: reads content/books/bNN.json (the
// book's essentials, split into Units 1 and 2) and content/books/bNN-apply.json
// (Unit 3, "Put it to work"), validates them, and writes one compact BOOKS array
// into index.html between the BOOKS:START and BOOKS:END markers (ADR-0009).
// index.html stays the only source the page needs (ADR-0001).
// Usage: node scripts/build-books.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'content', 'books');
const baseFiles = fs.readdirSync(dir).filter((f) => /^b\d\d\.json$/.test(f)).sort().map((f) => path.join(dir, f));
const applyFiles = fs.readdirSync(dir).filter((f) => /^b\d\d-apply\.json$/.test(f)).sort().map((f) => path.join(dir, f));
if (!baseFiles.length) { console.error('no book files'); process.exit(1); }

const v = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-book.mjs'), ...baseFiles, ...applyFiles], { encoding: 'utf8' });
process.stdout.write(v.stdout);
if (v.status !== 0) { console.error('validation failed, index.html untouched'); process.exit(1); }

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const applyById = new Map(applyFiles.map((f) => { const b = read(f); return [b.id, b]; }));

// Split a book's items into two Units. Each Check stays with its source Card
// (the fairness rule), so the Card split point is chosen to give both Units at
// least two Checks and otherwise as even a Card count as possible (decision 23).
function split(items) {
  const cards = items.filter((i) => i.kind === 'card');
  const checks = items.filter((i) => i.kind === 'check');
  const cut = (n) => {
    const firstIds = new Set(cards.slice(0, n).map((c) => c.id));
    const inFirst = (i) => (i.kind === 'card' ? firstIds.has(i.id) : firstIds.has(i.source));
    return [items.filter(inFirst), items.filter((i) => !inFirst(i))];
  };
  const half = Math.ceil(cards.length / 2);
  const candidates = [];
  for (let n = 1; n < cards.length; n++) {
    const [u1, u2] = cut(n);
    const k1 = u1.filter((i) => i.kind === 'check').length, k2 = u2.filter((i) => i.kind === 'check').length;
    candidates.push({ n, u1, u2, ok: k1 >= 2 && k2 >= 2, skew: Math.abs(k1 - k2), off: Math.abs(n - half) });
  }
  candidates.sort((a, b) => (b.ok - a.ok) || (a.skew - b.skew) || (a.off - b.off));
  const best = candidates[0];
  if (!best.ok) console.warn(`  warning: ${checks.length} Checks cannot give both Units two; best split has ${best.skew} skew`);
  return [best.u1, best.u2];
}

const books = [];
for (const f of baseFiles) {
  const b = read(f);
  const [u1, u2] = split(b.items);
  const apply = applyById.get(b.id);
  if (!apply) { console.error(`${b.id}: missing ${b.id}-apply.json`); process.exit(1); }
  for (const [n, items] of [[1, u1], [2, u2], [3, apply.items]]) {
    if (!items.some((i) => i.kind === 'check')) { console.error(`${b.id} unit ${n}: no Check, cannot draw a Fare`); process.exit(1); }
  }
  books.push({ id: b.id, title: b.title, author: b.author, year: b.year, stage: b.stage, must: b.must, why: b.why, badge: b.badge, units: [u1, u2, apply.items] });
}

const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const start = html.indexOf('  // BOOKS:START');
const end = html.indexOf('  // BOOKS:END');
if (start < 0 || end < 0) { console.error('markers not found'); process.exit(1); }
// JSON is valid JS. Escape U+2028/2029 and "</script" so the inline script stays intact.
const json = JSON.stringify(books).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/<\/script/gi, '<\\/script');
const out = html.slice(0, start) + '  // BOOKS:START\n  const BOOKS = ' + json + ';\n' + html.slice(end);
fs.writeFileSync(indexPath, out);
const units = books.length * 3;
console.log(`wrote ${books.length} books, ${units} Units into index.html (${Buffer.byteLength(out, 'utf8')} bytes total)`);
