"""
API v2 Prediction Endpoint
Combines AI inference with knowledge engine for complete responses
"""
from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from typing import Optional

from schemas.prediction import PredictionResponse
from ai.inference_engine import get_inference_engine
from knowledge.knowledge_engine import get_knowledge_engine
from database import save_scan

router = APIRouter(prefix="/api/v2", tags=["prediction-v2"])


from ai.dataset_config_v2 import CLASS_NAMES, get_crop_from_class, get_disease_from_class, get_severity_from_class
from api.deps import get_current_user_optional
from fastapi import Depends

@router.post("/predict", response_model=PredictionResponse)
async def predict_disease(
    file: UploadFile = File(...),
    language: str = Query("en", description="Language for response (en, hi, mr)"),
    user: dict = Depends(get_current_user_optional)
):
    """
    Predict crop disease from image (API v2)
    
    **Improvements over v1:**
    - Structured response with categorized actions
    - Performance metadata included
    - Deterministic treatment recommendations
    - Multilingual support
    - Alternative predictions
    - **User Identity Awareness** (New)
    
    **Process:**
    1. AI inference (crop + disease + confidence)
    2. Knowledge lookup (symptoms + treatments)
    3. Structured response assembly
    """
    try:
        # Log User Access
        user_id = user.get("uid") if user else "guest"
        print(f"👤 Prediction requested by: {user_id}")

        # Read image bytes
        contents = await file.read()
        
        # Get AI engines
        inference_engine = get_inference_engine()
        knowledge_engine = get_knowledge_engine()
        
        # Step 1: AI Inference (isolated)
        prediction = inference_engine.predict(contents)
        confidence = prediction["confidence"]
        
        # Step 2: Map to knowledge base (deterministic)
        complete_response = knowledge_engine.map_prediction_to_response(
            crop=prediction["crop"],
            disease_key=prediction["disease_key"],
            confidence=confidence,
            language=language
        )
        
        # --- CONFIDENCE SAFEGUARDS ---
        # Priority 1.3: Prevent blind trust in low-confidence predictions
        if confidence < CONFIDENCE_THRESHOLD:
            print(f"⚠️ Low confidence prediction ({confidence:.2f} < {CONFIDENCE_THRESHOLD})")
            
            # 1. Flag as 'Uncertain' in explanation
            warning_msg = "⚠️ Low Confidence Risk: The system is uncertain about this result. Please consult an expert before applying treatments."
            complete_response["explanation"] = f"{warning_msg}\n\n{complete_response['explanation']}"
            
            # 2. Suppress specific chemical advice (Safety)
            complete_response["recommended_actions"] = {
                "immediate": ["Consult a local agricultural expert for verification."],
                "short_term": ["Monitor the crop for progression of symptoms."],
                "preventive": ["Maintain general crop hygiene."]
            }
            
            # 3. Force severity to Low to prevent panic
            complete_response["severity"] = "Low"
            
        # Add metadata from inference
        complete_response["metadata"] = prediction["metadata"]
        
        # Add alternatives if available
        if "alternatives" in prediction:
            complete_response["alternatives"] = prediction["alternatives"]
        
        # Step 3: Save to database
        scan_data = {
            "crop": complete_response["crop"],
            "disease": complete_response["disease"],
            "confidence": complete_response["confidence"],
            "severity": complete_response["severity"],
            "filename": file.filename,
            "model_version": prediction["metadata"]["model_version"]
        }
        save_scan(scan_data)
        
        return PredictionResponse(**complete_response)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Prediction failed: {str(e)}"
        )
