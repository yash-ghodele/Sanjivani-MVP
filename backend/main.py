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

# Global model variable
model = None

def load_model():
    global model
    try:
        model = tf.keras.models.load_model("backend/models/plant_disease_model.h5")
        print("Model loaded successfully")
    except:
        print("Model not found, using mock")
        model = None

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array / 255.0

def predict_disease(img_array):
    if model is None:
        return "early_blight", 0.95 # Mock
    
    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx])
    
    # Load class names
    try:
        with open("backend/models/class_names.txt", "r") as f:
            class_names = f.read().splitlines()
        disease = class_names[class_idx]
    except:
        disease = "early_blight"
        
    return disease, confidence


app = FastAPI(title="SANJIVANI API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# DATA MODELS & INFO
# ---------------------------------------------------------

class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    severity: str
    treatment: str
    prevention: str

DISEASE_INFO = {
    "early_blight": {
        "severity": "Moderate",
        "treatment": "Use copper-based fungicides. Remove infected leaves.",
        "prevention": "Rotate crops. Ensure good airflow."
    },
    "late_blight": {
        "severity": "High",
        "treatment": "Apply fungicides immediately. Destroy infected plants.",
        "prevention": "Use resistant varieties. Avoid overhead irrigation."
    },
    "healthy": {
        "severity": "None",
        "treatment": "None required.",
        "prevention": "Continue good agricultural practices."
    }
}
# Default fallback for unknown classes
for k in ["target_spot", "mosaic_virus", "curl_virus", "bacterial_spot"]:
    DISEASE_INFO[k] = {
        "severity": "Unknown", 
        "treatment": "Consult an agronomist.", 
        "prevention": "Isolate plant."
    }


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
