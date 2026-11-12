import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Spec 9 (issue #26): calm type. Read from the shipped page, as the browser does.
const here = path.dirname(fileURLToPath(import.meta.url));
const page = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');
const css = page.slice(page.indexOf('<style>'), page.indexOf('</style>'));
const rule = (selector) => { const at = css.indexOf(`\n${selector} {`); return at < 0 ? '' : css.slice(at, css.indexOf('}', at)); };

describe('Softer type', () => {
  it('draws no heading with a split shadow or a glitch', () => {
    expect(rule('.path h1')).not.toMatch(/text-shadow/);
    expect(rule('.result h2')).not.toMatch(/text-shadow|split/);
    expect(css).not.toMatch(/@keyframes split/);
  });

  it('uses a smooth display face, requested from the one allowed host', () => {
    expect(css).toMatch(/--hud-font: 'Plus Jakarta Sans'/);
    expect(page).toMatch(/fonts\.googleapis\.com\/css2\?family=Plus\+Jakarta\+Sans/);
    expect(page).not.toMatch(/Chakra/);
  });

  it('asks for no weight above bold', () => {
    expect(css).not.toMatch(/font-weight: [89]00/);
    expect(page).not.toMatch(/wght@[^&"]*800/);
  });

  it('writes labels in sentence case and lays no scanlines over the text', () => {
    expect(css).not.toMatch(/text-transform: uppercase/);
    expect(css).not.toMatch(/body::after/);
  });

  it('keeps wide letter spacing off everything', () => {
    const wide = [...css.matchAll(/letter-spacing: (\.\d+)em/g)].map((m) => +m[1]).filter((n) => n > 0.04);
    expect(wide).toEqual([]);
  });
});
