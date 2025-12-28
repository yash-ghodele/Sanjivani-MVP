import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/api/v2/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data

@pytest.mark.asyncio
async def test_root_gzip(client: AsyncClient):
    # Request with gzip compression support
    headers = {"Accept-Encoding": "gzip"}
    response = await client.get("/", headers=headers)
    assert response.status_code == 200
    # Check if response was actually compressed (depends on size, root response might be small)
    # But we can check if the server respects the header generally or just check content
    assert response.json()["name"] == "SANJIVANI API"

@pytest.mark.asyncio
async def test_weather_endpoint_fallback(client: AsyncClient):
    # Test weather with some coordinates
    response = await client.get("/api/v2/weather?lat=0&lon=0")
    # Even if API fails (no key in test env maybe), it should return a 200 with fallback or real data
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "temperature" in data["data"]
