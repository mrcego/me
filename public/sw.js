const CACHE_NAME = 'cesar-gomez-portfolio-v9';
const IS_LOCALHOST = ['localhost', '127.0.0.1', '[::1]'].includes(self.location.hostname);
const urlsToCache = [
  '/img/logo-final.svg?v=cg3',
  '/img/me.jpg',
  '/img/og-image.png?v=cg3',
  '/favicon.ico?v=cg3',
];

const isNavigationRequest = (request) =>
  request.mode === 'navigate' ||
  (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

/** Only http(s) GET — skip chrome-extension:, blob:, etc. (Cache.put rejects those schemes). */
const isCacheableRequest = (request) => {
  if (request.method !== 'GET') return false;
  try {
    const { protocol } = new URL(request.url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

/** Brand marks / favicons must not stick on stale cache-first entries after deploys. */
const isBrandAsset = (url) => {
  try {
    const { pathname } = new URL(url);
    return (
      pathname === '/favicon.ico' ||
      pathname === '/favicon.svg' ||
      pathname.startsWith('/favicon-') ||
      pathname === '/apple-touch-icon.png' ||
      pathname === '/img/logo-final.svg' ||
      pathname === '/img/logo-mark.svg' ||
      pathname === '/img/logo-mark.png' ||
      pathname === '/img/og-image.png'
    );
  } catch {
    return false;
  }
};

const matchOrNetworkError = (request) =>
  caches.match(request).then((cached) => cached || Response.error());

const putInCache = (request, response) => {
  if (!isCacheableRequest(request)) return;
  const copy = response.clone();
  void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {
    // Ignore quota / scheme errors — never reject the fetch handler.
  });
};

// Install event - cache static assets only (not HTML — hashes change each deploy)
self.addEventListener('install', (event) => {
  if (IS_LOCALHOST) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch(() => {
            // Ignore missing optional offline asset during pre-cache
          }),
        ),
      );
    }),
  );
  self.skipWaiting();
});

// Fetch event - network-first for pages + brand assets; cache-first for other static
self.addEventListener('fetch', (event) => {
  if (IS_LOCALHOST) return;
  // Let the browser handle non-http(s) / non-GET (extensions, WebSocket upgrades, etc.).
  if (!isCacheableRequest(event.request)) return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isBrandAsset(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            putInCache(event.request, response);
          }
          return response;
        })
        .catch(() => matchOrNetworkError(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request.clone())
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          putInCache(event.request, networkResponse);
          return networkResponse;
        })
        .catch(() => matchOrNetworkError(event.request));
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  if (IS_LOCALHOST) {
    event.waitUntil(
      Promise.all([
        self.registration.unregister(),
        caches.keys().then((cacheNames) =>
          Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))),
        ),
      ]),
    );
    return;
  }

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});
