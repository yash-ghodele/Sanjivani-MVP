export interface WeatherData {
    temp: number;
    condition: string;
    location: string;
    windSpeed: number;
    humidity: number;
    icon: string;
}

const API_KEY = "b40f70eaaf15418c6ce06cedb4c519ea"; // Kept from previous env
// In production, use process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

export async function getWeather(lat?: number, lon?: number): Promise<WeatherData> {
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;

        if (lat && lon) {
            url += `&lat=${lat}&lon=${lon}`;
        } else {
            url += `&q=Jalgaon,IN`; // Default
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');

        const data = await res.json();

        return {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            location: data.name,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
            humidity: data.main.humidity,
            icon: data.weather[0].icon
        };
    } catch (error) {
        console.error("Weather Error:", error);
        throw error;
    }
}
