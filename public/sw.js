const CACHE_NAME = 'cesar-gomez-portfolio-v5';
const IS_LOCALHOST = ['localhost', '127.0.0.1', '[::1]'].includes(self.location.hostname);
const urlsToCache = [
  '/img/logo-final.svg?v=cg1',
  '/_ipx/f_webp&q_85&fit_cover&s_224x280/img/me.jpg',
  '/img/og-image.png',
  '/favicon.ico?v=cg1',
];

const isNavigationRequest = (request) =>
  request.mode === 'navigate' ||
  (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

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

// Install event - cache static assets only (not HTML — hashes change each deploy)
self.addEventListener('install', (event) => {
  if (IS_LOCALHOST) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

// Fetch event - network-first for pages + brand assets; cache-first for other static
self.addEventListener('fetch', (event) => {
  if (IS_LOCALHOST) return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isBrandAsset(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => caches.match(event.request));
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
