// Test seam (ADR-0008): extract the DOM-free script blocks from index.html and
// evaluate them in node. No DOM, no bundler. The HTML file is the only source.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const INDEX = path.join(here, '..', 'index.html');

export function readIndex() {
  return fs.readFileSync(INDEX, 'utf8');
}

export function loadModules(names = ['content', 'engine', 'store']) {
  const html = readIndex();
  const blocks = names.map((name) => {
    const re = new RegExp(`<script data-module="${name}">([\\s\\S]*?)</script>`);
    const m = html.match(re);
    if (!m) throw new Error(`index.html has no <script data-module="${name}"> block`);
    return m[1];
  });
  const factory = new Function(`const FI = {};\n${blocks.join('\n')}\nreturn FI;`);
  return factory();
}
