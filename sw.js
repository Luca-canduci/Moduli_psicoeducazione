// Service Worker PWA - Luca Canduci Psicologo (v4 Stabile)
const CACHE_NAME = 'spazio-clinico-canduci-v4';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .catch(() => {})
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    // Non intercettare richieste non-GET o chiamate API esterne (es. Supabase Auth/REST)
    if (req.method !== 'GET') return;
    let url;
    try {
        url = new URL(req.url);
    } catch (e) {
        return;
    }
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(req)
            .then((networkRes) => {
                if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
                    const copy = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
                }
                return networkRes;
            })
            .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html') || Response.error()))
    );
});
