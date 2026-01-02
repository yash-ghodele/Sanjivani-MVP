const CACHE_NAME = 'sanjivani-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/globe.svg',
    '/file.svg',
    '/window.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🧹 clearing old cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. API Calls (Prediction) -> Network First, then Offline Error
    // We do NOT cache predictions blindly as they are dynamic images
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/predict')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Return a custom offline JSON if network fails
                    return new Response(JSON.stringify({
                        error: "OFFLINE",
                        message: "You are offline. Please check connection."
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }

    // 2. Next.js Static Assets (_next/static) -> Cache First
    if (url.pathname.startsWith('/_next/static') || STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
        return;
    }

    // 3. Default -> Stale While Revalidate (Navigation)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});
