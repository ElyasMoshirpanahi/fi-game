import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBook } from '../scripts/validate-book-v3.mjs';

// Every v3 book file obeys the content rules (sizing, framing, Check cadence, fairness, parity).
const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, '..', 'content', 'books', 'v3');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^b\d\d\.json$/.test(f)).sort() : [];
const base = path.join(here, '..', 'content', 'books');
const expected = fs.readdirSync(base).filter((f) => /^b\d\d\.json$/.test(f)).length;

describe('v3 book files', () => {
  it(`all ${expected} books have a v3 file`, () => {
    expect(files.length).toBe(expected);
  });

  for (const f of files) {
    it(`${f} passes the validator`, () => {
      const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const errs = validateBook(b, []);
      expect(errs, errs.join('\n')).toEqual([]);
      const old = JSON.parse(fs.readFileSync(path.join(base, f), 'utf8'));
      expect(b.title).toBe(old.title);
      expect(b.why).toEqual(old.why);
      expect(b.must).toBe(old.must);
    });
  }
});
