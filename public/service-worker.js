// Service Worker for SANJIVANI PWA
// Provides offline support and caching

const CACHE_NAME = 'sanjivani-v2.0.0';
const API_CACHE = 'sanjivani-api-v2';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== API_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests differently
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(request));
    } else {
        event.respondWith(cacheFirstStrategy(request));
    }
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        console.log('[SW] Serving from cache:', request.url);
        return cached;
    }

    try {
        const response = await fetch(request);

        // Cache successful responses
        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);

        // Return offline page if available
        return cache.match('/offline.html') || new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network-first strategy (for API requests)
async function networkFirstStrategy(request) {
    const cache = await caches.open(API_CACHE);

    try {
        const response = await fetch(request);

        // Cache successful API responses
        if (response.ok && request.method === 'GET') {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        const cached = await cache.match(request);
        if (cached) {
            console.log('[SW] Serving API from cache');
            return cached;
        }

        throw error;
    }
}

// Background sync for queued scans
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-scans') {
        console.log('[SW] Background sync triggered');
        event.waitUntil(syncQueuedScans());
    }
});

// Sync queued scans when online
async function syncQueuedScans() {
    // This will be implemented in the IndexedDB queue system
    console.log('[SW] Syncing queued scans...');

    // Send message to all clients that sync is happening
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'SYNC_STATUS',
            status: 'syncing'
        });
    });
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || 'New update available',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: data
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'SANJIVANI', options)
    );
});

console.log('[SW] Service Worker loaded');
