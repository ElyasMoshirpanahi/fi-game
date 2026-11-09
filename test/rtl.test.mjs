import { describe, it, expect } from 'vitest';
import { loadModules } from './load.mjs';

// Regression for the Prompt 0 play-test bug: in FA mode, Latin runs with
// parentheses were split into several isolates and re-ordered at a line wrap.
const { render } = loadModules(['content', 'engine', 'render']);

const bdis = (html) => [...html.matchAll(/<bdi[^>]*>(.*?)<\/bdi>/g)].map((m) => m[1]);

describe('RTL: Latin runs inside Farsi text stay one isolate', () => {
  it('keeps "(VWCE / IWDA)" as one <bdi> including its parentheses', () => {
    const out = render.faHtml('ETF شاخصی (VWCE / IWDA)، اوراق');
    expect(bdis(out)).toEqual(['ETF', '(VWCE / IWDA)']);
  });

  it('keeps a book title and its author as one <bdi>', () => {
    const out = render.faHtml('منبع: A Random Walk Down Wall Street (Malkiel).');
    expect(bdis(out)).toEqual(['A Random Walk Down Wall Street (Malkiel)']);
  });

  it('does not swallow Farsi words or Persian punctuation into a run', () => {
    const out = render.faHtml('Box 3 هلند و DCF، unit economics');
    expect(bdis(out)).toEqual(['Box 3', 'DCF', 'unit economics']);
  });

  it('escapes HTML before wrapping', () => {
    const out = render.faHtml('<b>VWCE</b>');
    expect(out).not.toContain('<b>');
    expect(out).toContain('&lt;');
  });
});
