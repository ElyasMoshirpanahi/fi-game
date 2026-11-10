import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules, readIndex } from './load.mjs';
import { reducer } from './helpers.mjs';

// Spec 5 (issue #12): install and offline. The worker's routing is a pure function tested here;
// registration, caching and the offline run are checked in a headless browser.
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const swSource = read('sw.js');
const sw = new Function(`${swSource}\nreturn { strategyFor, cacheable, SHELL, SHELL_CACHE, BOOK_CACHE, RETIRED_CACHES };`)();
const SCOPE = 'https://example.github.io/fi-game/';
const route = (url, { method = 'GET', mode = 'cors' } = {}) => sw.strategyFor(method, url, SCOPE, mode);

describe('Service worker routing', () => {
  it('the page comes from the network first, whatever its query string, and so does the manifest', () => {
    expect(route(SCOPE, { mode: 'navigate' })).toBe('page');
    expect(route(`${SCOPE}index.html?v=3`)).toBe('page');
    expect(route(`${SCOPE}?utm=x`, { mode: 'navigate' })).toBe('page');
    expect(route(`${SCOPE}manifest.webmanifest`)).toBe('page');
  });

  it('a book file comes from the cache first', () => {
    expect(route(`${SCOPE}content/books/v3/b01.json`)).toBe('book');
    expect(route(`${SCOPE}content/books/v3/b28.json?t=1`)).toBe('book');
  });

  it('icons come from the cache first', () => {
    expect(route(`${SCOPE}icon.svg`)).toBe('asset');
    expect(route(`${SCOPE}icon-192.png`)).toBe('asset');
  });

  it('leaves everything else to the browser: other origins, other paths, writes, the old source files', () => {
    expect(route('https://fonts.googleapis.com/css2?family=Inter')).toBe('pass');
    expect(route('https://fonts.gstatic.com/s/inter/x.woff2')).toBe('pass');
    expect(route('https://example.github.io/other-site/')).toBe('pass');
    expect(route(`${SCOPE}content/books/b01.json`)).toBe('pass');
    expect(route(`${SCOPE}content/books/v3/evil.json`)).toBe('pass');
    expect(route(`${SCOPE}sw.js`)).toBe('pass');
    expect(route(SCOPE, { method: 'POST', mode: 'navigate' })).toBe('pass');
    expect(route(`${SCOPE}README.md`, { mode: 'navigate' })).toBe('pass');
    expect(route(`${SCOPE}docs/FINAL-REPORT.md`, { mode: 'navigate' })).toBe('pass');
  });

  it('works under a local server at the root too', () => {
    expect(sw.strategyFor('GET', 'http://localhost:8766/content/books/v3/b04.json', 'http://localhost:8766/', 'cors')).toBe('book');
    expect(sw.strategyFor('GET', 'http://localhost:8766/', 'http://localhost:8766/', 'navigate')).toBe('page');
  });
});

