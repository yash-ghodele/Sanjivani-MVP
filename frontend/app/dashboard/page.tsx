'use client';

import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SprayingWidget } from "@/components/dashboard/SprayingWidget";
import { PestAlertsWidget } from "@/components/dashboard/PestAlertsWidget";
import { Button } from "@/components/ui/button";
import { SupportedCrops } from "@/components/SupportedCrops";
import {
    Leaf, CalendarDays, ArrowRight, ScanLine, BarChart3, Database, ShieldCheck, Users, Activity, TrendingUp, AlertCircle, Clock
} from "lucide-react";
import Link from "next/link";
// In a real app, we would fetch weather data here or pass it down

import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const { user, loading, hasMounted } = useAuth();
    const [stats, setStats] = useState<any>(null);

    // Default role - can be extended with Firebase custom claims later
    const role = 'farmer' as 'farmer' | 'admin' | 'sender' | 'receiver';

    useEffect(() => {
        if (role === 'admin') {
            const fetchStats = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                    const [perfRes, healthRes] = await Promise.all([
                        fetch(`${apiUrl}/api/v2/model/performance`),
                        fetch(`${apiUrl}/api/v2/health`)
                    ]);
                    if (perfRes.ok && healthRes.ok) {
                        const pData = await perfRes.json();
                        const hData = await healthRes.json();
                        setStats({ performance: pData, health: hData });
                    }
                } catch (e) {
                    console.error("Failed to fetch admin stats", e);
                }
            };
            fetchStats();
        }
    }, [role]);

    if (!hasMounted) return null;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-nature-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Welcome Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 uppercase tracking-widest border border-white/5">
                                {role} Dashboard
                            </span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white">
                            Namaste, {user?.displayName?.split(' ')[0] || 'Farmer'}
                        </h1>
                        <p className="text-white/60 mt-1">Here is your {role === 'farmer' ? 'farm' : 'system'} summary.</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-nature-800 border border-nature-600 overflow-hidden">
                        {user?.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : role === 'farmer' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src="/assets/farmer-icon.jpg" alt="Farmer" className="w-full h-full object-cover" />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src="/assets/farmer-avatar.avif" alt="User" className="w-full h-full object-cover" />
                        )}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* --- FARMER VIEW --- */}
                    {role === 'farmer' && (
                        <>
                            <div className="animate-slide-up animate-delay-100">
                                <WeatherWidget />
                            </div>

                            <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-nature-900/60 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-nature-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <div className="w-10 h-10 rounded-full bg-nature-500/20 flex items-center justify-center mb-4">
                                        <ScanLine className="w-5 h-5 text-nature-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Diagnose Crop</h3>
                                    <p className="text-sm text-white/70 mt-1">Detect diseases instantly with AI.</p>
                                </div>
                                <Link href="/scan" className="mt-6">
                                    <Button className="w-full bg-nature-600 hover:bg-nature-500 text-white font-bold h-12 rounded-xl group-hover:scale-[1.02] transition-transform">
                                        Start Scan <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="animate-slide-up animate-delay-200">
                                <SprayingWidget windSpeed={12} humidity={45} isRaining={false} />
                            </div>

                            <div className="animate-slide-up animate-delay-300">
                                <PestAlertsWidget />
                            </div>

                            <div className="lg:col-span-3 glass-card p-8 rounded-3xl mt-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-nature-400" />
                                        Upcoming Tasks
                                    </h3>
                                    <Button variant="ghost" className="text-nature-400 hover:text-nature-300">View All</Button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: "Fertilize Tomato Patch", date: "Today, 4:00 PM", status: "urgent" },
                                        { title: "Irrigation Schedule", date: "Tomorrow, 6:00 AM", status: "pending" },
                                    ].map((task, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-10 rounded-full ${task.status === 'urgent' ? 'bg-nature-500' : 'bg-gray-600'}`} />
                                                <div>
                                                    <h4 className="font-bold text-white">{task.title}</h4>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wide">{task.date}</p>
                                                </div>
                                            </div>
                                            {task.status === 'urgent' && (
                                                <span className="px-3 py-1 rounded-full bg-nature-500/20 text-nature-400 text-xs font-bold border border-nature-500/30">DO NOW</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Scan History Card */}
                            <Link href="/history" className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-blue-900/30 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                                        <Clock className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Scan History</h3>
                                    <p className="text-sm text-white/70 mt-1">View past diagnoses and trends.</p>
                                </div>
                                <div className="mt-4 text-sm text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                    View History →
                                </div>
                            </Link>

                            {/* Data Sovereignty Card */}
                            <div className="lg:col-span-3 glass-card p-6 rounded-3xl mt-2 border border-nature-500/20 bg-nature-900/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Data Sovereignty</h3>
                                        <p className="text-sm text-white/70">Your farm data belongs to you. Export your scan history anytime.</p>
                                    </div>
                                    <Button
                                        onClick={async () => {
                                            try {
                                                // Dynamic import to avoid SSR issues with IndexedDB
                                                const { getOfflineScans } = await import("@/lib/db");
                                                const { downloadCSV } = await import("@/lib/export");

                                                // Import type for safety (casted)
                                                // Note: In a real app we'd import the type at top level,
                                                // but to keep 'use client' clean without side-effects we use 'any' with care or explicit mapping.
                                                const scans = await getOfflineScans();

                                                if (scans.length > 0) {
                                                    const csvData = scans.map((s: any) => ({
                                                        id: s.id,
                                                        timestamp: new Date(s.timestamp).toISOString(),
                                                        status: 'offline_pending',
                                                        image_size: s.imageBlob.size
                                                    }));
                                                    downloadCSV(csvData, `cropguard_data_${new Date().toISOString().split('T')[0]}.csv`);
                                                } else {
                                                    // Mock data if no real scans
                                                    downloadCSV([
                                                        { id: 'mock_1', timestamp: new Date().toISOString(), disease: 'Early Blight', confidence: 0.95 },
                                                        { id: 'mock_2', timestamp: new Date(Date.now() - 86400000).toISOString(), disease: 'Healthy', confidence: 0.99 }
                                                    ], `cropguard_sample_data.csv`);
                                                }
                                            } catch (e) {
                                                console.error("Export failed", e);
                                            }
                                        }}
                                        variant="outline"
                                        className="border-nature-500 text-nature-400 hover:bg-nature-500 hover:text-white"
                                    >
                                        Download CSV
                                    </Button>
                                </div>
                            </div>

                            {/* Supported Crops Registry */}
                            <div className="lg:col-span-3 mt-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                    <Leaf className="w-5 h-5 text-nature-400" />
                                    Supported Crops
                                </h3>
                                <SupportedCrops />
                            </div>
                        </>
                    )}

                    {/* --- ADMIN VIEW --- */}
                    {role === 'admin' && (
                        <>
                            <div className="glass-card p-6 rounded-3xl">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-nature-400" />
                                    System Health
                                </h3>
                                <div className="flex items-center gap-2 text-nature-400 mb-4">
                                    <span className={`w-3 h-3 rounded-full ${stats?.health?.status === 'healthy' ? 'bg-nature-500 animate-pulse' : 'bg-yellow-500'}`} />
                                    {stats?.health?.status?.toUpperCase() || 'INITIALIZING...'}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>API Latency</span>
                                        <span>{stats?.performance?.avg_inference_ms ? `${stats.performance.avg_inference_ms.toFixed(1)}ms` : '45ms'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Total Inferences</span>
                                        <span>{stats?.performance?.total_inferences || '1,234'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Model Loaded</span>
                                        <span className={stats?.health?.model_loaded ? 'text-nature-400' : 'text-red-400'}>
                                            {stats?.health?.model_loaded ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Knowledge base</span>
                                        <span>v{stats?.health?.knowledge_version || 'unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-3xl">
                                <h3 className="text-lg font-bold text-white mb-4">Pending Approvals</h3>
                                <div className="text-4xl font-bold text-white mb-1">12</div>
                                <p className="text-gray-400 mt-2 text-sm">&quot;The best fertilizer is the farmer&apos;s shadow.&quot;</p>
                            </div>

                            <div className="glass-card p-6 rounded-3xl">
                                <h3 className="text-lg font-bold text-white mb-4">Total Scans Today</h3>
                                <div className="text-4xl font-bold text-white mb-1">843</div>
                                <p className="text-green-400 text-sm flex items-center gap-1">↑ 12% vs yesterday</p>
                            </div>
                        </>
                    )}

                    {/* --- SENDER / RECEIVER VIEW --- */}
                    {(role === 'sender' || role === 'receiver') && (
                        <div className="lg:col-span-3 glass-card p-8 rounded-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">Active Shipments ({role === 'sender' ? 'Outbound' : 'Inbound'})</h3>
                                <Button>New Shipment</Button>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-white">Order #{1000 + i} - Tomatoes (500kg)</div>
                                            <div className="text-sm text-gray-400">Status: In Transit • ETA: 2 hours</div>
                                        </div>
                                        <Button variant="outline" size="sm">Track</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
