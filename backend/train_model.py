"""
SANJIVANI - Plant Disease Detection Model Training
Uses the Kaggle New Plant Diseases Dataset
Transfer learning with MobileNetV2 for efficiency
"""

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import numpy as np
from pathlib import Path

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.001

# Dataset path - update this to your local path after downloading from Kaggle
# https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
DATASET_PATH = Path("backend/dataset/PlantVillage")  # Corrected path
TRAIN_DIR = DATASET_PATH / "train"
VAL_DIR = DATASET_PATH / "valid"

def create_model(num_classes):
    """
    Create CNN model using MobileNetV2 transfer learning
    MobileNetV2 is chosen for:
    - Lightweight (good for mobile/web deployment)
    - Fast inference
    - Good accuracy
    """
    # Load pre-trained MobileNetV2 (without top classification layer)
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers initially
    base_model.trainable = False
    
    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    return model

def prepare_data():
    """
    Prepare data generators with augmentation for training
    """
    # Training data augmentation (to improve generalization)
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
        shear_range=0.2,
        fill_mode='nearest'
    )
    
    # Validation data (no augmentation, just rescaling)
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    train_generator = train_datagen.flow_from_directory(
        str(TRAIN_DIR),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    val_generator = val_datagen.flow_from_directory(
        str(VAL_DIR),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    return train_generator, val_generator

def train_model():
    """
    Main training function
    """
    print("=" * 50)
    print("SANJIVANI Model Training")
    print("=" * 50)
    
    # Check if dataset exists
    if not TRAIN_DIR.exists():
        print(f"Error: Dataset not found at {TRAIN_DIR}")
        print("Please download from: https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset")
        print("And update DATASET_PATH in this script")
        return
    
    # Prepare data
    print("\n1. Loading dataset...")
    train_gen, val_gen = prepare_data()
    num_classes = train_gen.num_classes
    
    print(f"Found {num_classes} disease classes")
    print(f"Training samples: {train_gen.samples}")
    print(f"Validation samples: {val_gen.samples}")
    
    # Save class names for later use
    class_names = list(train_gen.class_indices.keys())
    with open('backend/models/class_names.txt', 'w') as f:
        f.write('\n'.join(class_names))
    print(f"Class names saved to backend/models/class_names.txt")
    
    # Create model
    print("\n2. Building model...")
    model = create_model(num_classes)
    
    # Check for existing weights to resume training
    weights_path = Path('backend/models/plant_disease_model.h5')
    if weights_path.exists():
        print(f"\nFound existing model at {weights_path}")
        print("Loading weights to resume training...")
        try:
            model.load_weights(str(weights_path))
            print("✅ Weights loaded successfully! Resuming training...")
        except Exception as e:
            print(f"⚠️ Could not load weights: {e}")
            print("Starting training from scratch...")
    
    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
    )
    
    print(model.summary())
    
    # Callbacks
    callbacks = [
        # Save best model
        ModelCheckpoint(
            'backend/models/plant_disease_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        # Early stopping
        EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        # Reduce learning rate on plateau
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Train
    print("\n3. Training model...")
    print(f"Epochs: {EPOCHS}")
    print(f"Batch size: {BATCH_SIZE}")
    
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )
    
    # Fine-tuning (optional but recommended)
    print("\n4. Fine-tuning...")
    # Unfreeze top layers of base model
    base_model = model.layers[0]
    base_model.trainable = True
    
    # Freeze all layers except the top 20
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
    )
    
    # Continue training
    history_fine = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=10,
        callbacks=callbacks,
        verbose=1
    )
    
    # Final evaluation
    print("\n5. Final Evaluation...")
    test_loss, test_acc, test_top3 = model.evaluate(val_gen)
    print(f"Validation Accuracy: {test_acc * 100:.2f}%")
    print(f"Top-3 Accuracy: {test_top3 * 100:.2f}%")
    
    print("\n" + "=" * 50)
    print("Training Complete!")
    print(f"Model saved to: backend/models/plant_disease_model.h5")
    print("=" * 50)

if __name__ == "__main__":
    # Create models directory if it doesn't exist
    Path("backend/models").mkdir(parents=True, exist_ok=True)
    
    # Check TensorFlow GPU availability
    print(f"TensorFlow version: {tf.__version__}")
    print(f"GPU available: {len(tf.config.list_physical_devices('GPU')) > 0}")
    
    # Train
    train_model()
