"""
Dataset Configuration
Defines the scope, classes, and preprocessing parameters for the AI model
"""

# Focused Scope: Tomato & Potato (Rice unavailable in current dataset)
# Using EXACT folder names from PlantVillage dataset
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
    }
}

CLASS_NAMES = list(DISEASE_MAPPING.keys())

# Model Hyperparameters
MODEL_CONFIG = {
    "input_size": (224, 224, 3),
    "batch_size": 32,
    "epochs": 5,  # Reduced for demonstration/portfolio speed (usually 10-20)
    "learning_rate": 1e-4,
    "trainable_layers": 20, 
    "weights": "imagenet"
}

# Augmentation Parameters
AUGMENTATION_CONFIG = {
    "rotation_range": 20,
    "width_shift_range": 0.2,
    "height_shift_range": 0.2,
    "shear_range": 0.2,
    "zoom_range": 0.2,
    "horizontal_flip": True,
    "fill_mode": "nearest"
}

# Training Split
VALIDATION_SPLIT = 0.2
TEST_SPLIT = 0.1

# Performance Thresholds
PERFORMANCE_THRESHOLDS = {
    "min_accuracy": 0.85,
    "max_inference_ms": 100,
    "max_model_size_mb": 20
}

def get_crop_from_class(class_name: str) -> str:
    return DISEASE_MAPPING.get(class_name, {}).get("crop", "Unknown")

def get_disease_from_class(class_name: str) -> str:
    return DISEASE_MAPPING.get(class_name, {}).get("disease", "Unknown")
