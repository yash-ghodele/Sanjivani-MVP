import pytest
import sys
import os
from httpx import AsyncClient, ASGITransport

# Add backend directory to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
