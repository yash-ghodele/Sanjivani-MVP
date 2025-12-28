"""
SANJIVANI 2.0 - Main FastAPI Application
Production-grade architecture with separated concerns
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import API v2 routers
# Import API v2 routers
from api.v2 import predict, meta, alerts, metrics, search
from api.v2.feedback import router as feedback_router
from api.v2.chat import router as chat_router
from api import weather
from api import ai_analysis

# Import initialization functions
from database import init_db
from ai.inference_engine import get_inference_engine
from knowledge.knowledge_engine import get_knowledge_engine


# Initialize FastAPI app
app = FastAPI(
    title="SANJIVANI API",
    version="2.0.0",
    description="AI-powered crop disease detection platform with production-grade architecture",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "https://sanjivani.app",  # Production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Include API v2 routers
# Note: predict_router and metrics_router have prefixes internal to them
app.include_router(metrics.router)

# These routers rely on the prefix defined here to match frontend expectations
app.include_router(predict.router, prefix="/api/v2", tags=["Prediction"])
app.include_router(meta.router, prefix="/api/v2/meta", tags=["Meta"])
app.include_router(alerts.router, prefix="/api/v2/alerts", tags=["Alerts"])
app.include_router(feedback_router, prefix="/api/v2")
app.include_router(chat_router, prefix="/api/v2")
app.include_router(search.router, prefix="/api/v2", tags=["Search"])
app.include_router(weather.router)
app.include_router(ai_analysis.router)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting SANJIVANI 2.0...")
    
    # Initialize database
    init_db()
    
    # Initialize AI engine (loads model)
    inference_engine = get_inference_engine()
    model_info = inference_engine.get_model_info()
    if model_info["loaded"]:
        print(f"✅ Model loaded: {model_info['metadata'].get('version', 'unknown')}")
    else:
        print("⚠️ Model not found - using mock mode")
    
    # Initialize knowledge engine
    knowledge_engine = get_knowledge_engine()
    kb_version = knowledge_engine.get_knowledge_version()
    print(f"✅ Knowledge Base v{kb_version} loaded")
    print(f"   Diseases: {len(knowledge_engine.get_all_diseases())}")
    
    print("✅ SANJIVANI 2.0 ready!")


@app.get("/")
async def root():
    """API root - redirect to docs"""
    return {
        "name": "SANJIVANI API",
        "version": "2.0.0",
        "description": "AI-powered crop disease detection",
        "docs": "/api/docs",
        "health": "/api/v2/health",
        "architecture": "Production-grade with separated concerns"
    }


# Legacy v1 endpoint (deprecated - kept for backward compatibility)
from fastapi import File, UploadFile, HTTPException
from pydantic import BaseModel

class PredictionResponseV1(BaseModel):
    """Legacy v1 response format (deprecated)"""
    disease: str
    confidence: float
    severity: str
    treatment: str
    prevention: str

@app.post("/predict", response_model=PredictionResponseV1, deprecated=True, tags=["legacy"])
async def predict_v1(file: UploadFile = File(...)):
    """
    Legacy v1 prediction endpoint (DEPRECATED)
    
    ⚠️ This endpoint is deprecated. Please use /api/v2/predict instead.
    
    The v2 endpoint provides:
    - Structured response with categorized actions
    - Performance metadata
    - Alternative predictions
    - Multilingual support
    """
    try:
        contents = await file.read()
        
        # Use new inference engine
        inference_engine = get_inference_engine()
        knowledge_engine = get_knowledge_engine()
        
        # Get prediction
        prediction = inference_engine.predict(contents)
        complete_response = knowledge_engine.map_prediction_to_response(
            crop=prediction["crop"],
            disease_key=prediction["disease_key"],
            confidence=prediction["confidence"]
        )
        
        # Convert to v1 format
        actions = complete_response["recommended_actions"]
        return PredictionResponseV1(
            disease=complete_response["disease"],
            confidence=round(complete_response["confidence"] * 100, 2),
            severity=complete_response["severity"],
            treatment="; ".join(actions["immediate"][:2]) if actions["immediate"] else "No immediate action required",
            prevention="; ".join(actions["preventive"][:2]) if actions["preventive"] else "Continue good practices"
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

