"""
SANJIVANI 2.0 - Model Training Pipeline
Production-grade training with comprehensive metrics and evaluation

Features:
- MobileNetV2 transfer learning
- Data augmentation
- Model evaluation with confusion matrix
- Dual format export (.h5 + .tflite)
- Metadata generation with benchmarks
"""
import os
import json
import time
from datetime import datetime
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Import configuration
import sys
sys.path.append(str(Path(__file__).parent))
from ai.dataset_config import (
    CLASS_NAMES, MODEL_CONFIG, AUGMENTATION_CONFIG,
    VALIDATION_SPLIT, TEST_SPLIT, PERFORMANCE_THRESHOLDS
)

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Configuration
DATASET_DIR = "backend/dataset/PlantVillage"  # Update with actual path
MODEL_SAVE_DIR = "backend/models"
BATCH_SIZE = MODEL_CONFIG["batch_size"]
EPOCHS = MODEL_CONFIG["epochs"]
IMG_SIZE = MODEL_CONFIG["input_size"][:2]


def create_model(num_classes: int):
    """
    Create MobileNetV2 model with transfer learning
    
    Args:
        num_classes: Number of output classes
        
    Returns:
        Compiled Keras model
    """
    print(f"\n{'='*60}")
    print(f"Creating MobileNetV2 model for {num_classes} classes")
    print(f"{'='*60}\n")
    
    # Load pre-trained MobileNetV2
    base_model = keras.applications.MobileNetV2(
        input_shape=MODEL_CONFIG["input_size"],
        include_top=False,
        weights=MODEL_CONFIG["weights"]
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Create new model
    inputs = keras.Input(shape=MODEL_CONFIG["input_size"])
    
    # Preprocessing
    x = keras.applications.mobilenet_v2.preprocess_input(inputs)
    
    # Base model
    x = base_model(x, training=False)
    
    # Pooling and classification head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = keras.Model(inputs, outputs, name="sanjivani_mobilenetv2")
    
    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=MODEL_CONFIG["learning_rate"]),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
    )
    
    print(f"✅ Model created successfully")
    print(f"   Total params: {model.count_params():,}")
    print(f"   Trainable params: {sum([tf.size(w).numpy() for w in model.trainable_weights]):,}")
    
    return model, base_model


def setup_data_generators(dataset_dir: str):
    """
    Setup training, validation, and test data generators
    
    Args:
        dataset_dir: Path to dataset directory
        
    Returns:
        train_gen, val_gen, test_gen
    """
    print(f"\n{'='*60}")
    print("Setting up data generators")
    print(f"{'='*60}\n")
    
    # Training data generator with augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=AUGMENTATION_CONFIG["rotation_range"],
        width_shift_range=AUGMENTATION_CONFIG["width_shift_range"],
        height_shift_range=AUGMENTATION_CONFIG["height_shift_range"],
        shear_range=AUGMENTATION_CONFIG["shear_range"],
        zoom_range=AUGMENTATION_CONFIG["zoom_range"],
        horizontal_flip=AUGMENTATION_CONFIG["horizontal_flip"],
        fill_mode=AUGMENTATION_CONFIG["fill_mode"],
        validation_split=VALIDATION_SPLIT + TEST_SPLIT
    )
    
    # Validation and test without augmentation
    val_test_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=VALIDATION_SPLIT + TEST_SPLIT
    )
    
    # Training generator
    train_gen = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True,
        seed=42
    )
    
    # Validation generator
    val_gen = val_test_datagen.flow_from_directory(
        dataset_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False,
        seed=42
    )
    
    print(f"✅ Data generators ready")
    print(f"   Training samples: {train_gen.samples}")
    print(f"   Validation samples: {val_gen.samples}")
    print(f"   Classes: {len(train_gen.class_indices)}")
    
    return train_gen, val_gen


