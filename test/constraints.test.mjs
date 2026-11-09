import { describe, it, expect } from 'vitest';
import { readIndex } from './load.mjs';

const html = readIndex();

describe('ADR-0001: one self-contained index.html', () => {
  it('loads no external scripts', () => {
    const srcs = [...html.matchAll(/<script[^>]*\ssrc=/gi)];
    expect(srcs).toHaveLength(0);
  });

  it('requests nothing external except Google Fonts', () => {
    const urls = [...html.matchAll(/https?:\/\/[^\s"'<>)]+/gi)].map((m) => m[0]);
    const allowed = (u) => u.startsWith('https://fonts.googleapis.com') || u.startsWith('https://fonts.gstatic.com');
    // Citations inside the content block are text, not requests; they appear only inside `cite:` strings.
    const requests = urls.filter((u) => !allowed(u) && !html.includes(`cite: '${u}'`));
    expect(requests).toEqual([]);
  });

  it('stays under 400 KB (ADR-0001 amendment, owner decision 19)', () => {
    expect(Buffer.byteLength(html, 'utf8')).toBeLessThan(400 * 1024);
  });

  it('keeps the Disclaimer in both languages in the ui strings', () => {
    expect(html).toContain('آموزشی است، نه توصیه خرید');
    expect(html).toContain('Educational, not investment advice');
  });
});
