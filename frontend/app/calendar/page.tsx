'use client';

import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CropTimeline } from '@/components/dashboard/CropTimeline';
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface CalendarData {
    version: string;
    description?: string;
    crops: Record<string, any>;
}

export default function CalendarPage() {
    const { user, loading: authLoading, hasMounted } = useAuth();
    const [data, setData] = useState<CalendarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('All');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/v2/meta/calendar`);

                if (res.ok) {
                    const json = await res.json();

                    // Validate that we have crops data
                    if (!json.crops || Object.keys(json.crops).length === 0) {
                        throw new Error('No crop data available');
                    }

                    setData(json);
                    setError(null);
                } else {
                    throw new Error(`API returned ${res.status}`);
                }
            } catch (err: any) {
                console.error('Failed to fetch calendar data:', err);
                setError(err.message || 'Failed to load calendar data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const cropNames = data ? Object.keys(data.crops) : [];
    const filteredCrops = filter === 'All' ? cropNames : cropNames.filter(c => c === filter);

    if (!hasMounted) return null;

    // Authentication check
    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0b0a]">
                <Loader2 className="w-8 h-8 text-nature-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0b0a] text-white px-4 pt-16">
                    <CalendarIcon className="w-16 h-16 text-nature-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                    <p className="text-gray-400 mb-6 text-center">
                        Please sign in to access the crop calendar
                    </p>
                    <Link href="/dashboard">
                        <Button className="bg-nature-600 hover:bg-nature-500">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0b0a] text-white pb-20 relative pt-16">
                {/* Background Pattern */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0a] via-[#0f110f] to-[#0a0b0a]" />
                    <div
                        className="absolute inset-0 opacity-[0.015]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2382ae19' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '60px 60px'
                        }}
                    />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-nature-600/3 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <div className="relative z-10 py-8 border-b border-white/5">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="w-12 h-12 rounded-xl bg-nature-500/10 flex items-center justify-center border border-nature-500/20">
                                <CalendarIcon className="w-7 h-7 text-nature-400" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Crop Calendar</h1>
                                <p className="text-gray-400 mt-1">
                                    {data?.description || 'Plan your sowing and harvest schedules'}
                                </p>
                            </div>
                            {data && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-green-400 font-medium">Live Data</span>
                                </div>
                            )}
                        </div>

                        {/* Filters */}
                        {!loading && data && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <Filter className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                                <FilterButton active={filter === 'All'} onClick={() => setFilter('All')}>All Crops</FilterButton>
                                {cropNames.map(crop => (
                                    <FilterButton
                                        key={crop}
                                        active={filter === crop}
                                        onClick={() => setFilter(crop)}
                                    >
                                        {crop}
                                    </FilterButton>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-nature-500" />
                            <p>Loading seasonal data...</p>
                        </div>
                    ) : error || !data ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <CalendarIcon className="w-16 h-16 mb-4 opacity-30" />
                            <p className="text-lg mb-2">Calendar data unavailable</p>
                            <p className="text-sm text-gray-600 mb-2">{error || 'Could not fetch calendar data'}</p>
                            <p className="text-xs text-gray-700 mb-4">Ensure backend API is running on port 8000</p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-nature-600 hover:bg-nature-500"
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto">
                            {filteredCrops.map(crop => (
                                <CropTimeline
                                    key={crop}
                                    cropName={crop}
                                    data={data!.crops[crop]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

function FilterButton({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${active
                    ? "bg-nature-500 text-white shadow-lg shadow-nature-500/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
        >
            {children}
        </button>
    );
}