def train_model(model, base_model, train_gen, val_gen):
    """
    Train model in two phases: freeze -> fine-tune
    
    Args:
        model: Keras model
        base_model: Base MobileNetV2 model
        train_gen: Training data generator
        val_gen: Validation data generator
        
    Returns:
        history: Training history
    """
    print(f"\n{'='*60}")
    print("PHASE 1: Training with frozen base")
    print(f"{'='*60}\n")
    
    # Callbacks
    checkpoint = keras.callbacks.ModelCheckpoint(
        os.path.join(MODEL_SAVE_DIR, "plant_disease_v2_checkpoint.h5"),
        save_best_only=True,
        monitor='val_accuracy',
        mode='max'
    )
    
    early_stop = keras.callbacks.EarlyStopping(
        monitor='val_accuracy',
        patience=5,
        restore_best_weights=True
    )
    
    reduce_lr = keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=3,
        min_lr=1e-7
    )
    
    # Train with frozen base
    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS // 2,
        callbacks=[checkpoint, early_stop, reduce_lr],
        verbose=1
    )
    
    # Fine-tuning phase
    print(f"\n{'='*60}")
    print("PHASE 2: Fine-tuning last layers")
    print(f"{'='*60}\n")
    
    # Unfreeze last layers
    base_model.trainable = True
    for layer in base_model.layers[:MODEL_CONFIG["trainable_layers"]]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=MODEL_CONFIG["learning_rate"] / 10),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
    )
    
    # Continue training
    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS // 2,
        initial_epoch=len(history1.history['loss']),
        callbacks=[checkpoint, early_stop, reduce_lr],
        verbose=1
    )
    
    # Combine histories
    for key in history1.history:
        history1.history[key].extend(history2.history[key])
    
    return history1


def evaluate_model(model, val_gen):
    """
    Comprehensive model evaluation with metrics
    
    Args:
        model: Trained model
        val_gen: Validation data generator
        
    Returns:
        metrics: Dictionary of evaluation metrics
    """
    print(f"\n{'='*60}")
    print("Evaluating model performance")
    print(f"{'='*60}\n")
    
    # Get predictions
    val_gen.reset()
    y_pred_probs = model.predict(val_gen, verbose=1)
    y_pred = np.argmax(y_pred_probs, axis=1)
    y_true = val_gen.classes
    
    # Calculate metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='weighted')
    recall = recall_score(y_true, y_pred, average='weighted')
    f1 = f1_score(y_true, y_pred, average='weighted')
    
    # Print classification report
    print("\nClassification Report:")
    print("=" * 80)
    print(classification_report(y_true, y_pred, target_names=CLASS_NAMES))
    
    # Confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    
    # Plot confusion matrix
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(MODEL_SAVE_DIR, 'confusion_matrix.png'), dpi=300, bbox_inches='tight')
    print(f"\n✅ Confusion matrix saved to models/confusion_matrix.png")
    
    metrics = {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1)
    }
    
    print(f"\n📊 Model Performance:")
    print(f"   Accuracy:  {accuracy:.4f}")
    print(f"   Precision: {precision:.4f}")
    print(f"   Recall:    {recall:.4f}")
    print(f"   F1-Score:  {f1:.4f}")
    
    # Check against thresholds
    if accuracy < PERFORMANCE_THRESHOLDS["min_accuracy"]:
        print(f"\n⚠️ WARNING: Accuracy below threshold ({PERFORMANCE_THRESHOLDS['min_accuracy']})")
    else:
        print(f"\n✅ Model meets performance thresholds!")
    
    return metrics


def benchmark_inference(model):
    """
    Benchmark inference time
    
    Args:
        model: Trained model
        
    Returns:
        avg_time_ms: Average inference time in milliseconds
    """
    print(f"\n{'='*60}")
    print("Benchmarking inference time")
    print(f"{'='*60}\n")
    
    # Create dummy input
    dummy_input = np.random.random((1, *MODEL_CONFIG["input_size"])).astype(np.float32)
    
    # Warmup
    for _ in range(10):
        _ = model.predict(dummy_input, verbose=0)
    
    # Benchmark
    times = []
    for _ in range(100):
        start = time.time()
        _ = model.predict(dummy_input, verbose=0)
        times.append((time.time() - start) * 1000)  # Convert to ms
    
    avg_time = np.mean(times)
    std_time = np.std(times)
    
    print(f"✅ Inference benchmark complete")
    print(f"   Average: {avg_time:.2f} ms")
    print(f"   Std Dev: {std_time:.2f} ms")
    print(f"   Min: {np.min(times):.2f} ms")
    print(f"   Max: {np.max(times):.2f} ms")
    
    if avg_time > PERFORMANCE_THRESHOLDS["max_inference_ms"]:
        print(f"\n⚠️ WARNING: Inference time above target ({PERFORMANCE_THRESHOLDS['max_inference_ms']} ms)")
    else:
        print(f"\n✅ Inference time meets edge-ready target!")
    
    return float(avg_time)


