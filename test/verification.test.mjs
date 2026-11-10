import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBook } from '../scripts/validate-book-v3.mjs';
import { loadModules } from './load.mjs';

// Spec 6 (issue #13): every Card with a specific figure or a quotation was checked against a source
// that can be cited, and every book names the edition its Lessons follow.
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const listed = json('docs/verification/listed.json');
// 'own': the figure is the roadmap's or the game's own (the player's €40k, the 25 times target, plain arithmetic),
// not a claim about the book, so there is nothing to source.
const VERDICTS = ['verified', 'corrected', 'softened', 'paraphrase', 'own'];
const bookIds = Object.keys(listed);

describe('Edition', () => {
  it('the validator requires it', () => {
    const b = json('content/books/v3/b04.json');
    delete b.edition;
    expect(validateBook(b, []).join('\n')).toMatch(/edition must be \{en, fa\}/);
  });

  it('the open book Section shows it', () => {
    globalThis.document = { documentElement: { lang: '', dir: '' } };
    globalThis.CSS = { escape: (x) => x };
    const FI = loadModules(['content', 'engine', 'store', 'render']);
    const node = { innerHTML: '', querySelector: () => null };
    FI.render.handleUi({ type: 'UI_OPEN_SECTION', value: 'sec-b04' });
    FI.render.render(node, FI.engine.initial(), FI.content);
    FI.render.handleUi({ type: 'UI_OPEN_SECTION', value: 'sec-b04' });
    const edition = FI.content.sectionOf('b04').edition;
    expect(edition && edition.en).toBeTruthy();
    expect(node.innerHTML).toContain('class="edition"');
    expect(node.innerHTML).toContain(edition.en.replace(/&/g, '&amp;'));
  });
});

describe('Verification record', () => {
  it('covers all 28 books', () => {
    expect(bookIds).toHaveLength(28);
  });

  for (const id of bookIds) {
    describe(id, () => {
      let record, book, cards;
      beforeAll(() => {
        record = json(`docs/verification/${id}.json`);
        book = json(`content/books/v3/${id}.json`);
        cards = new Set(book.circles.flatMap((c) => c.lessons.flatMap((l) => l.items)).map((i) => i.id));
      });

      it('names the edition, and the book file carries it', () => {
        expect(record.book).toBe(id);
        expect(record.edition && record.edition.text).toBeTruthy();
        expect(book.edition.en.trim()).toBeTruthy();
        expect(book.edition.fa.trim()).toBeTruthy();
      });

      it('has a row for every listed Card, each about an item that exists', () => {
        const rows = new Map(record.rows.map((r) => [r.id, r]));
        for (const cardId of listed[id]) expect(rows.has(cardId), `${cardId} has no row`).toBe(true);
        for (const r of record.rows) expect(cards.has(r.id), `${r.id} is not in the book`).toBe(true);
      });

      it('every row has a verdict; a verified or corrected row cites a source that was opened', () => {
        for (const r of record.rows) {
          expect(VERDICTS, `${r.id}: ${r.verdict}`).toContain(r.verdict);
          expect(typeof r.claim === 'string' && r.claim.length > 0, `${r.id}: claim`).toBe(true);
          if (r.verdict === 'verified' || r.verdict === 'corrected') expect(r.source, `${r.id}: source`).toMatch(/^https:\/\/[^\s]+\.[^\s]+/);
          else expect(r.source === null || /^https:\/\//.test(r.source), `${r.id}: source`).toBe(true);
        }
      });
    });
  }
});
