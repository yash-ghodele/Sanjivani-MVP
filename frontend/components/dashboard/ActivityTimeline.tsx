'use client';

import { Calendar, TrendingUp, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';

interface ScanRecord {
    id: string;
    imageUrl: string;
    crop: string;
    disease: string;
    severity: string;
    confidence: number;
    timestamp: number;
    metadata?: {
        inference_time_ms?: number;
    };
}

interface ActivityTimelineProps {
    scans: ScanRecord[];
}

export function ActivityTimeline({ scans }: ActivityTimelineProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'high':
                return 'border-red-500 text-red-400';
            case 'moderate':
                return 'border-yellow-500 text-yellow-400';
            default:
                return 'border-nature-500 text-nature-400';
        }
    };

    const getRelativeTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    if (scans.length === 0) {
        return (
            <div className="text-center py-16">
                <Leaf className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 mb-2">No scan history yet</p>
                <p className="text-sm text-gray-600 mb-6">
                    Start your first scan to begin tracking your crops
                </p>
                <Link href="/scan">
                    <button className="px-6 py-3 rounded-xl bg-nature-600 hover:bg-nature-500 text-white font-semibold text-sm transition-all">
                        Start First Scan
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>

            <div className="relative space-y-6">
                {/* Timeline Line */}
                <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-nature-500/50 via-nature-500/20 to-transparent" />

                {scans.slice(0, 10).map((scan, index) => (
                    <div key={scan.id} className="relative flex gap-4 group">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 w-14 h-14 rounded-xl bg-black/50 border-2 ${getSeverityColor(scan.severity)} flex items-center justify-center flex-shrink-0`}>
                            {scan.imageUrl ? (
                                <img
                                    src={scan.imageUrl}
                                    alt="Scan"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            ) : (
                                <Leaf className="w-6 h-6" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-white text-base mb-1">
                                        {scan.disease}
                                    </h4>
                                    <p className="text-sm text-gray-400">{scan.crop}</p>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {getRelativeTime(scan.timestamp)}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {Math.round(scan.confidence * 100)}% confidence
                                </span>
                                {scan.metadata?.inference_time_ms && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {scan.metadata.inference_time_ms}ms
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
