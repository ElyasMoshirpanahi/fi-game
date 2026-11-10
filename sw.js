// Service worker for the FI Roadmap game (spec 5, ADR-0001 amendment).
// It makes the page open with no connection and keeps every book that was opened once.
// Nothing here talks to another origin; requests to other origins are left to the browser.
//
// Two caches:
//   SHELL_CACHE  the page, the manifest and the icons. The page is fetched from the network first,
//                so a new version arrives on the next visit with a connection; the cached copy is the fallback.
//   BOOK_CACHE   book files. Served from the cache at once and refreshed in the background, so a book
//                opened once works offline and still picks up corrections. It is not tied to a page
//                version: a new deploy must not throw away books the player downloaded for a trip.
// Rule for every handler: the cache is a convenience. A failed cache read or write must never
// turn a response the network gave into an error.
const SHELL_CACHE = 'fi-shell-v1';
const BOOK_CACHE = 'fi-books-v3';
// Cache names this game used before and no longer needs. Only these are deleted on activation:
// Cache Storage is shared by every site on the same origin (all projects of one GitHub Pages user).
const RETIRED_CACHES = [];
const SHELL = ['./', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const BOOK_PATH = /\/content\/books\/v3\/b\d\d\.json$/;
// How long the page waits for the network before a cached copy is shown instead (a weak signal on a train).
const PAGE_TIMEOUT_MS = 3000;

// What to do with a request. Pure: the same inputs always give the same answer.
//   'page'  network first, then the cache        'book'  cache first, refresh in the background
//   'asset' cache first, then the network        'pass'  not ours: let the browser handle it
function strategyFor(method, url, scope) {
  if (method !== 'GET') return 'pass';
  const u = new URL(url), s = new URL(scope);
  if (u.origin !== s.origin || !u.pathname.startsWith(s.pathname)) return 'pass';
  if (BOOK_PATH.test(u.pathname)) return 'book';
  const rest = u.pathname.slice(s.pathname.length);
  if (rest === '' || rest === 'index.html' || rest === 'manifest.webmanifest') return 'page';
  if (SHELL.includes(rest)) return 'asset';
  return 'pass';
}

// May this response be kept? Pure. `r` is { ok, redirected, type, contentType }.
// A redirect, an error or an opaque response is never kept, and a book must be JSON
// (a captive portal or an error page answering for a book file must not count as the book).
function cacheable(strategy, r) {
  if (!r || !r.ok || r.redirected || r.type === 'opaque' || r.type === 'error') return false;
  if (strategy === 'book') return /json/i.test(r.contentType || '');
  return strategy === 'page' || strategy === 'asset';
}

// Only inside a real service worker; the test loads this file for the pure functions alone.
if (typeof self !== 'undefined' && self.registration && typeof caches !== 'undefined') {
  const scope = self.registration.scope;
  const facts = (response) => ({ ok: response.ok, redirected: response.redirected, type: response.type, contentType: response.headers.get('Content-Type') });
  // The page has one cache entry whatever its query string or file name; the manifest has its own.
  const shellKey = (request) => (/manifest\.webmanifest$/.test(new URL(request.url).pathname) ? new URL('manifest.webmanifest', scope).href : scope);
  const open = (name) => caches.open(name).catch(() => null);
  const read = async (name, key) => { try { const cache = await open(name); return cache ? await cache.match(key, { ignoreSearch: true }) : undefined; } catch (e) { return undefined; } };
  const write = async (name, key, strategy, response) => {
    if (!cacheable(strategy, facts(response))) return;
    try { const cache = await open(name); if (cache) await cache.put(key, response); } catch (e) { /* a full or blocked store: the response still reaches the page */ }
  };
  // Shown only when the page itself was never cached and there is no connection.
  const noPage = () => new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>FI Roadmap</title><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#06060c;color:#e8f0ff;font-family:system-ui,sans-serif;text-align:center"><div><p>No connection. Open the game once while online and it will work offline after that.</p><p dir="rtl" lang="fa">اتصال برقرار نیست. بازی را یک بار با اینترنت باز کن؛ بعد از آن بدون اینترنت هم کار می‌کند.</p></div>', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  const noFile = () => new Response('', { status: 503, statusText: 'Offline' });

  self.addEventListener('install', (event) => {
    // One missing icon must not stop the page from being cached, so each entry is added on its own.
    event.waitUntil(open(SHELL_CACHE).then((cache) => (cache ? Promise.all(SHELL.map((path) => cache.add(path).catch(() => null))) : null)).then(() => self.skipWaiting()));
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(Promise.all(RETIRED_CACHES.map((name) => caches.delete(name).catch(() => false))).then(() => self.clients.claim()));
  });

  // Network first. A slow or failing network falls back to the cached copy; with no copy the network is waited for.
  async function servePage(event, request) {
    const key = shellKey(request);
    const network = fetch(request).then((response) => { event.waitUntil(write(SHELL_CACHE, key, 'page', response.clone())); return response; });
    network.catch(() => null); // observed below; this only stops an "unhandled rejection" when the cached copy wins
    const slow = new Promise((resolve) => setTimeout(() => resolve(null), PAGE_TIMEOUT_MS));
    try {
      const first = await Promise.race([network, slow]);
      if (first && first.status < 500) return first;
      return (await read(SHELL_CACHE, key)) || first || await network;
    } catch (e) {
      return (await read(SHELL_CACHE, key)) || noPage();
    }
  }
  // Cache first. A book on the device is answered at once and refreshed behind the player's back;
  // a book not on the device is fetched, and kept before the page hears of it so its count is right.
  async function serveBook(event, request) {
    const key = new URL(request.url).pathname;
    const hit = await read(BOOK_CACHE, key);
    const network = fetch(request).then(async (response) => { await write(BOOK_CACHE, key, 'book', response.clone()); return response; });
    if (hit) { event.waitUntil(network.catch(() => null)); return hit; }
    try { return await network; } catch (e) { return noFile(); }
  }
  async function serveAsset(event, request) {
    const key = new URL(request.url).pathname;
    const hit = await read(SHELL_CACHE, key);
    if (hit) return hit;
    try { const response = await fetch(request); event.waitUntil(write(SHELL_CACHE, key, 'asset', response.clone())); return response; } catch (e) { return noFile(); }
  }

  self.addEventListener('fetch', (event) => {
    const strategy = strategyFor(event.request.method, event.request.url, scope);
    if (strategy === 'page') event.respondWith(servePage(event, event.request));
    else if (strategy === 'book') event.respondWith(serveBook(event, event.request));
    else if (strategy === 'asset') event.respondWith(serveAsset(event, event.request));
  });
}
