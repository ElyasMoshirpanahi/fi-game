import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Advice lint: flags Cards that read as personalised investment advice (a named product or
// broker plus an instruction to the player). Pattern-level only; accuracy needs a human or
// agent read (docs/review/accuracy-audit.md). Added after the Lessons review found such Cards.
const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, '..', 'content', 'books', 'v3');
const files = fs.readdirSync(dir).filter((f) => /^b\d\d\.json$/.test(f)).sort();

const PRODUCT = /\b(VWCE|IWDA|VTSAX|VTI|VOO|S&P 500 fund|DEGIRO|Interactive Brokers)\b/;
const INSTRUCT = /\b(buy|sell|hold|keep buying|put|invest|move|allocate|choose|pick)\b[^.]{0,40}\b(your|you)\b|\b(you|your)\b[^.]{0,40}\b(should|must|need to)\b[^.]{0,30}\b(buy|sell|hold|invest|allocate)\b|\bnever sell\b|\bkeep buying\b/i;

export function adviceHits(book) {
  const hits = [];
  for (const c of book.circles) for (const l of c.lessons) for (const it of l.items) {
    if (it.kind !== 'card') continue;
    const en = it.text.en;
    if (PRODUCT.test(en) && INSTRUCT.test(en)) hits.push(`${it.id}: ${en}`);
  }
  return hits;
}

describe('advice lint', () => {
  for (const f of files) {
    it(`${f}: no Card pairs a named product or broker with an instruction to the player`, () => {
      const hits = adviceHits(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
      expect(hits, hits.join('\n')).toEqual([]);
    });
  }
});
