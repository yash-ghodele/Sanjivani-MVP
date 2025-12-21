from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
from PIL import Image
import io
from typing import Optional
import tensorflow as tf
from pathlib import Path

from database import init_db, save_scan

app = FastAPI(title="SANJIVANI API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (Disease Info Dict) ...

@app.on_event("startup")
async def startup_event():
    load_model()
    init_db()

# ... (PredictionResponse Class) ...

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Main prediction endpoint
    Accepts image file and returns disease prediction with recommendations
    """
    try:
        # Read image file
        contents = await file.read()
        
        # Preprocess image
        img = preprocess_image(contents)
        
        # Predict disease
        disease_key, confidence = predict_disease(img)
        
        # Get disease information
        disease_info = DISEASE_INFO.get(disease_key, DISEASE_INFO["early_blight"])
        
        # Format disease name for display
        disease_name = disease_key.replace("_", " ").title()
        if disease_key == "healthy":
            disease_name = "Healthy"
        
        # Save to Database
        scan_data = {
            "disease": disease_name,
            "confidence": float(confidence),
            "severity": disease_info["severity"],
            "filename": file.filename
        }
        save_scan(scan_data)
        
        return PredictionResponse(
            disease=disease_name,
            confidence=round(confidence * 100, 2),
            severity=disease_info["severity"],
            treatment=disease_info["treatment"],
            prevention=disease_info["prevention"]
        )
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Added reload=True for development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
