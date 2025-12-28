"""
AI Inference Engine for SANJIVANI 2.0
Isolated module for image classification with performance tracking
"""
import time
from typing import Tuple, Optional, Dict
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from pathlib import Path

from .dataset_config_v2 import CLASS_NAMES, MODEL_CONFIG, get_crop_from_class, get_disease_from_class, get_severity_from_class


class InferenceEngine:
    """
    Handles all AI inference logic with performance benchmarking
    Completely isolated from business logic and knowledge base
    """
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        # Robust path handling: check local 'models' or 'backend/models'
        default_path = "models/plant_disease_v2.h5" 
        if not Path(default_path).exists():
            default_path = "backend/models/plant_disease_v2.h5"
            
        self.model_path = model_path or default_path
        self.model_metadata = {}
        self.inference_times = []  # Track performance
        
        # Load model on initialization
        self.load_model()
    
    def load_model(self):
        """Load the trained model from disk"""
        try:
            model_file = Path(self.model_path)
            if model_file.exists():
                self.model = tf.keras.models.load_model(str(model_file))
                print(f"✅ Model loaded successfully from {self.model_path}")
                
                # Load metadata if available
                metadata_path = model_file.parent / "model_metadata.json"
                if metadata_path.exists():
                    import json
                    with open(metadata_path, 'r') as f:
                        self.model_metadata = json.load(f)
            else:
                print(f"⚠️ Model not found at {self.model_path}, using mock mode")
                self.model = None
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model = None
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Preprocess image for model input
        
        Args:
            image_bytes: Raw image bytes from upload
            
        Returns:
            Preprocessed numpy array ready for inference
        """
        # Load image from bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        input_size = MODEL_CONFIG["input_size"][:2]  # (224, 224)
        img = img.resize(input_size, Image.LANCZOS)
        
        # Convert to array and normalize
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array = img_array / 255.0  # Normalize to [0, 1]
        
        return img_array
    
    def predict(self, image_bytes: bytes) -> Dict:
        """
        Run inference on image and return structured result
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            Dict with crop, disease, confidence, and metadata
        """
        # Start timing
        start_time = time.time()
        
        # Preprocess image
        img_array = self.preprocess_image(image_bytes)
        
        # Run inference
        if self.model is None:
            # Mock mode for development/testing
            result = self._mock_prediction()
        else:
            result = self._real_prediction(img_array)
        
        # End timing
        inference_time_ms = (time.time() - start_time) * 1000
        self.inference_times.append(inference_time_ms)
        
        # Add metadata
        result["metadata"] = {
            "model_version": self.model_metadata.get("version", "2.0.0"),
            "inference_time_ms": round(inference_time_ms, 2),
            "model_architecture": self.model_metadata.get("architecture", "MobileNetV2")
        }
        
        return result
    
    def _real_prediction(self, img_array: np.ndarray) -> Dict:
        """Execute real model prediction"""
        # Get predictions
        predictions = self.model.predict(img_array, verbose=0)
        
        # Get top prediction
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        # Map to class name
        class_name = CLASS_NAMES[class_idx]
        crop = get_crop_from_class(class_name)
        disease = get_disease_from_class(class_name)
        severity = get_severity_from_class(class_name)
        
        # Get top 3 predictions for context
        top_3_idx = np.argsort(predictions[0])[-3:][::-1]
        alternatives = [
            {
                "disease": get_disease_from_class(CLASS_NAMES[idx]),
                "confidence": float(predictions[0][idx])
            }
            for idx in top_3_idx[1:]  # Skip first (main prediction)
        ]
        
        return {
            "crop": crop,
            "disease": disease.replace("_", " ").title(),
            "disease_key": disease,
            "severity": severity,
            "confidence": confidence,
            "alternatives": alternatives
        }
    
    def _mock_prediction(self) -> Dict:
        """Mock prediction for testing without trained model"""
        return {
            "crop": "Tomato",
            "disease": "Early Blight",
            "disease_key": "Early_Blight",
            "confidence": 0.94,
            "alternatives": [
                {"disease": "Late Blight", "confidence": 0.04},
                {"disease": "Leaf Mold", "confidence": 0.02}
            ]
        }
    
    def get_performance_stats(self) -> Dict:
        """Get inference performance statistics"""
        if not self.inference_times:
            return {"message": "No inferences performed yet"}
        
        return {
            "total_inferences": len(self.inference_times),
            "avg_inference_ms": round(np.mean(self.inference_times), 2),
            "min_inference_ms": round(np.min(self.inference_times), 2),
            "max_inference_ms": round(np.max(self.inference_times), 2),
            "std_inference_ms": round(np.std(self.inference_times), 2)
        }
    
    def get_model_info(self) -> Dict:
        """Get model information and metadata"""
        return {
            "loaded": self.model is not None,
            "model_path": self.model_path,
            "metadata": self.model_metadata,
            "performance": self.get_performance_stats(),
            "class_count": len(CLASS_NAMES),
            "classes": CLASS_NAMES
        }


# Global instance (singleton pattern)
_inference_engine = None

def get_inference_engine() -> InferenceEngine:
    """Get or create global inference engine instance"""
    global _inference_engine
    if _inference_engine is None:
        _inference_engine = InferenceEngine()
    return _inference_engine
