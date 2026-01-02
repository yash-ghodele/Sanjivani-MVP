"""
Crop Registry Module
Defines the officially supported crops and their maturity status.
"""
from typing import List, Dict

class CropStatus:
    STABLE = "stable"
    BETA = "beta"
    PLANNED = "planned"

SUPPORTED_CROPS: List[Dict] = [
    {
        "id": "tomato",
        "name": "Tomato",
        "scientific_name": "Solanum lycopersicum",
        "status": CropStatus.STABLE,
        "description": "Full support for Early Blight, Late Blight, and Leaf Mold.",
        "icon": "tomato"
    },
    {
        "id": "potato",
        "name": "Potato",
        "scientific_name": "Solanum tuberosum",
        "status": CropStatus.BETA,
        "description": "Beta support for Early/Late Blight. Validation in progress.",
        "icon": "potato"
    },
    {
        "id": "pepper_bell",
        "name": "Bell Pepper",
        "scientific_name": "Capsicum annuum",
        "status": CropStatus.PLANNED,
        "description": "Training data collection phase.",
        "icon": "pepper"
    }
]

def get_supported_crops() -> List[Dict]:
    """Return list of supported crops excluding planned ones if needed"""
    return SUPPORTED_CROPS

def is_crop_supported(crop_name: str) -> bool:
    """Check if a crop is in the stable or beta list"""
    return any(c["id"] == crop_name.lower() and c["status"] != CropStatus.PLANNED for c in SUPPORTED_CROPS)
