// Content generation, not an app build step: reads content/books/*.json (owner
// decision 18), validates them, and writes them as one compact array into
// index.html between the BOOKS:START and BOOKS:END markers. index.html stays
// the only source the page needs (ADR-0001).
// Usage: node scripts/build-books.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'content', 'books');
const files = fs.readdirSync(dir).filter((f) => /^b\d\d\.json$/.test(f)).sort().map((f) => path.join(dir, f));
if (!files.length) { console.error('no book files'); process.exit(1); }

const v = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-book.mjs'), ...files], { encoding: 'utf8' });
process.stdout.write(v.stdout);
if (v.status !== 0) { console.error('validation failed, index.html untouched'); process.exit(1); }

const books = files.map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
const ids = new Set();
for (const b of books) { if (ids.has(b.id)) { console.error(`duplicate id ${b.id}`); process.exit(1); } ids.add(b.id); }

const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const start = html.indexOf('  // BOOKS:START');
const end = html.indexOf('  // BOOKS:END');
if (start < 0 || end < 0) { console.error('markers not found'); process.exit(1); }
// JSON is valid JS. Escape U+2028/2029 and "</script" so the inline script stays intact.
const json = JSON.stringify(books).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/<\/script/gi, '<\\/script');
const out = html.slice(0, start) + '  // BOOKS:START\n  const BOOKS = ' + json + ';\n' + html.slice(end);
fs.writeFileSync(indexPath, out);
console.log(`wrote ${books.length} Book Units into index.html (${Buffer.byteLength(out, 'utf8')} bytes total)`);
