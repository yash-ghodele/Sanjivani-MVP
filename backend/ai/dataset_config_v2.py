"""
Dataset Configuration
Defines the scope, classes, and preprocessing parameters for the AI model
"""

# Expanded Scope: Tomato, Potato, Corn, Cotton, Wheat
DISEASE_MAPPING = {
    # Tomato
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early_Blight",
        "severity": "Moderate"
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late_Blight",
        "severity": "High"
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease": "Leaf_Mold",
        "severity": "Low"
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy",
        "severity": "Low"
    },
    
    # Potato
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early_Blight",
        "severity": "Moderate"
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late_Blight",
        "severity": "Critical"
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy",
        "severity": "Low"
    },

    # Corn (New)
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn",
        "disease": "Common_Rust",
        "severity": "Moderate"
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn",
        "disease": "Northern_Leaf_Blight",
        "severity": "High"
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn",
        "disease": "Healthy",
        "severity": "Low"
    },

    # Cotton (New)
    "Cotton___Bacterial_blight": {
        "crop": "Cotton",
        "disease": "Bacterial_Blight",
        "severity": "High"
    },
    "Cotton___healthy": {
        "crop": "Cotton",
        "disease": "Healthy",
        "severity": "Low"
    },

    # Wheat (New)
    "Wheat___Brown_rust": {
        "crop": "Wheat",
        "disease": "Brown_Rust",
        "severity": "Moderate"
    },
    "Wheat___Yellow_rust": {
        "crop": "Wheat",
        "disease": "Yellow_Rust",
        "severity": "High"
    },
    "Wheat___healthy": {
        "crop": "Wheat",
        "disease": "Healthy",
        "severity": "Low"
    }
}

CLASS_NAMES = list(DISEASE_MAPPING.keys())

# Model Hyperparameters
MODEL_CONFIG = {
    "num_classes": len(CLASS_NAMES),
    "input_size": (224, 224, 3),
    "batch_size": 32,
    "epochs": 10,  # Increased for more classes
    "learning_rate": 1e-4,
    "trainable_layers": 30,  # Increased for better feature extraction
    "weights": "imagenet"
}

# Augmentation Parameters
AUGMENTATION_CONFIG = {
    "rotation_range": 25,
    "width_shift_range": 0.25,
    "height_shift_range": 0.25,
    "shear_range": 0.25,
    "zoom_range": 0.25,
    "horizontal_flip": True,
    "fill_mode": "nearest"
}

# Training Split
VALIDATION_SPLIT = 0.2
TEST_SPLIT = 0.1

# Performance Thresholds
PERFORMANCE_THRESHOLDS = {
    "min_accuracy": 0.85,
    "max_inference_ms": 150,  # Slightly higher for more complex model
    "max_model_size_mb": 25
}

# Confidence Safeguards
CONFIDENCE_THRESHOLD = 0.60

def get_crop_from_class(class_name: str) -> str:
    return DISEASE_MAPPING.get(class_name, {}).get("crop", "Unknown")

def get_disease_from_class(class_name: str) -> str:
    return DISEASE_MAPPING.get(class_name, {}).get("disease", "Unknown")

def get_severity_from_class(class_name: str) -> str:
    return DISEASE_MAPPING.get(class_name, {}).get("severity", "Unknown")
