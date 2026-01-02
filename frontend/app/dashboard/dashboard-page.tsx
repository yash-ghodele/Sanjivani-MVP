'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useWeather } from "@/hooks/useWeather";
import { Loader2, Droplets, CloudRain } from "lucide-react";

// New Components
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TodaysPriorityBanner } from "@/components/dashboard/TodaysPriorityBanner";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SprayingWidget } from "@/components/dashboard/SprayingWidget";

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

export default function Dashboard() {
    const { user, loading, hasMounted } = useAuth();
    const [scans, setScans] = useState<ScanRecord[]>([]);

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

    const calculateStats = () => {
        const totalScans = scans.length;
        const criticalScans = scans.filter(s =>
            s.severity.toLowerCase() === 'critical' || s.severity.toLowerCase() === 'high'
        ).length;
        return { totalScans, alerts: criticalScans };
    };

    const generateTodaysTasks = () => {
        const tasks = [];
        const stats = calculateStats();

        // Check for critical scans
        if (stats.alerts > 0) {
            tasks.push({
                priority: 'critical' as const,
                text: `${stats.alerts} crop${stats.alerts > 1 ? 's need' : ' needs'} immediate attention`,
                icon: <CloudRain className="w-7 h-7" />
            });
        }

        // Weather-based task (you can fetch real weather data here)
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour <= 10) {
            tasks.push({
                priority: 'medium' as const,
                text: 'Good morning hours for farm inspection',
                icon: <Droplets className="w-7 h-7" />
            });
        }

        // Month-based task
        const currentMonth = new Date().getMonth();
        if (currentMonth >= 5 && currentMonth <= 7) { // June-August
            tasks.push({
                priority: 'medium' as const,
                text: 'Monsoon season - Monitor for fungal diseases'
            });
        }

        return tasks;
    };

    if (!hasMounted) return null;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0b0a]">
                <Loader2 className="w-8 h-8 text-nature-500 animate-spin" />
            </div>
        );
    }


    const { weather, loading: weatherLoading, error: weatherError, refetch: refetchWeather } = useWeather();
    const stats = calculateStats();
    const todaysTasks = generateTodaysTasks();

    return (
        <div className="flex min-h-screen bg-[#0f110f]">
            {/* Sidebar */}
            <DashboardSidebar
                userName={user?.displayName?.split(' ')[0] || 'Farmer'}
                totalScans={stats.totalScans}
                alerts={stats.alerts}
                onExport={exportData}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 left-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f110f] via-[#0a0b0a] to-[#0f110f]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-nature-600/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto p-8 space-y-6">
                    {/* Today's Priority */}
                    <TodaysPriorityBanner tasks={todaysTasks} />

                    {/* Weather & Spraying Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <WeatherWidget
                            weather={weather}
                            loading={weatherLoading}
                            error={weatherError}
                            onRetry={refetchWeather}
                        />
                        <SprayingWidget
                            windSpeed={weather?.wind_speed || 0}
                            humidity={weather?.humidity || 0}
                            isRaining={weather?.description?.toLowerCase().includes('rain') || false}
                            isLoading={weatherLoading}
                        />
                    </div>

                    {/* Activity Timeline */}
                    <ActivityTimeline scans={scans} />
                </div>
            </main>
        </div>
    );
}
