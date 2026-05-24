/* Bethel Worship Center — Service Worker
   - Pre-caches the shell + key photos so first paint is instant on revisits
   - Cache-first for images (rarely change) + static assets
   - Network-first for HTML (always try fresh) with offline fallback */

const CACHE_VERSION = "bwc-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  "/assets/LogoSmallCircle.png",
  "/assets/bwc-logo.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  // Homepage hero photos — load instantly on revisit
  "/assets/photos/youth-choir.jpg",
  "/assets/photos/youth-night.jpg",
  "/assets/photos/youth-group.jpg",
  "/assets/photos/sunday-school.jpg",
  "/assets/photos/bible-study.jpg",
  "/assets/photos/placeholder.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML — always try fresh, fall back to cache when offline
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
    );
    return;
  }

  // Cache-first for images — they rarely change
  if (request.destination === "image" || /\.(jpg|jpeg|png|webp|avif|svg|gif)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Cache-first for everything else (CSS, JS, fonts)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
