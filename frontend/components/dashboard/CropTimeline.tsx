'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Droplets, Sun, Sprout, Leaf } from 'lucide-react';

interface Stage {
    name: string;
    days: number;
    color: string;
}

interface SowingWindow {
    season: string;
    months: string[];
    color: string;
}

interface CropCalendarData {
    sowing_windows: SowingWindow[];
    duration_days: number;
    stages: Stage[];
}

interface Props {
    cropName: string;
    data: CropCalendarData;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CropTimeline({ cropName, data }: Props) {
    // Helper to map month name to index
    const getMonthIndex = (m: string) => {
        const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return fullMonths.findIndex(fm => fm === m) === -1 ? months.indexOf(m) : fullMonths.findIndex(fm => fm === m);
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6 relative overflow-hidden group hover:border-white/20 transition-all">
            {/* Gradient Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-nature-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-nature-500/10 flex items-center justify-center">
                        <Sprout className="w-6 h-6 text-nature-400" />
                    </div>
                    {cropName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                        <Calendar className="w-4 h-4" />
                        {data.duration_days} Days
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                        <Sun className="w-4 h-4" />
                        {data.sowing_windows.map(s => s.season).join(", ")}
                    </span>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="relative">
                {/* Month Headers */}
                <div className="grid grid-cols-12 gap-1 mb-3 text-center text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    {months.map(m => <div key={m}>{m}</div>)}
                </div>

                {/* Sowing Windows */}
                <div className="grid grid-cols-12 gap-1 h-10 mb-6 relative bg-black/30 rounded-xl overflow-hidden border border-white/5">
                    {months.map((m, i) => {
                        // Check if this month is in any sowing window
                        const window = data.sowing_windows.find(sw => {
                            const idxs = sw.months.map(getMonthIndex);
                            return idxs.includes(i);
                        });

                        if (window) {
                            return (
                                <div key={m} className={cn("h-full flex items-center justify-center text-xs text-white font-bold", window.color)}>
                                    <Sprout className="w-4 h-4" />
                                </div>
                            );
                        }
                        return <div key={m} className="border-r border-white/5 last:border-0" />;
                    })}
                </div>

                {/* Stages Visualization */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                        <Leaf className="w-4 h-4 text-nature-400" />
                        Growth Stages
                    </h4>
                    <div className="flex h-6 rounded-xl overflow-hidden w-full border border-white/10">
                        {data.stages.map((stage, i) => (
                            <div
                                key={i}
                                style={{ width: `${(stage.days / data.duration_days) * 100}%` }}
                                className={cn("h-full", stage.color.replace('bg-', 'bg-opacity-80 bg-'))}
                            />
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {data.stages.map((stage, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                                <span className="font-medium">{stage.name}</span>
                                <span className="text-xs text-gray-500">({stage.days}d)</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
