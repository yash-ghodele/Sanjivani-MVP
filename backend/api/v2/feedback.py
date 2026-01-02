from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import firebase_admin
from firebase_admin import firestore
from datetime import datetime
from api.deps import get_current_user_optional

router = APIRouter()

class FeedbackRequest(BaseModel):
    userId: str
    scanId: str
    prediction: str
    rating: str
    comment: str = ""
    timestamp: str

@router.post("/feedback")
async def submit_feedback(
    feedback: FeedbackRequest,
    user: dict = Depends(get_current_user_optional)
):
    """
    Submit user feedback for AI predictions.
    Stores data in Firestore 'feedback' collection.
    """
    try:
        # Validate User (optional, feedback can be anonymous but we track it)
        user_id = user.get("uid") if user else "anonymous"
        
        # Prepare Document
        doc_data = feedback.dict()
        doc_data["server_timestamp"] = firestore.SERVER_TIMESTAMP
        doc_data["verified_user_id"] = user_id # Trusted ID from token
        
        # If Firebase is initialized, store in Firestore
        if firebase_admin._apps:
            db = firestore.client()
            db.collection("feedback").add(doc_data)
            print(f"📝 Feedback stored for Scan {feedback.scanId}")
            return {"status": "success", "message": "Feedback recorded"}
        else:
            # Mock mode
            print(f"📝 [MOCK] Feedback received: {feedback.rating} - {feedback.comment}")
            return {"status": "success", "message": "Feedback logged (Mock)"}

    except Exception as e:
        print(f"❌ Feedback error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
