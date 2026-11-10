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
const KINDS = ['figure', 'quote', 'other'];
// How the reader saw the evidence: on the author's or publisher's page, on a secondary page, in a copy of the book that is not
// linked (not an authorised source), or not at all.
const BASES = ['author-or-publisher', 'secondary', 'unlinked-copy', 'none'];
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
  it('covers all 28 books and the 458 Cards listed before the pass', () => {
    expect(bookIds).toHaveLength(28);
    expect(Object.values(listed).reduce((n, ids) => n + ids.length, 0)).toBe(458);
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

      it('has exactly one row for every listed Card, each about a Card that exists', () => {
        const ids = record.rows.map((r) => r.id);
        expect(new Set(ids).size, 'duplicate rows').toBe(ids.length);
        for (const cardId of listed[id]) expect(ids.includes(cardId), `${cardId} has no row`).toBe(true);
        for (const r of record.rows) expect(cards.has(r.id), `${r.id} is not a Card of the book`).toBe(true);
        for (const cardId of listed[id]) expect(cards.has(cardId), `listed ${cardId} is not a Card of the book`).toBe(true);
      });

      it('the record and the book name the same edition', () => {
        expect(record.edition.text).toBe(book.edition.en);
      });

      it('every row says what was claimed, what was found and how it can be re-checked', () => {
        for (const r of record.rows) {
          expect(VERDICTS, `${r.id}: ${r.verdict}`).toContain(r.verdict);
          expect(KINDS, `${r.id}: ${r.kind}`).toContain(r.kind);
          expect(typeof r.claim === 'string' && r.claim.trim().length > 0, `${r.id}: claim`).toBe(true);
          expect(typeof r.note === 'string' && r.note.trim().length > 0, `${r.id}: note`).toBe(true);
          expect(BASES, `${r.id}: basis ${r.basis}`).toContain(r.basis);
          const linked = typeof r.source === 'string' && /^https:\/\/[^\s]+\.[^\s]+/.test(r.source);
          const catalogue = linked && /openlibrary\.org\/search/.test(r.source);
          // The basis must agree with the link: no link, a catalogue entry standing in for a copy that is not linked, or a page that was opened.
          if (r.basis === 'none') expect(r.source, `${r.id}: source`).toBeNull();
          else if (r.basis === 'unlinked-copy') { expect(catalogue, `${r.id}: catalogue link`).toBe(true); expect(r.note, `${r.id}: note`).toMatch(/not an authorised source/); }
          else expect(linked && !catalogue, `${r.id}: a page that was opened`).toBe(true);
          // A claim is confirmed or corrected only on evidence the reader saw.
          if (r.verdict === 'verified' || r.verdict === 'corrected') expect(r.basis, `${r.id}: ${r.verdict} with no evidence`).not.toBe('none');
        }
      });
    });
  }
});
