from fastapi import APIRouter
import json
import os

router = APIRouter()

@router.get("/pests")
async def get_pest_alerts():
    """
    Get current pest alerts.
    """
    # Path to the alerts json
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__))) # backend
    json_path = os.path.join(base_dir, "knowledge", "pest_alerts.json")
    
    if not os.path.exists(json_path):
         return []
         
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    return {
        "alerts": data,
        "count": len(data)
    }
