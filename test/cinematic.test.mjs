import { describe, it, expect } from 'vitest';
import { readIndex } from './load.mjs';

// Prompt 4: exactly three camera moments, each under 800 ms, transforms and filters only, off under reduced motion.
const html = readIndex();
const css = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));

const durationOf = (selector) => {
  const m = css.match(new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{[^}]*animation:\\s*[a-z-]+\\s+([\\d.]+)s'));
  return m ? parseFloat(m[1]) * 1000 : null;
};

describe('Cinematic moments', () => {
  it('wide-to-close on load, pull-out on Station completion, dolly on the Milestone: each under 800 ms', () => {
    for (const sel of ['.path.intro .sec:first-child .nodes', '.path.pullout .sec:has(.justlit) .nodes', '.overlay.dolly .panel', '.dolly-bg']) {
      const ms = durationOf(sel);
      expect(ms, sel).not.toBeNull();
      expect(ms, sel).toBeLessThan(800);
    }
  });

  it('camera keyframes use transform, opacity, filter or background only (no layout properties)', () => {
    const frames = [...css.matchAll(/@keyframes cam-[a-z]+\s*\{([\s\S]*?)\}\s*\}/g)].map((m) => m[1]);
    expect(frames.length).toBeGreaterThanOrEqual(5);
    for (const f of frames) {
      const props = [...f.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      for (const p of props) expect(['transform', 'opacity', 'filter', 'background'], f).toContain(p);
    }
  });

  it('every animation is switched off under prefers-reduced-motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none !important/);
  });
});
