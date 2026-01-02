'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ScanLine, Calendar, TrendingUp, Download, Leaf, Clock, ArrowRight, Activity, Shield } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SprayingWidget } from "@/components/dashboard/SprayingWidget";
import { DashboardBackground } from "@/components/ui/DashboardBackground";

interface ScanRecord {
    id: string;
    imageUrl: string;
    crop: string;
    disease: string;
    severity: string;
    confidence: number;
    timestamp: number;
    metadata: {
        inference_time_ms: number;
        model_version: string;
    };
}

export default function Dashboard() {
    const { user, loading, hasMounted } = useAuth();
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const role = 'farmer' as 'farmer' | 'admin' | 'expert' | 'dealer';

    useEffect(() => {
        loadScanHistory();
    }, []);

    const loadScanHistory = () => {
        try {
            const history = localStorage.getItem('scan_history');
            if (history) {
                const parsed = JSON.parse(history);
                const normalized = parsed.map((scan: ScanRecord) => ({
                    ...scan,
                    confidence: scan.confidence > 1 ? scan.confidence / 100 : scan.confidence
                }));
                setScans(normalized.sort((a: ScanRecord, b: ScanRecord) => b.timestamp - a.timestamp));
            }
        } catch (error) {
            console.error('Failed to load scan history:', error);
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify(scans, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sanjivani_scan_history_${Date.now()}.json`;
        link.click();
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'high':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'moderate':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            default:
                return 'text-nature-400 bg-nature-500/10 border-nature-500/30';
        }
    };

    if (!hasMounted) return null;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0f110f]">
                <Loader2 className="w-8 h-8 text-nature-500 animate-spin" />
            </div>
        );
    }

    const recentScans = scans.slice(0, 5);
    const criticalScans = scans.filter(s => s.severity.toLowerCase() === 'critical' || s.severity.toLowerCase() === 'high').length;
    const farmStatus = criticalScans > 0 ? 'needs attention' : 'healthy';

    return (
        <div className="min-h-screen bg-[#0f110f] relative">
            <DashboardBackground />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                {/* Hero Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-nature-500/10 text-nature-400 uppercase tracking-wider border border-nature-500/20">
                            {role} Dashboard
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        Namaste, {user?.displayName?.split(' ')[0] || 'Farmer'}! 🙏
                    </h1>
                    <p className="text-xl text-gray-400">
                        Your farm is <span className={`font-semibold ${farmStatus === 'healthy' ? 'text-nature-400' : 'text-yellow-400'}`}>{farmStatus}</span>
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-nature-500/10 flex items-center justify-center">
                                <ScanLine className="w-5 h-5 text-nature-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-bold text-white">{scans.length}</div>
                                <div className="text-xs text-gray-400">Total Scans</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-bold text-red-400">{criticalScans}</div>
                                <div className="text-xs text-gray-400">Alerts</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-bold text-blue-400">
                                    {scans.length > 0 ? Math.round(scans.reduce((acc, s) => acc + s.confidence, 0) / scans.length * 100) : 0}%
                                </div>
                                <div className="text-xs text-gray-400">Accuracy</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-nature-500/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-nature-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-bold text-nature-400">
                                    {scans.length - criticalScans}
                                </div>
                                <div className="text-xs text-gray-400">Healthy</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary CTA - Start Scan */}
                <Link href="/scan">
                    <div className="mb-8 glass-card p-8 rounded-3xl border border-nature-500/20 bg-gradient-to-br from-nature-900/40 to-transparent hover:border-nature-500/40 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white mb-2">Check Your Crops Now</h2>
                                <p className="text-gray-400">AI diagnosis in under 3 seconds • Works offline</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-nature-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ScanLine className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Farm Overview Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <WeatherWidget />
                    <SprayingWidget />
                </div>

                {/* Recent Scan History */}
                <div className="glass-card p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-bold text-white">Recent Scans</h3>
                        {scans.length > 0 && (
                            <Button
                                onClick={exportData}
                                variant="ghost"
                                className="text-nature-400 hover:text-nature-300 text-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </Button>
                        )}
                    </div>

                    {recentScans.length === 0 ? (
                        <div className="text-center py-12">
                            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                            <p className="text-gray-400 mb-2">No scans yet</p>
                            <p className="text-sm text-gray-500 mb-4">Start your first scan to begin monitoring your crops</p>
                            <Link href="/scan">
                                <Button className="bg-nature-600 hover:bg-nature-500">
                                    Start First Scan
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentScans.map((scan) => (
                                <div
                                    key={scan.id}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nature-500/30 transition-all"
                                >
                                    <div className="flex gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-nature-950/50 flex-shrink-0">
                                            {scan.imageUrl ? (
                                                <img
                                                    src={scan.imageUrl}
                                                    alt="Scan"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Leaf className="w-6 h-6 text-nature-500/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div>
                                                    <h4 className="font-bold text-white text-sm truncate">{scan.disease}</h4>
                                                    <p className="text-xs text-gray-400">{scan.crop}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityColor(scan.severity)}`}>
                                                    {scan.severity}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(scan.timestamp).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    {Math.round(scan.confidence * 100)}%
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {scan.metadata?.inference_time_ms || 0}ms
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
