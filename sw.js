/* Bethel Worship Center — Service Worker
   - Pre-caches the shell + key photos so first paint is instant on revisits
   - Cache-first for images (rarely change) + static assets
   - Network-first for HTML (always try fresh) with offline fallback */

const CACHE_VERSION = "bwc-v11-home-intro";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const SITE_ROOT = new URL(".", self.location.href);
const localUrl = (path) => new URL(path.replace(/^\//, ""), SITE_ROOT).href;

const PRECACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js?v=10",
  "/manifest.json",
  "/assets/LogoSmallCircle.png",
  "/assets/bwc-logo.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/welcome.css?v=11",
  "/assets/images/gathering-640.webp",
  "/assets/images/gathering-1400.webp",
].map(localUrl);

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
          if (!response.ok) return response;
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(localUrl("index.html"))))
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
        }).catch(() => cached || Response.error());
      })
    );
    return;
  }

  // Stale-while-revalidate for everything else (CSS, JS, fonts):
  // serve cached version instantly for fast paint, refresh in background
  // so the next load sees the new file.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached || Response.error());
      return cached || networkFetch;
    })
  );
});
