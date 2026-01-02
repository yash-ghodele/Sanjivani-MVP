"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/service-worker.js")
                    .then((registration) => {
                        console.log("✅ Service Worker registered", registration.scope);
                    })
                    .catch((err) => {
                        console.log("❌ Service Worker registration failed", err);
                    });
            });
        }
    }, []);

    return null;
}
