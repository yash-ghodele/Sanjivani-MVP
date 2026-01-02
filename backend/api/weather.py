from fastapi import APIRouter, Query, HTTPException
from services.weather_service import get_weather

router = APIRouter(prefix="/api/v2", tags=["weather"])

@router.get("/weather")
async def get_weather_data(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """Get current weather data for given coordinates"""
    try:
        weather = get_weather(lat, lon)
        return {
            "success": True,
            "data": weather
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