describe('What the worker may keep', () => {
  const json = { ok: true, redirected: false, type: 'basic', contentType: 'application/json' };
  it('a book only when it is a plain successful JSON answer', () => {
    expect(sw.cacheable('book', json)).toBe(true);
    expect(sw.cacheable('book', { ...json, contentType: 'text/html; charset=utf-8' })).toBe(false); // a captive portal answering for a book
    expect(sw.cacheable('book', { ...json, ok: false })).toBe(false);
    expect(sw.cacheable('book', { ...json, redirected: true })).toBe(false);
    expect(sw.cacheable('book', { ...json, type: 'opaque' })).toBe(false);
    expect(sw.cacheable('book', { ...json, contentType: null })).toBe(false);
    expect(sw.cacheable('book', null)).toBe(false);
  });
  it('the page and assets when the answer is plain and successful; never anything it does not serve', () => {
    expect(sw.cacheable('page', { ...json, contentType: 'text/html' })).toBe(true);
    expect(sw.cacheable('asset', { ...json, contentType: 'image/png' })).toBe(true);
    expect(sw.cacheable('page', { ...json, ok: false })).toBe(false);
    expect(sw.cacheable('page', { ...json, redirected: true })).toBe(false);
    expect(sw.cacheable('pass', json)).toBe(false);
  });
  it('deletes only caches it names itself: Cache Storage is shared with other sites on the origin', () => {
    expect(Array.isArray(sw.RETIRED_CACHES)).toBe(true);
    expect(swSource).not.toMatch(/startsWith\('fi-'\)/);
    expect(swSource).not.toMatch(/caches\.keys\(\)/);
  });
  it('a failed cache write cannot fail a response: every write is inside a try', () => {
    expect(swSource.match(/cache\.put\(/g)).toHaveLength(1);
    expect(swSource).toMatch(/try \{ const cache = await open\(name\); if \(cache\) await cache\.put\(key, response\); \} catch/);
  });
});

describe('The files beside the page (ADR-0001 amendment)', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  const page = readIndex();

  it('every file the worker caches at install exists', () => {
    for (const f of sw.SHELL.filter((x) => x !== './')) expect(fs.existsSync(path.join(root, f)), f).toBe(true);
  });

  it('the manifest names the game, starts in its own folder, stands alone, and its icons exist', () => {
    expect(manifest.name).toBe('FI Roadmap');
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.some((i) => i.sizes === '192x192')).toBe(true);
    expect(manifest.icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable')).toBe(true);
    for (const i of manifest.icons) expect(fs.existsSync(path.join(root, i.src)), i.src).toBe(true);
  });

  it('the page links the manifest and the icons, and registers the worker only where it can run', () => {
    expect(page).toContain('<link rel="manifest" href="manifest.webmanifest">');
    expect(page).toContain('<link rel="apple-touch-icon" href="apple-touch-icon.png">');
    expect(page).toMatch(/serviceWorker\.register\('sw\.js'\)/);
    expect(page).toMatch(/location\.protocol !== 'file:'/);
    // the panel is trusted only once a worker is registered
    expect(page).toMatch(/navigator\.serviceWorker\.ready\)\.then\(\(\) => \{ workerReady = true;/);
  });

  it('the page and the worker agree on the name of the book cache', () => {
    expect(page).toContain(`'${sw.BOOK_CACHE}'`);
  });

  it('none of the new files reaches another origin or pulls in a script', () => {
    for (const f of ['sw.js', 'manifest.webmanifest', 'icon.svg']) {
      const text = read(f).replace('http://www.w3.org/2000/svg', '');
      expect(text, f).not.toMatch(/https?:\/\//);
      expect(text, f).not.toMatch(/["'`(]\/\/[a-z0-9]/i); // a protocol-relative URL
      expect(text, f).not.toMatch(/importScripts|<script|\bimport\s*\(|\bimport\s+["'{*]/);
    }
  });
});

describe('Offline panel on the Path', () => {
  let FI, R, node;
  beforeAll(() => {
    globalThis.document = { documentElement: { lang: '', dir: '' } };
    globalThis.CSS = { escape: (x) => x };
    FI = loadModules(['content', 'engine', 'store', 'render']);
    R = reducer(FI.engine, FI.content);
    node = { innerHTML: '', querySelector: () => null };
  });
  const html = (s) => { FI.render.render(node, s, FI.content); return node.innerHTML; };

  it('says nothing where the browser cannot work offline', () => {
    FI.render.setOffline({ supported: false });
    expect(html(FI.engine.initial())).not.toContain('DOWNLOAD_BOOKS');
  });

  it('shows how many books are on the device and offers to download the rest', () => {
    FI.render.setOffline({ supported: true, ready: 3, downloading: null, failed: 0 });
    const h = html(FI.engine.initial());
    expect(h).toMatch(/Available offline: 3\/28 books/);
    expect(h).toMatch(/role="progressbar"[^>]*aria-valuemax="28"[^>]*aria-valuenow="3"/);
    expect(h).toContain('DOWNLOAD_BOOKS');
  });

  it('shows progress while downloading and disables the button', () => {
    FI.render.setOffline({ supported: true, ready: 3, downloading: 7 });
    const h = html(FI.engine.initial());
    expect(h).toMatch(/Downloading 7\/28/);
    expect(h).toMatch(/DOWNLOAD_BOOKS[^>]*disabled/);
  });

  it('says so when every book is on the device, and when some failed', () => {
    FI.render.setOffline({ supported: true, ready: 28, downloading: null, failed: 0 });
    expect(html(FI.engine.initial())).toContain('All books are on this device.');
    expect(html(FI.engine.initial())).not.toContain('DOWNLOAD_BOOKS');
    FI.render.setOffline({ supported: true, ready: 26, downloading: null, failed: 2 });
    expect(html(FI.engine.initial())).toMatch(/2 could not be downloaded/);
    FI.render.setOffline({ supported: true, ready: 20, downloading: null, failed: 0, unstored: 8 });
    expect(html(FI.engine.initial())).toMatch(/8 could not be stored/);
    expect(html(FI.engine.initial())).not.toMatch(/could not be downloaded/);
    FI.render.setOffline({ unstored: 0 });
  });

  it('offers Install only when the browser offered it', () => {
    FI.render.setOffline({ supported: true, ready: 0, failed: 0, installable: false });
    expect(html(FI.engine.initial())).not.toContain('"INSTALL"'.replace(/"/g, '&quot;'));
    expect(html(FI.engine.initial())).toContain('To install: open the browser menu'); // Safari and Firefox have no prompt
    FI.render.setOffline({ installable: true });
    expect(html(FI.engine.initial())).toContain('INSTALL');
    expect(html(FI.engine.initial())).not.toContain('To install: open the browser menu');
    FI.render.setOffline({ installable: false, standalone: true });
    expect(html(FI.engine.initial())).not.toContain('To install: open the browser menu'); // already installed
    FI.render.setOffline({ standalone: false });
    FI.render.setOffline({ supported: false, installable: false });
  });

  it('a book that cannot load with no connection says it is not on the device', () => {
    FI.render.setError('offline');
    expect(html(FI.engine.initial())).toContain('This book is not on this device yet.');
    FI.render.setError(true);
    expect(html(FI.engine.initial())).not.toContain('This book is not on this device yet.');
    FI.render.setError(false);
  });

  it('is in Farsi with Persian digits in FA mode', () => {
    FI.render.setOffline({ supported: true, ready: 3, downloading: null, failed: 0 });
    expect(html(R(FI.engine.initial(), { type: 'SET_MODE', value: 'FA' }))).toMatch(/۳\/۲۸/);
    FI.render.setOffline({ supported: false });
  });
});
