// Content generation (ADR-0010): validates content/books/v3/bNN.json and writes the
// small BOOKS_MANIFEST (every Section, Circle and Lesson with titles and counts, no
// items) into index.html between the MANIFEST:START and MANIFEST:END markers. The
// Lessons' items stay in the JSON files and load on demand.
// Usage: node scripts/build-manifest.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBook } from './validate-book-v3.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'content', 'books', 'v3');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^b\d\d\.json$/.test(f)).sort() : [];
let failed = 0;
const manifest = [];
for (const f of files) {
  const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const errs = validateBook(b, []);
  if (errs.length) { failed++; console.log(`${f}: FAIL\n  - ${errs.slice(0, 20).join('\n  - ')}`); continue; }
  manifest.push({
    id: b.id, title: b.title, author: b.author, year: b.year, edition: b.edition, stage: b.stage, must: b.must, why: b.why, badge: b.badge, tier: b.tier,
    circles: b.circles.map((c) => ({ id: c.id, title: c.title, lessons: c.lessons.map((l) => ({ id: l.id, title: l.title, points: l.items.filter((i) => i.kind === 'card').length, checks: l.items.filter((i) => i.kind === 'check').length, minutes: l.minutes || l.items.filter((i) => i.kind === 'card').length })) })),
  });
}
if (failed) { console.error(`${failed} file(s) failed validation; index.html untouched`); process.exit(1); }
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const start = html.indexOf('  // MANIFEST:START');
const end = html.indexOf('  // MANIFEST:END');
if (start < 0 || end < 0) { console.error('markers not found'); process.exit(1); }
const json = JSON.stringify(manifest).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/<\/script/gi, '<\\/script');
const out = html.slice(0, start) + '  // MANIFEST:START\n  const BOOKS_MANIFEST = ' + json + ';\n' + html.slice(end);
fs.writeFileSync(indexPath, out);
const lessons = manifest.reduce((a, b) => a + b.circles.reduce((x, c) => x + c.lessons.length, 0), 0);
const points = manifest.reduce((a, b) => a + b.circles.reduce((x, c) => x + c.lessons.reduce((y, l) => y + l.points, 0), 0), 0);
console.log(`manifest: ${manifest.length} books, ${lessons} lessons, ${points} points; index.html ${Buffer.byteLength(out, 'utf8')} bytes`);
