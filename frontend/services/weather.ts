const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WeatherData {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    wind_speed: number;
    location: string;
}

export async function fetchLiveWeather(
    lat: number,
    lon: number
): Promise<WeatherData> {
    try {
        const response = await fetch(
            `${API_URL}/api/v2/weather?lat=${lat}&lon=${lon}`
        );

        if (!response.ok) {
            throw new Error('Weather fetch failed');
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Weather API Error:', error);
        // Return fallback
        return {
            temperature: 28,
            condition: 'Clear',
            description: 'clear sky',
            humidity: 65,
            wind_speed: 12,
            location: 'Unknown'
        };
    }
}

// Get user's location with timeout
export async function getUserLocation(): Promise<{ lat: number, lon: number }> {
    return new Promise((resolve) => {
        const defaultLocation = { lat: 21.0077, lon: 75.5626 }; // Jalgaon, MH

        if (!navigator.geolocation) {
            resolve(defaultLocation);
            return;
        }

        // Timeout fallback after 5 seconds
        const timeoutId = setTimeout(() => {
            console.warn('Geolocation timed out, using default');
            resolve(defaultLocation);
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                clearTimeout(timeoutId);
                console.warn('Geolocation error:', error);
                resolve(defaultLocation);
            },
            { timeout: 5000, enableHighAccuracy: false }
        );
    });
}

// Legacy function for backward compatibility
export async function getWeather(lat?: number, lon?: number): Promise<any> {
    const location = lat && lon ? { lat, lon } : await getUserLocation();
    const weather = await fetchLiveWeather(location.lat, location.lon);

    return {
        temp: weather.temperature,
        condition: weather.condition,
        location: weather.location,
        windSpeed: weather.wind_speed,
        humidity: weather.humidity,
        icon: '01d' // placeholder
    };
}
