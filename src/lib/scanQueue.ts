/**
 * Offline Scan Queue using IndexedDB
 * Stores scans when offline and syncs when connection is restored
 */

const DB_NAME = 'sanjivani-db';
const DB_VERSION = 1;
const STORE_NAME = 'scan-queue';

export interface QueuedScan {
    id: string;
    imageData: string; // Base64 encoded image
    timestamp: number;
    status: 'pending' | 'syncing' | 'synced' | 'failed';
    retries?: number;
}

class ScanQueue {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async addScan(imageData: string): Promise<string> {
        if (!this.db) await this.init();

        const scan: QueuedScan = {
            id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            imageData,
            timestamp: Date.now(),
            status: 'pending',
            retries: 0
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(scan);

            request.onsuccess = () => resolve(scan.id);
            request.onerror = () => reject(request.error);
        });
    }

    async getPendingScans(): Promise<QueuedScan[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('status');
            const request = index.getAll('pending');

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateScanStatus(id: string, status: QueuedScan['status']): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const scan = getRequest.result;
                if (scan) {
                    scan.status = status;
                    const updateRequest = store.put(scan);
                    updateRequest.onsuccess = () => resolve();
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    reject(new Error('Scan not found'));
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteScan(id: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getQueueCount(): Promise<number> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearSynced(): Promise<void> {
        if (!this.db) await this.init();

        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('status');
        const request = index.openCursor(IDBKeyRange.only('synced'));

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
    }
}

// Singleton instance
export const scanQueue = new ScanQueue();

// Auto-sync when online
if (typeof window !== 'undefined') {
    window.addEventListener('online', async () => {
        console.log('[Queue] Connection restored, syncing pending scans...');

        try {
            const pendingScans = await scanQueue.getPendingScans();
            console.log(`[Queue] Found ${pendingScans.length} pending scans`);

            for (const scan of pendingScans) {
                try {
                    await scanQueue.updateScanStatus(scan.id, 'syncing');

                    // Convert base64 to blob
                    const response = await fetch(scan.imageData);
                    const blob = await response.blob();
                    const formData = new FormData();
                    formData.append('file', blob, 'scan.jpg');

                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                    const apiRes = await fetch(`${API_URL}/api/v2/predict`, {
                        method: 'POST',
                        body: formData
                    });

                    if (apiRes.ok) {
                        await scanQueue.updateScanStatus(scan.id, 'synced');
                        console.log(`[Queue] Synced scan ${scan.id}`);

                        // Dispatch event for UI update
                        window.dispatchEvent(new CustomEvent('scan-synced', { detail: scan.id }));
                    } else {
                        throw new Error('API request failed');
                    }
                } catch (error) {
                    console.error(`[Queue] Failed to sync scan ${scan.id}:`, error);
                    await scanQueue.updateScanStatus(scan.id, 'failed');
                }
            }

            // Clean up synced scans after 24 hours
            setTimeout(() => scanQueue.clearSynced(), 24 * 60 * 60 * 1000);

        } catch (error) {
            console.error('[Queue] Sync error:', error);
        }
    });
}
