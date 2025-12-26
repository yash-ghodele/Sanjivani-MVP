/**
 * PWA Service Worker Registration
 * Registers the service worker and handles lifecycle events
 */

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js', {
                    scope: '/'
                });

                console.log('✅ Service Worker registered:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available
                                console.log('🔄 New version available! Please refresh.');

                                // Notify user (can be replaced with a toast/snackbar)
                                if (confirm('New version available! Reload to update?')) {
                                    window.location.reload();
                                }
                            }
                        });
                    }
                });

                // Handle messages from service worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    console.log('[SW] Message from service worker:', event.data);

                    if (event.data.type === 'SYNC_STATUS') {
                        // Dispatch custom event for sync status
                        window.dispatchEvent(new CustomEvent('sync-status', {
                            detail: event.data.status
                        }));
                    }
                });

            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        });
    } else {
        console.warn('⚠️ Service Workers not supported in this browser');
    }
}

export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
                console.log('Service Worker unregistered');
            })
            .catch((error) => {
                console.error('Service Worker unregistration failed:', error);
            });
    }
}

// Check if app is running as PWA
export function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
}

// Request notification permission (for future features)
export async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        return permission === 'granted';
    }
    return false;
}
