'use client';

import { Cloud, Droplets, Wind, MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchLiveWeather, getUserLocation, WeatherData } from '@/services/weather';

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadWeather();
        // Refresh every 5 minutes
        const interval = setInterval(loadWeather, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const loadWeather = async () => {
        try {
            setError(null);
            const location = await getUserLocation();
            const data = await fetchLiveWeather(location.lat, location.lon);
            setWeather(data);
        } catch (error) {
            console.error('Failed to load weather:', error);
            setError('Weather data unavailable');
            // Mock data for fallback so UI doesn't break
            setWeather({
                temperature: 28,
                condition: "Clear",
                description: "Sunny",
                humidity: 45,
                wind_speed: 12,
                location: "Jalgaon (Offline)"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-6 rounded-3xl border border-nature-800 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-6 h-6 text-nature-400 animate-spin" />
            </div>
        );
    }

    // Fallback if weather is null (shouldn't happen with our service update, but safety first)
    const effectiveWeather = weather || {
        temperature: 28,
        condition: "Clear",
        description: "Sunny",
        humidity: 45,
        wind_speed: 12,
        location: error || "Jalgaon (Offline)"
    };

    const getWeatherIcon = (condition: string) => {
        switch (condition?.toLowerCase()) {
            case 'clear': return '☀️';
            case 'clouds': return '☁️';
            case 'rain': return '🌧️';
            case 'drizzle': return '🌦️';
            case 'thunderstorm': return '⛈️';
            case 'snow': return '❄️';
            case 'mist':
            case 'haze': return '🌫️';
            default: return '🌤️';
        }
    };

    return (
        <div className="glass-card p-6 rounded-3xl border border-nature-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-nature-500/10 rounded-full blur-3xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-400">{effectiveWeather.location}</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-5xl font-bold text-white">{effectiveWeather.temperature}°</h3>
                            <span className="text-4xl">{getWeatherIcon(effectiveWeather.condition)}</span>
                        </div>
                        <p className="text-sm text-nature-300 capitalize mt-1">{effectiveWeather.description}</p>
                    </div>
                </div>

                {/* Weather details */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <div>
                            <p className="text-xs text-gray-400">Humidity</p>
                            <p className="text-sm font-bold text-white">{effectiveWeather.humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-nature-400" />
                        <div>
                            <p className="text-xs text-gray-400">Wind</p>
                            <p className="text-sm font-bold text-white">{effectiveWeather.wind_speed} km/h</p>
                        </div>
                    </div>
                </div>

                {/* Farming tip */}
                <div className="mt-4 p-3 rounded-xl bg-nature-500/10 border border-nature-500/20">
                    <p className="text-xs text-nature-300">
                        {effectiveWeather.wind_speed > 15
                            ? '⚠️ High winds - avoid spraying pesticides'
                            : effectiveWeather.humidity > 80
                                ? '💧 High humidity - monitor for fungal diseases'
                                : '✅ Good conditions for field work'}
                    </p>
                </div>
            </div>
        </div>
    );
}
