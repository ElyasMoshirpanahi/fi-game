import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

const { content } = loadModules(['content']);

// Tokens that carry meaning: 4+ characters or a number, lower-cased, punctuation stripped.
const tokens = (s) => s.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9€%]+/).filter((t) => t.length >= 4 || /^\d+$/.test(t));
const appearsIn = (needle, hay) => {
  const hayToks = tokens(hay);
  return tokens(needle).every((t) => hayToks.some((h) => h.startsWith(t.slice(0, 4))));
};

describe('Fairness rule: a failed Check is the player’s own fault', () => {
  for (const st of content.stations) {
    const checks = st.items.filter((i) => i.kind === 'check');
    for (const k of checks) {
      it(`${st.id}/${k.id}: its source Card appears earlier in the same Station`, () => {
        const idx = st.items.findIndex((i) => i.id === k.id);
        const srcIdx = st.items.findIndex((i) => i.id === k.source && i.kind === 'card');
        expect(srcIdx, `source Card ${k.source} exists`).toBeGreaterThanOrEqual(0);
        expect(srcIdx, `source Card ${k.source} precedes ${k.id}`).toBeLessThan(idx);
      });

      if (k.type === 'tap') {
        it(`${st.id}/${k.id}: the correct option is worded in its source Card (en)`, () => {
          const card = content.item(st.id, k.source);
          expect(appearsIn(k.options[k.answer].en, card.text.en)).toBe(true);
        });
      }
      if (k.type === 'order') {
        it(`${st.id}/${k.id}: every item to order is named in its source Card (en)`, () => {
          const card = content.item(st.id, k.source);
          for (const o of k.options) expect(appearsIn(o.en, card.text.en), o.en).toBe(true);
          expect(new Set(k.answer).size, 'answer is a permutation').toBe(k.options.length);
        });
      }
      if (k.type === 'tf') {
        it(`${st.id}/${k.id}: answer is a boolean`, () => {
          expect(typeof k.answer).toBe('boolean');
        });
      }
    }
  }

  it('every Station has at least fareSize Checks so a Fare can be drawn', () => {
    for (const st of content.stations) {
      expect(st.items.filter((i) => i.kind === 'check').length).toBeGreaterThanOrEqual(st.fareSize);
    }
  });
});
