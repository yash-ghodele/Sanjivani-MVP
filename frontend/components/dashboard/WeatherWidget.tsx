'use client';

import { CloudSun, Loader2, ThermometerSun } from "lucide-react";
import { useEffect, useState } from "react";
import { getWeather, WeatherData } from "@/services/weather";

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchW = async () => {
            try {
                // Try geolocation first
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                            try {
                                const data = await getWeather(pos.coords.latitude, pos.coords.longitude);
                                setWeather(data);
                            } catch {
                                // Fallback to default
                                const data = await getWeather();
                                setWeather(data);
                            } finally {
                                setLoading(false);
                            }
                        },
                        async () => {
                            const data = await getWeather();
                            setWeather(data);
                            setLoading(false);
                        }
                    );
                } else {
                    const data = await getWeather();
                    setWeather(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setError("Unavailable");
                setLoading(false);
            }
        };
        fetchW();
    }, []);

    return (
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CloudSun className="w-24 h-24 text-nature-400" />
            </div>

            <h3 className="text-nature-300 font-medium mb-1 flex items-center gap-2">
                <CloudSun className="w-4 h-4" />
                Live Weather
            </h3>

            {loading ? (
                <div className="h-20 flex items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-nature-500" />
                    <span className="ml-2 text-gray-500 text-sm">Fetching local data...</span>
                </div>
            ) : error ? (
                <div className="h-20 flex items-center text-red-400">
                    <span className="text-sm">Weather service unavailable</span>
                </div>
            ) : weather ? (
                <div className="mt-4">
                    <div className="text-4xl font-display font-bold text-white mb-1">
                        {weather.temp}°C
                    </div>
                    <div className="text-white/80 font-medium">
                        {weather.location}
                    </div>
                    <div className="text-nature-400 text-sm mt-2 font-medium bg-nature-900/40 inline-block px-3 py-1 rounded-full border border-nature-500/20">
                        {weather.condition} • Humidity {weather.humidity}%
                    </div>
                </div>
            ) : null}
        </div>
    );
}
