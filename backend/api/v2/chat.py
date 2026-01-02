from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ai.gemini_tutor import get_explanation
from api.deps import get_current_user_optional

router = APIRouter()

class ExplanationRequest(BaseModel):
    disease: str
    confidence: float
    crop: str
    language: str = "en"

@router.post("/chat/explain")
async def explain_result(
    request: ExplanationRequest,
    user: dict = Depends(get_current_user_optional)
):
    """
    Get an AI-generated explanation for a specific diagnosis.
    Powered by Gemini 1.5 Flash.
    """
    try:
        explanation = get_explanation(
            disease_name=request.disease,
            confidence=request.confidence,
            crop_name=request.crop,
            language=request.language
        )
        return {
            "explanation": explanation,
            "provider": "Gemini 2.0 Flash",
            "cached": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
