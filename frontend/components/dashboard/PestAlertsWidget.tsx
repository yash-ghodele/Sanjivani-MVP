'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";

interface Alert {
    id: string;
    pest: string;
    crop: string;
    severity: 'Low' | 'Moderate' | 'High' | 'Critical';
    region: string;
    date: string;
    description: string;
}

export function PestAlertsWidget() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // Determine API URL with fallback
                const apiUrl = process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v2/alerts/pests`
                    : 'http://localhost:8000/api/v2/alerts/pests';

                const res = await fetch(apiUrl, { mode: 'cors' });

                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.alerts)) {
                        setAlerts(data.alerts);
                        return; // Exit if successful
                    }
                }
                throw new Error("Invalid response or failed fetch");
            } catch (error) {
                console.warn("Using offline/mock data for Pest Alerts:", error);
                // Fallback / Mock Data
                setAlerts([
                    {
                        id: "m1",
                        pest: "Fall Armyworm",
                        crop: "Maize",
                        severity: "High",
                        region: "North District",
                        date: new Date().toISOString().split('T')[0],
                        description: "High probability of infestation due to recent humidity levels. Immediate scouting recommended."
                    },
                    {
                        id: "m2",
                        pest: "Aphids",
                        crop: "Cotton",
                        severity: "Moderate",
                        region: "West Fields",
                        date: new Date().toISOString().split('T')[0],
                        description: "Small clusters observed. Monitor daily."
                    },
                    {
                        id: "m3",
                        pest: "Early Blight",
                        crop: "Tomato",
                        severity: "Low",
                        region: "Greenhouse A",
                        date: new Date().toISOString().split('T')[0],
                        description: "Preventive funcgicide application recommended."
                    }
                ]);
            }
        };
        fetchAlerts();
    }, []);

    // if (!alerts || alerts.length === 0) return null; // Removed to ensure widget visibility

    return (
        <>
            <div className="bg-nature-900/30 border border-nature-800 rounded-xl p-5 relative overflow-hidden group">
                {/* Visual Asset Decor */}
                <img
                    src="/assets/pest-alert.png"
                    alt=""
                    className="absolute right-[-20px] top-[-20px] w-32 h-32 opacity-15 object-contain pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
                />

                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" /> Pest Alerts
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] text-red-400 font-mono border border-red-500/20 animate-pulse-subtle">LIVE</span>
                </div>

                <div className="space-y-3 relative z-10">
                    {alerts.slice(0, 3).map(alert => (
                        <button
                            key={alert.id}
                            onClick={() => setSelectedAlert(alert)}
                            className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-nature-500/30 group"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-white group-hover:text-nature-400 transition-colors">{alert.pest}</span>
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                                    alert.severity === 'Critical' ? "bg-red-500/20 text-red-400" :
                                        alert.severity === 'High' ? "bg-orange-500/20 text-orange-400" :
                                            "bg-yellow-500/20 text-yellow-400"
                                )}>
                                    {alert.severity}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.region}</span>
                                <span className="bg-white/10 px-1 rounded">{alert.crop}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Dialog open={!!selectedAlert} onOpenChange={(open: boolean) => !open && setSelectedAlert(null)}>
                <DialogContent className="bg-dark-900 border-nature-800 text-white" aria-describedby="alert-description">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" /> Pest Outbreak Alert
                        </DialogTitle>
                        <DialogDescription id="alert-description" className="text-gray-400">
                            Urgent advisory for your region.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAlert && (
                        <div className="space-y-4">
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xl font-bold text-white">{selectedAlert.pest}</h4>
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {selectedAlert.severity} PRIORITY
                                    </span>
                                </div>
                                <p className="text-red-200 text-sm mb-2">Affecting: <b>{selectedAlert.crop}</b> in {selectedAlert.region}</p>
                                <p className="text-sm text-gray-300 bg-black/20 p-2 rounded">
                                    date: {selectedAlert.date}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h5 className="font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-nature-400" /> Advisory
                                </h5>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {selectedAlert.description}
                                </p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => setSelectedAlert(null)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
