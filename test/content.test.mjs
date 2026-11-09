import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

const { content } = loadModules(['content']);

const pairs = (item) => {
  const out = [];
  if (item.text) out.push(['text', item.text]);
  if (item.prompt) out.push(['prompt', item.prompt]);
  (item.options || []).forEach((o, i) => out.push([`option ${i}`, o]));
  return out;
};

describe('Language Mode: every string exists in both fa and en', () => {
  it('every ui key in fa exists in en and vice versa', () => {
    const fa = Object.keys(content.ui.fa).sort();
    const en = Object.keys(content.ui.en).sort();
    expect(fa).toEqual(en);
    for (const k of en) {
      expect(content.ui.en[k], `ui.en.${k}`).toBeTruthy();
      expect(content.ui.fa[k], `ui.fa.${k}`).toBeTruthy();
    }
  });

  it('every Card and Check carries non-empty fa and en text, prompt and options', () => {
    for (const st of content.stations) {
      expect(st.name.en, `${st.id} name.en`).toBeTruthy();
      expect(st.name.fa, `${st.id} name.fa`).toBeTruthy();
      for (const item of st.items) {
        for (const [what, pair] of pairs(item)) {
          expect(pair.en, `${st.id}/${item.id} ${what}.en`).toBeTruthy();
          expect(pair.fa, `${st.id}/${item.id} ${what}.fa`).toBeTruthy();
        }
      }
    }
  });
});
