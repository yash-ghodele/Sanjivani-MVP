"use client";

import { Cloud, Droplets, Wind, MapPin, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeatherData } from "@/hooks/useWeather";

interface WeatherWidgetProps {
    weather: WeatherData | null;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
}

export function WeatherWidget({ weather, loading, error, onRetry }: WeatherWidgetProps) {
    if (loading) {
        return (
            <div className="glass-card p-6 rounded-3xl h-full flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-[#82ae19] animate-spin" />
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="glass-card p-6 rounded-3xl h-full flex flex-col items-center justify-center min-h-[200px] text-center">
                <Cloud className="w-12 h-12 text-gray-600 mb-3 opacity-50" />
                <p className="text-gray-400 text-sm mb-2">{error || "Weather data unavailable"}</p>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetry}
                    className="text-nature-400 hover:text-nature-300 hover:bg-nature-500/10"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 rounded-3xl text-white relative overflow-hidden h-full flex flex-col justify-between group">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#82ae19]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">
                            <MapPin className="w-3 h-3" />
                            {weather.location || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">{weather.description}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onRetry} className="h-8 w-8 text-[#82ae19] hover:bg-[#82ae19]/10 rounded-full">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <Cloud className="w-16 h-16 text-[#82ae19]" />
                    <div>
                        <div className="text-5xl font-display font-bold">{weather.temperature}°</div>
                        <div className="text-sm text-gray-400">Celsius</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <div>
                        <div className="text-lg font-bold">{weather.humidity}%</div>
                        <div className="text-[10px] text-gray-500 uppercase">Humidity</div>
                    </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                    <Wind className="w-5 h-5 text-gray-400" />
                    <div>
                        <div className="text-lg font-bold">{weather.wind_speed} <span className="text-xs font-normal text-gray-500">km/h</span></div>
                        <div className="text-[10px] text-gray-500 uppercase">Wind</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
