from fastapi import APIRouter
from ai.registry import get_supported_crops
from knowledge.knowledge_engine import get_knowledge_engine

router = APIRouter()

@router.get("/crops")
async def get_crops():
    """
    Get list of supported crops and their status.
    """
    return {
        "crops": get_supported_crops(),
        "count": len(get_supported_crops())
    }

@router.get("/diseases")
async def get_diseases():
    """
    Get searchable list of all diseases for Global Search.
    """
    engine = get_knowledge_engine()
    # Create a lightweight index
    index = []
    
    # helper to format display name
    def format_name(key):
        return key.replace("_", " ")

    for key, data in engine.knowledge_base.get("diseases", {}).items():
        if key == "Healthy": continue
        
        index.append({
            "id": key,
            "name": format_name(key),
            "scientific_name": data.get("scientific_name"),
            "crops": data.get("crops_affected", []),
            "severity": data.get("severity"),
            "symptoms_preview": data.get("symptoms", [])[:2]
        })
        
    return {
        "diseases": index,
        "total": len(index)
    }

@router.get("/diseases/{disease_id}")
async def get_disease_detail(disease_id: str):
    """
    Get full details for a specific disease.
    """
    engine = get_knowledge_engine()
    data = engine.knowledge_base.get("diseases", {}).get(disease_id)
    
    if not data:
        return {"error": "Disease not found"}, 404
        
    return {
        "id": disease_id,
        "name": disease_id.replace("_", " "),
        **data
    }

@router.get("/calendar")
async def get_calendar():
    """
    Get crop lifecycle calendar data.
    """
    import json
    import os
    
    # Path to the calendar json
    # Assuming relative path from api/v2/meta.py back to knowledge/crop_calendar.json
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__))) # backend
    json_path = os.path.join(base_dir, "knowledge", "crop_calendar.json")
    
    if not os.path.exists(json_path):
         return {"error": "Calendar data missing"}, 500
         
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    return data
