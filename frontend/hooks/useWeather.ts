import { useState, useEffect, useCallback } from "react";

export interface WeatherData {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    wind_speed: number;
    location: string;
}

export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Default to Nagpur/Central India coordinates if geolocation fails or is denied
            let lat = 21.1458;
            let lon = 79.0882;

            if (navigator.geolocation) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    lat = position.coords.latitude;
                    lon = position.coords.longitude;
                } catch (e) {
                    console.warn("Geolocation denied or timed out, using default.", e);
                }
            }

            // Safety check
            if (isNaN(lat) || isNaN(lon)) {
                lat = 21.1458;
                lon = 79.0882;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v2/weather?lat=${lat}&lon=${lon}`);

            if (!res.ok) throw new Error("Failed to fetch weather");

            const data = await res.json();
            if (data.success && data.data) {
                setWeather(data.data);
            } else {
                throw new Error("Invalid format");
            }
        } catch (err) {
            console.error("Weather fetch error:", err);
            setError("Unable to fetch weather data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return { weather, loading, error, refetch: fetchWeather };
}
