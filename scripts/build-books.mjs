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

// Split a book's items into two Units: the first half of the Cards (rounded up)
// with the Checks whose source Card is in that half, then the rest. Original order kept.
function split(items) {
  const cards = items.filter((i) => i.kind === 'card');
  const half = Math.ceil(cards.length / 2);
  const firstIds = new Set(cards.slice(0, half).map((c) => c.id));
  const inFirst = (i) => (i.kind === 'card' ? firstIds.has(i.id) : firstIds.has(i.source));
  return [items.filter(inFirst), items.filter((i) => !inFirst(i))];
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
  books.push({ id: b.id, title: b.title, author: b.author, year: b.year, stage: b.stage, must: b.must, why: b.why, badge: b.badge, badge3: apply.badge, units: [u1, u2, apply.items] });
}

const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const start = html.indexOf('  // BOOKS:START');
const end = html.indexOf('  // BOOKS:END');
if (start < 0 || end < 0) { console.error('markers not found'); process.exit(1); }
const json = JSON.stringify(books).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/<\/script/gi, '<\\/script');
const out = html.slice(0, start) + '  // BOOKS:START\n  const BOOKS = ' + json + ';\n' + html.slice(end);
fs.writeFileSync(indexPath, out);
const units = books.length * 3;
console.log(`wrote ${books.length} books, ${units} Units into index.html (${Buffer.byteLength(out, 'utf8')} bytes total)`);
