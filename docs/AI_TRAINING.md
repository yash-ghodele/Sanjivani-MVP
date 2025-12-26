# SANJIVANI 2.0 - AI Training Guide

## 🧠 Model Overview

**Architecture:** MobileNetV2 with Transfer Learning  
**Classes:** 10 diseases across 3 crops  
**Input Size:** 224×224×3  
**Target Accuracy:** >90%  
**Target Inference:** <100ms (edge-ready)

---

## 📂 Dataset Preparation

### Focused Scope (Production-Ready)

```
backend/dataset/PlantVillage/
├── Tomato__Early_Blight/
├── Tomato__Late_Blight/
├── Tomato__Leaf_Mold/
├── Tomato__Healthy/
├── Potato__Early_Blight/
├── Potato__Late_Blight/
├── Potato__Healthy/
├── Rice__Bacterial_Blight/
├── Rice__Brown_Spot/
└── Rice__Healthy/
```

### Dataset Requirements

- **Images per class:** Minimum 500-1000
- **Format:** JPG/PNG
- **Resolution:** Any (will be resized to 224×224)
- **Split:** 70% train, 20% validation, 10% test

### Download Dataset

```bash
# Option 1: PlantVillage (Kaggle)
kaggle datasets download -d emmarex/plantdisease

# Option 2: Manual download
# Download from https://www.kaggle.com/datasets/emmarex/plantdisease
# Extract to backend/dataset/
```

### Organize Dataset

```bash
python backend/extract_dataset.py
```

---

## ⚙️ Training Pipeline

### 1. Install Dependencies

```bash
cd backend
pip install tensorflow matplotlib seaborn scikit-learn
```

### 2. Train Model

```bash
python backend/train_model_v2.py
```

### Training Process

**PHASE 1: Frozen Base (10 epochs)**
- Train classification head only
- MobileNetV2 base frozen
- Higher learning rate (1e-4)

**PHASE 2: Fine-tuning (10 epochs)**
- Unfreeze last 4 layers
- Lower learning rate (1e-5)
- Fine-tune for better accuracy

### Expected Training Time

- **GPU (CUDA):** ~30-45 minutes
- **CPU:** ~2-3 hours

---

## 📊 Evaluation Metrics

### Automated Metrics

The training script generates:

1. **Classification Report**
   - Accuracy, Precision, Recall per class
   - F1-Score
   - Support (samples per class)

2. **Confusion Matrix**
   - Saved as `models/confusion_matrix.png`
   - Heatmap visualization
   - Shows prediction accuracy per class

3. **Inference Benchmark**
   - Average inference time (100 runs)
   - Min/Max/Std deviation
   - Validates edge-readiness target (<100ms)

### Model Metadata

Generated in `models/model_metadata.json`:

```json
{
  "version": "2.0.0",
  "architecture": "MobileNetV2",
  "accuracy": 0.94,
  "precision": 0.93,
  "recall": 0.92,
  "f1_score": 0.925,
  "model_size_mb": 14.2,
  "tflite_size_mb": 3.8,
  "avg_inference_ms": 45,
  "trained_date": "2025-12-26",
  "classes": [...]
}
```

---

## 📦 Model Outputs

After training, you'll have:

| File | Size | Purpose |
|------|------|---------|
| `plant_disease_v2.h5` | ~14 MB | Standard Keras model |
| `plant_disease_v2.tflite` | ~4 MB | Edge deployment (mobile/IoT) |
| `model_metadata.json` | ~1 KB | Benchmarks & metrics |
| `class_names.json` | ~1 KB | Class mappings |
| `confusion_matrix.png` | ~200 KB | Evaluation visualization |

---

## 🎯 Performance Thresholds

From `ai/dataset_config.py`:

```python
PERFORMANCE_THRESHOLDS = {
    "min_accuracy": 0.90,   # 90% minimum
    "min_precision": 0.88,
    "min_recall": 0.88,
    "max_inference_ms": 100  # Edge-ready target
}
```

Training will warn if thresholds not met.

---

## 🚀 Using the Trained Model

### Backend Integration

The model is automatically loaded by `ai/inference_engine.py`:

```python
from ai.inference_engine import get_inference_engine

engine = get_inference_engine()
result = engine.predict(image_bytes)
```

### Testing Inference

```bash
cd backend
python -c "
from ai.inference_engine import get_inference_engine
engine = get_inference_engine()
print(f'Model loaded: {engine.model is not None}')
print(f'Metadata: {engine.model_metadata}')
"
```

---

## 🔧 Troubleshooting

### CUDA/GPU Issues

```bash
# Check TensorFlow GPU
python -c "import tensorflow as tf; print(tf.test.is_gpu_available())"

# If problems, use CPU version
pip install tensorflow-cpu
```

### Out of Memory

Reduce batch size in `ai/dataset_config.py`:

```python
MODEL_CONFIG = {
    "batch_size": 16,  # Reduce from 32
    ...
}
```

### Dataset Not Found

```bash
# Verify path
ls backend/dataset/PlantVillage/

# Should show 10 class directories
```

---

## 📈 Improving Accuracy

1. **More Data:** Increase samples per class
2. **Augmentation:** Already configured in `dataset_config.py`
3. **Epochs:** Increase in `MODEL_CONFIG`
4. **Architecture:** Try EfficientNet-Lite (update `create_model()`)
5. **Class Balance:** Ensure equal samples per class

---

## 🌐 Edge Deployment

The `.tflite` model is optimized for:

- Mobile apps (Flutter/React Native)
- Raspberry Pi
- Edge TPU (Google Coral)
- Microcontrollers (ESP32 with TensorFlow Lite Micro)

### Convert to Other Formats

```python
# ONNX (for broader compatibility)
import tf2onnx
spec = (tf.TensorSpec((None, 224, 224, 3), tf.float32, name="input"),)
output_path = "models/plant_disease_v2.onnx"
model_proto, _ = tf2onnx.convert.from_keras(model, input_signature=spec)
with open(output_path, "wb") as f:
    f.write(model_proto.SerializeToString())
```

---

## ✅ Success Criteria

Your model is production-ready when:

- ✅ Accuracy >90%
- ✅ Inference <100ms (on target hardware)
- ✅ All 10 classes performing well (check confusion matrix)
- ✅ .tflite export successful
- ✅ Metadata generated

---

*For questions or issues, check the confusion matrix and classification report first. They show per-class performance and highlight problem areas.*
