"use client";

import { useEffect, useState } from "react";
import { getOfflineScans, removeOfflineScan } from "@/lib/db";
import { analyzeCropImage } from "@/services/api";

export function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    // Check online status
    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            syncScans();
        };

        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Initial check for pending items
        checkPending();

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const checkPending = async () => {
        try {
            const scans = await getOfflineScans();
            setPendingCount(scans.length);
        } catch (e) {
            console.error("Failed to check offline scans", e);
        }
    };

    const syncScans = async () => {
        try {
            const scans = await getOfflineScans();
            if (scans.length === 0) return;

            setIsSyncing(true);
            console.log(`🔄 Syncing ${scans.length} offline scans...`);

            for (const scan of scans) {
                try {
                    // Re-upload the blob
                    // Note: In a real app, you might want to show a toast for each success
                    await analyzeCropImage(scan.imageBlob);
                    await removeOfflineScan(scan.id);
                } catch (err) {
                    console.error(`Failed to sync scan ${scan.id}`, err);
                    // Keep in DB if failed (maybe retry later)
                }
            }

            await checkPending();
        } finally {
            setIsSyncing(false);
        }
    };

    return { isOnline, pendingCount, isSyncing, checkPending };
}
