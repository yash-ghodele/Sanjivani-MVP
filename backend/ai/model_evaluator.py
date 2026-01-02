import os
import json
import time
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import sys

# Ensure backend root is in path to import config
sys.path.append(str(Path(__file__).parent.parent))
from .dataset_config_v2 import CLASS_NAMES, PERFORMANCE_THRESHOLDS

# Config
DATASET_DIR = Path("backend/dataset/PlantVillage")
MODEL_PATH = Path("backend/models/plant_disease_v2.h5")
METRICS_PATH = Path("backend/models/metrics.json")
CONFUSION_MATRIX_PATH = Path("backend/models/confusion_matrix.png")
CLASS_NAMES_PATH = Path("backend/models/class_names.json")

def load_class_names():
    with open(CLASS_NAMES_PATH, 'r') as f:
        return json.load(f)

def create_model_architecture(num_classes):
    """Reconstruct model architecture to load weights safely"""
    print("🏗️ Reconstructing model architecture...")
    
    # Load pre-trained MobileNetV2
    base_model = keras.applications.MobileNetV2(
        input_shape=MODEL_CONFIG["input_size"],
        include_top=False,
        weights=None # We'll load weights later
    )
    
    inputs = keras.Input(shape=MODEL_CONFIG["input_size"])
    x = keras.applications.mobilenet_v2.preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = keras.Model(inputs, outputs)
    return model

def generate_benchmarks():
    print(f"🚀 Starting AI Benchmarking...")
    
    if not MODEL_PATH.exists():
        print(f"❌ Model not found at {MODEL_PATH}")
        return

    # 1. Load Data first to get class names and count
    val_dir = DATASET_DIR / "valid"
    if not val_dir.exists():
        print(f"⚠️ Validation dir not found at {val_dir}")
        return

    class_names = load_class_names()
    num_classes = len(class_names)
    print(f"📂 Class Names ({num_classes}): {class_names}")

    # 2. Reconstruct Model & Load Weights
    try:
        print(f"📦 Loading model from {MODEL_PATH}...")
        # compile=False allows loading without defining custom metrics/optimizers
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return

    # 3. Predict
    datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255) # NOTE: Check if preprocessing usage in model conflicts with this
    # Wait! In train_model_v2.py:
    # x = keras.applications.mobilenet_v2.preprocess_input(inputs)
    # AND datagen = ImageDataGenerator(rescale=1./255) ??
    # Usually preprocess_input expects 0-255 inputs if it does scaling internally.
    # MobileNetV2 preprocess_input expects inputs in range [0, 255] then scales to [-1, 1].
    # IF train_model_v2 used rescale=1/255, then inputs are [0, 1].
    # preprocess_input([0, 1]) would result in [-1, -0.99...] which is WRONG.
    
    # Let's check train_model_v2.py closely for DataGenerator.
    # Lines 130+:
    # train_datagen = ImageDataGenerator(
    #    rescale=1./255, ...
    # )
    # So the training data was divided by 255.
    # If the model HAS `preprocess_input` layer, it will divide AGAIN or shift wrong.
    # MobileNetV2 `preprocess_input` does `(x / 127.5) - 1`.
    # If x is [0, 1], result is approx -1.
    
    # IF the training worked with rescale=1/255, we must match it here.
    # The `preprocess_input` layer in `create_model` might be redundant or wrong if `rescale` is used,
    # BUT if the model learned with that setup, we must reproduce it.
    
    # However, let's look at `train_model_v2.py` line 75:
    # x = keras.applications.mobilenet_v2.preprocess_input(inputs)
    
    # If training used BOTH, we must use BOTH. 
    # Yes, `train_v2` has `inputs = keras.Input` -> `preprocess` -> `base`.
    # AND `flow_from_directory` used `rescale=1./255`.
    
    # So we stick to `rescale=1./255` here too.
    
    generator = datagen.flow_from_directory(
        val_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        shuffle=False,
        classes=class_names
    )
    
    print(f"⚡ Running inference on {generator.samples} images...")
    start_time = time.time()
    predictions = model.predict(generator, verbose=1)
    total_inference_time = time.time() - start_time
    
    y_pred = np.argmax(predictions, axis=1)
    y_true = generator.classes
    
    avg_inference_ms = (total_inference_time * 1000) / generator.samples
    print(f"⏱️ Avg Inference Time: {avg_inference_ms:.2f} ms/sample")

    # 4. Metrics
    accuracy = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    
    print("\n📊 Classification Report:")
    print(classification_report(y_true, y_pred, target_names=class_names))

    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Greens', xticklabels=class_names, yticklabels=class_names)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix - MobileNetV2')
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_PATH)
    print(f"✅ Confusion Matrix saved to {CONFUSION_MATRIX_PATH}")

    metrics_data = {
        "overall_accuracy": round(accuracy, 4),
        "avg_inference_ms": round(avg_inference_ms, 2),
        "total_samples": generator.samples,
        "per_class": {}
    }
    
    for class_name in class_names:
        metrics_data["per_class"][class_name] = {
            "precision": round(report[class_name]["precision"], 4),
            "recall": round(report[class_name]["recall"], 4),
            "f1_score": round(report[class_name]["f1-score"], 4),
            "support": report[class_name]["support"]
        }
        
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"✅ Metrics JSON saved to {METRICS_PATH}")

if __name__ == "__main__":
    generate_benchmarks()
