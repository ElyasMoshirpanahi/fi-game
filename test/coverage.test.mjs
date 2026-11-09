import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules, readIndex } from './load.mjs';

// Prompt 5, item 1: all source content is present in both languages with no additions
// beyond the owner-approved ones. The source is content/financial_independence_roadmap_clean.html.
const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', 'content', 'financial_independence_roadmap_clean.html'), 'utf8');
const html = readIndex();
const { content } = loadModules(['content']);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').trim();

describe('Source coverage', () => {
  const rows = [...src.matchAll(/<tr><td>([⭐○])<\/td><td class="ltr">(.*?)<\/td><td class="ltr">(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)]
    .map((m) => ({ mark: m[1], title: decode(m[2]), author: decode(m[3]), why: decode(m[4]) }));

  it('the source has 28 library rows', () => {
    expect(rows).toHaveLength(28);
  });

  it('every book title, author surname and Farsi "why" line from the source appears in a Book Unit', () => {
    const books = content.stations.filter((b) => b.book);
    expect(books).toHaveLength(28);
    for (const r of rows) {
      const coreTitle = r.title.replace(/\s*\(.*?\)\s*/g, ' ').trim();
      const norm = (x) => x.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const words = norm(coreTitle).split(' ');
      const b = books.find((x) => words.every((w) => norm(x.title).split(' ').includes(w)));
      expect(b, `book for "${r.title}"`).toBeTruthy();
      expect(b.why.fa, `${r.title} why.fa`).toBe(r.why);
      expect(b.must, `${r.title} must`).toBe(r.mark === '⭐');
      const surname = r.author.replace(/&amp;/g, '&').split(/\s*&\s*|\s+/).filter((w) => /^[A-Z]/.test(w)).pop();
      expect(b.author.en, `${r.title} author`).toContain(surname);
    }
  });

  it('the ten-book reading order matches the source order', () => {
    const at = src.indexOf('<ol class="reading-order">');
    const ol = src.slice(at, src.indexOf('</ol>', at));
    const titles = [...ol.matchAll(/<span class="ltr">(.*?)<\/span>/g)].map((m) => decode(m[1]));
    expect(titles).toHaveLength(10);
    const ours = content.readingOrder.map((id) => content.station(id).title.replace(/\s*\(.*?\)\s*/g, ' ').trim());
    titles.forEach((t, i) => expect(ours[i].toLowerCase(), `reading order ${i + 1}`).toBe(t.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()));
  });

  it('both checklists and the five habits are present verbatim in Farsi', () => {
    const items = [...src.matchAll(/<ul class="checklist">([\s\S]*?)<\/ul>/g)].flatMap((m) => [...m[1].matchAll(/<li>(.*?)<\/li>/g)].map((x) => decode(x[1])));
    expect(items).toHaveLength(6);
    const ours = content.checklists.flatMap((l) => l.items.map((i) => i.fa));
    items.forEach((it, i) => expect(ours[i].replace(/\s+/g, ' ')).toBe(it.replace(/\s+/g, ' ')));
    expect(content.habits).toHaveLength(5);
  });

  it('the key numbers and names of the source appear in the Station Cards (fa)', () => {
    const fa = content.stations.filter((s) => !s.book).flatMap((s) => s.items.filter((i) => i.kind === 'card').map((i) => i.text.fa)).join('\n');
    for (const needle of ['۴۰ هزار یورو', '۵–۸٪', '۲۵ برابر', '۶۰۰ هزار تا ۱ میلیون', 'VWCE / IWDA', 'core-satellite', '۸۰٪', 'Box 3', 'Interactive Brokers', 'DEGIRO', 'فارکس، سیگنال، ترید روزانه، لوریج', '۱ ساعت در روز', 'دفتر تصمیم', 'هر ۳ ماه', 'FOMO', 'cap table + vesting', '۷۰٪ ETF جهانی / ۱۵٪ طلا / ۱۵٪ نقد', 'اولین ۱۰۰ یورو', 'ماهی ۲ کتاب', 'Damodaran', 'Venture Deals', 'The Mom Test', 'YC Startup School', 'belastingdienst', 'ind.nl']) {
      expect(fa + html, needle).toContain(needle);
    }
  });

  it('every Card not from the source is marked as an addition with a citation', () => {
    for (const st of content.stations.filter((s) => !s.book)) {
      for (const c of st.items.filter((i) => i.kind === 'card')) {
        if (c.addition) expect(c.cite, `${st.id}/${c.id} cite`).toBeTruthy();
        else expect(/section|library|reading order/.test(c.source), `${st.id}/${c.id} source`).toBe(true);
      }
    }
  });
});
