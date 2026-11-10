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
// Bump a cache name only when its entries become unusable; `activate` deletes every other "fi-" cache.
const SHELL_CACHE = 'fi-shell-v1';
const BOOK_CACHE = 'fi-books-v3';
const SHELL = ['./', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const BOOK_PATH = /\/content\/books\/v3\/b\d\d\.json$/;

// What to do with a request. Pure: the same inputs always give the same answer.
//   'page'  network first, then the cache        'book'  cache first, refresh in the background
//   'asset' cache first, then the network        'pass'  not ours: let the browser handle it
function strategyFor(method, url, scope, mode) {
  if (method !== 'GET') return 'pass';
  const u = new URL(url), s = new URL(scope);
  if (u.origin !== s.origin || !u.pathname.startsWith(s.pathname)) return 'pass';
  if (BOOK_PATH.test(u.pathname)) return 'book';
  const rest = u.pathname.slice(s.pathname.length);
  if (mode === 'navigate' || rest === '' || rest === 'index.html' || rest === 'manifest.webmanifest') return 'page';
  if (SHELL.includes(rest)) return 'asset';
  return 'pass';
}

// Only inside a real service worker; the test loads this file for `strategyFor` alone.
if (typeof self !== 'undefined' && self.registration && typeof caches !== 'undefined') {
  const scope = self.registration.scope;
  // A page URL with any query string is the same page.
  const pageKey = (request) => (new URL(request.url).pathname.slice(new URL(scope).pathname.length).replace(/^index\.html$/, '') === '' ? scope : request);
  const keep = async (cacheName, key, response) => {
    if (response && response.ok) { const cache = await caches.open(cacheName); await cache.put(key, response.clone()); }
    return response;
  };
  const offline = () => new Response('offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain' } });

  self.addEventListener('install', (event) => {
    // One missing icon must not stop the page from being cached, so each entry is added on its own.
    event.waitUntil(caches.open(SHELL_CACHE).then((cache) => Promise.all(SHELL.map((path) => cache.add(path).catch(() => null)))).then(() => self.skipWaiting()));
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys()
      .then((names) => Promise.all(names.filter((n) => n.startsWith('fi-') && n !== SHELL_CACHE && n !== BOOK_CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()));
  });

  self.addEventListener('fetch', (event) => {
    const request = event.request;
    const strategy = strategyFor(request.method, request.url, scope, request.mode);
    if (strategy === 'pass') return;
    if (strategy === 'page') {
      const key = pageKey(request);
      event.respondWith(fetch(request).then((response) => keep(SHELL_CACHE, key, response))
        .catch(() => caches.match(key, { ignoreSearch: true }).then((hit) => hit || offline())));
      return;
    }
    const cacheName = strategy === 'book' ? BOOK_CACHE : SHELL_CACHE;
    event.respondWith(caches.open(cacheName).then((cache) => cache.match(request, { ignoreSearch: true }).then((hit) => {
      if (hit && strategy === 'asset') return hit;
      const fresh = fetch(request).then((response) => keep(cacheName, new URL(request.url).pathname, response));
      if (!hit) return fresh.catch(offline);
      event.waitUntil(fresh.catch(() => null)); // a book: refresh quietly; the player already has the cached copy
      return hit;
    })));
  });
}
