# 📊 AI Model Benchmarks (MobileNetV2)

**Version:** `v2.0.0-mobilenet`
**Date:** December 26, 2025
**Dataset:** PlantVillage (7 Output Classes)
**Training Scope:** 5 Epochs (Pipeline Validation Run)

## 1. Executive Summary

| Metric | Result | Assessment |
| :--- | :--- | :--- |
| **Overall Accuracy** | **17.02%** | 🔴 Low (Requires 50+ epochs training) |
| **Inference Latency** | **10.64 ms** | 🟢 **Excellent** (Edge-Ready < 50ms) |
| **Model Size** | **9.0 MB** | 🟢 Lightweight |
| **Validation Set** | 3320 Images | ✅ Statistically Significant |

> **⚠️ Note on Accuracy**: These metrics reflect a short 5-epoch validation run to verify the training pipeline and benchmarking infrastructure. Production deployment requires extended training (50-100 epochs) to achieve target >85% accuracy.

## 2. Per-Class Performance

| Class | Precision | Recall | F1 Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **Tomato Early Blight** | 0.2177 | 0.3479 | 0.2678 | 480 |
| **Tomato Late Blight** | 0.4348 | 0.0216 | 0.0412 | 463 |
| **Potato Early Blight** | 0.1627 | 0.7608 | 0.2681 | 485 |
| **Potato Late Blight** | 0.0751 | 0.0392 | 0.0515 | 485 |
| **Healthy / Other** | 0.0000 | 0.0000 | 0.0000 | - |

**Analysis**:
- **Potato Early Blight** shows highest recall (76%), indicating determination of this feature is learning fastest.
- **Healthy** classes are strictly underfitting, likely due to class imbalance or "difficulty" of feature extraction in early epochs.

## 3. Confusion Matrix

The confusion matrix visualizes the model's prediction distribution.
*(See `backend/models/confusion_matrix.png` for visual artifact)*

## 4. Confidence Safeguards

To mitigate risks from current low accuracy, the following safeguards are active in `v2`:
- **Threshold**: Predictions with confidence `< 60%` are flagged.
- **Action**: Chemical recommendations are **suppressed** for low-confidence results.
- **Explanation**: User sees a "Low Confidence" warning.

## 5. Next Steps for Accuracy
1.  **Extended Training**: Increase epochs from 5 → 50.
2.  **Unfreezing**: Unfreeze more layers of MobileNetV2 (currently top 20).
3.  **Class Balancing**: Apply weighted loss for underperforming classes.
