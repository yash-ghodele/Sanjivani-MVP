# SANJIVANI - ML Model Training Guide

## Dataset Setup

1. **Download the Kaggle Dataset:**
   ```bash
   # Visit: https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
   # Download and extract to: Sanjivani/dataset/PlantVillage/
   ```

2. **Expected folder structure:**
   ```
   Sanjivani/
   ├── dataset/
   │   └── PlantVillage/
   │       ├── train/
   │       │   ├── Tomato_Early_blight/
   │       │   ├── Tomato_Late_blight/
   │       │   ├── Tomato_healthy/
   │       │   └── ... (38 classes)
   │       └── valid/
   │           ├── Tomato_Early_blight/
   │           └── ...
   ```

## Training the Model

```bash
cd Sanjivani/backend
python train_model.py
```

**Training time:** ~30-60 minutes on GPU, 2-4 hours on CPU

**Output:**
- `backend/models/plant_disease_model.h5` (trained model)
- `backend/models/class_names.txt` (disease class labels)

## Model Architecture

- **Base:** MobileNetV2 (pre-trained on ImageNet)
- **Custom Head:** 
  - GlobalAveragePooling2D
  - Dense(512, relu)
  - Dropout(0.5)
  - Dense(num_classes, softmax)
- **Input Size:** 224x224x3
- **Output:** Probability distribution over disease classes

## Expected Performance

- **Validation Accuracy:** ~95-98%
- **Inference Time:** <100ms on CPU
- **Model Size:** ~15-20 MB

## Quick Test (Without Training)

The backend API works with mock predictions if no model is found. To test:

```bash
python main.py
# API will run with simulated disease detection
```

## Using Pre-trained Model (Alternative)

If you have a pre-trained `.h5` file:
1. Place it in `backend/models/plant_disease_model.h5`
2. Create `class_names.txt` with one class name per line
3. Start the API server

## Troubleshooting

**Issue:** "Dataset not found"
- Verify DATASET_PATH in `train_model.py` matches your download location

**Issue:** Out of memory during training
- Reduce BATCH_SIZE (try 16 or 8)
- Use CPU instead of GPU

**Issue:** Low accuracy
- Increase EPOCHS (try 30-50)
- Check dataset quality
