// Service Worker PWA - Luca Canduci Psicologo
const CACHE_NAME = 'spazio-clinico-canduci-v3';
self.addEventListener('install', (event) => {
    self.skipWaiting();
});
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
