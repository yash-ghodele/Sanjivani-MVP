'use client';

import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SprayingWidget } from "@/components/dashboard/SprayingWidget";
import { Button } from "@/components/ui/button";
import { ScanLine, Leaf, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
// In a real app, we would fetch weather data here or pass it down

export default function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Welcome Header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Namaste, Farmer</h1>
                    <p className="text-gray-400 mt-1">Here is your farm's daily summary.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-nature-800 border border-nature-600 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="User" />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Weather Card */}
                <WeatherWidget />

                {/* Action Card: Scan */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-nature-900/60 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-nature-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                        <div className="w-10 h-10 rounded-full bg-nature-500/20 flex items-center justify-center mb-4">
                            <ScanLine className="w-5 h-5 text-nature-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Diagnose Crop</h3>
                        <p className="text-sm text-gray-400 mt-1">Detect diseases instantly with AI.</p>
                    </div>
                    <Link href="/scan" className="mt-6">
                        <Button className="w-full bg-nature-600 hover:bg-nature-500 text-white font-bold h-12 rounded-xl group-hover:scale-[1.02] transition-transform">
                            Start Scan <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Spraying Widget - Hardcoded for demo until we link state properly */}
                <SprayingWidget windSpeed={12} humidity={45} isRaining={false} />

                {/* Recent Activity / Next Tasks */}
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

            </div>
        </div>
    );
}