def export_model(model, metrics, avg_inference_ms):
    """
    Export model in multiple formats with metadata
    
    Args:
        model: Trained model
        metrics: Evaluation metrics dict
        avg_inference_ms: Average inference time
    """
    print(f"\n{'='*60}")
    print("Exporting model")
    print(f"{'='*60}\n")
    
    # Ensure directory exists
    os.makedirs(MODEL_SAVE_DIR, exist_ok=True)
    
    # 1. Save .h5 format (standard)
    h5_path = os.path.join(MODEL_SAVE_DIR, "plant_disease_v2.h5")
    model.save(h5_path)
    model_size_mb = os.path.getsize(h5_path) / (1024 * 1024)
    print(f"✅ Saved .h5 model: {h5_path} ({model_size_mb:.2f} MB)")
    
    # 2. Convert to TFLite (edge deployment)
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()
    
    tflite_path = os.path.join(MODEL_SAVE_DIR, "plant_disease_v2.tflite")
    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
    
    tflite_size_mb = os.path.getsize(tflite_path) / (1024 * 1024)
    print(f"✅ Saved .tflite model: {tflite_path} ({tflite_size_mb:.2f} MB)")
    print(f"   Size reduction: {((model_size_mb - tflite_size_mb) / model_size_mb * 100):.1f}%")
    
    # 3. Save class names
    class_names_path = os.path.join(MODEL_SAVE_DIR, "class_names.json")
    with open(class_names_path, 'w') as f:
        json.dump(CLASS_NAMES, f, indent=2)
    print(f"✅ Saved class names: {class_names_path}")
    
    # 4. Save metadata
    metadata = {
        "version": "2.0.0",
        "architecture": "MobileNetV2",
        "input_size": list(MODEL_CONFIG["input_size"]),
        "num_classes": len(CLASS_NAMES),
        "accuracy": metrics["accuracy"],
        "precision": metrics["precision"],
        "recall": metrics["recall"],
        "f1_score": metrics["f1_score"],
        "model_size_mb": float(model_size_mb),
        "tflite_size_mb": float(tflite_size_mb),
        "avg_inference_ms": avg_inference_ms,
        "trained_date": datetime.now().strftime("%Y-%m-%d"),
        "trained_on": "PlantVillage dataset (focused scope)",
        "classes": CLASS_NAMES
    }
    
    metadata_path = os.path.join(MODEL_SAVE_DIR, "model_metadata.json")
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✅ Saved metadata: {metadata_path}")
    
    return metadata


def main():
    """Main training pipeline"""
    print(f"\n{'#'*60}")
    print(f"# SANJIVANI 2.0 - Model Training Pipeline")
    print(f"# Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'#'*60}\n")
    
    # Check if dataset exists
    if not os.path.exists(DATASET_DIR):
        print(f"❌ ERROR: Dataset not found at {DATASET_DIR}")
        print(f"\nPlease download dataset first:")
        print(f"   python backend/download_dataset.py")
        return
    
    # Create model
    num_classes = len(CLASS_NAMES)
    model, base_model = create_model(num_classes)
    
    # Setup data
    train_gen, val_gen = setup_data_generators(DATASET_DIR)
    
    # Train model
    start_time = time.time()
    history = train_model(model, base_model, train_gen, val_gen)
    training_time = (time.time() - start_time) / 60  # minutes
    
    print(f"\n✅ Training complete in {training_time:.1f} minutes")
    
    # Evaluate
    metrics = evaluate_model(model, val_gen)
    
    # Benchmark
    avg_inference_ms = benchmark_inference(model)
    
    # Export
    metadata = export_model(model, metrics, avg_inference_ms)
    
    # Final summary
    print(f"\n{'='*60}")
    print("📊 TRAINING SUMMARY")
    print(f"{'='*60}")
    print(f"Model: MobileNetV2")
    print(f"Classes: {num_classes}")
    print(f"Training time: {training_time:.1f} min")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Model size: {metadata['model_size_mb']:.2f} MB (.h5)")
    print(f"TFLite size: {metadata['tflite_size_mb']:.2f} MB")
    print(f"Inference: {avg_inference_ms:.2f} ms")
    print(f"\n{'='*60}")
    print(f"✅ SANJIVANI 2.0 model training complete!")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
