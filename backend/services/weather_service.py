import requests
import os
from datetime import datetime
from typing import Dict, Any

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
CACHE: Dict[str, tuple] = {}
CACHE_TTL = 300  # 5 minutes

def get_location_name(lat: float, lon: float) -> str:
    """Get location name from coordinates using reverse geocoding"""
    try:
        url = f"https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={OPENWEATHER_API_KEY}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if data and len(data) > 0:
            location = data[0]
            # Build location string: "City, State" or "City, Country"
            name_parts = []
            if 'name' in location:
                name_parts.append(location['name'])
            if 'state' in location:
                name_parts.append(location['state'])
            elif 'country' in location:
                name_parts.append(location['country'])
            
            return ', '.join(name_parts) if name_parts else "Unknown Location"
        return "Unknown Location"
    except Exception as e:
        print(f"Geocoding Error: {e}")
        return "Unknown Location"

def get_weather(lat: float, lon: float) -> Dict[str, Any]:
    """Fetch weather data from OpenWeatherMap API with caching"""
    cache_key = f"{lat},{lon}"
    
    # Check cache
    if cache_key in CACHE:
        cached_time, data = CACHE[cache_key]
        if (datetime.now() - cached_time).seconds < CACHE_TTL:
            return data
    
    # Fetch from API
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # Get location name (use API name or reverse geocoding)
        location_name = data.get("name", "")
        if not location_name or location_name == "":
            location_name = get_location_name(lat, lon)
        
        # Transform to our format
        weather_data = {
            "temperature": round(data["main"]["temp"]),
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": round(data["wind"]["speed"] * 3.6),  # m/s to km/h
            "location": location_name
        }
        
        # Cache result
        CACHE[cache_key] = (datetime.now(), weather_data)
        return weather_data
        
    except Exception as e:
        print(f"Weather API Error: {e}")
        # Return fallback data
        return {
            "temperature": 28,
            "condition": "Clear",
            "description": "clear sky",
            "humidity": 65,
            "wind_speed": 12,
            "location": "Jalgaon, Maharashtra"  # Default fallback location
        }
