from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.gemini_service import get_gemini_service

router = APIRouter(prefix="/api/v2/ai", tags=["ai"])

class AnalysisRequest(BaseModel):
    crop: str
    disease: str
    confidence: float

@router.post("/analyze")
async def analyze_disease(request: AnalysisRequest):
    """
    Get detailed AI analysis for a detected disease using Gemini
    """
    service = get_gemini_service()
    if not service.model:
        raise HTTPException(status_code=503, detail="AI Service unavailable (Missing API Key)")
        
    analysis = service.generate_disease_analysis(
        request.crop, 
        request.disease, 
        request.confidence
    )
    
    if not analysis:
        raise HTTPException(status_code=500, detail="Failed to generate analysis")
        
    return {
        "success": True,
        "data": analysis
    }
