# ⚠️ Failure Modes & Fallback Strategies

To ensure system reliability and safety, **Sanjivani 2.0** has defined specific behaviors for known failure scenarios. This document outlines how the system degrades gracefully under suboptimal conditions.

## 1. Out-of-Distribution (OOD) Inputs
**Scenario**: User uploads an image of a non-target crop (e.g., Wheat) or a non-plant object (e.g., a tractor).
*   **Current Behavior**: The model attempts to map the image to one of the 7 known classes (Tomato/Potato varieties), likely resulting in a low-confidence prediction.
*   **Mitigation**:
    *   **Confidence Thresholding**: Predictions below **45%** confidence are flagged as "Uncertain".
    *   **User Warning**: The UI displays a "Low Confidence" alert advising the user to verify the crop type.
*   **Planned Improvement**: Implementation of a binary "Plant/Not-Plant" classifier or an anomaly detection layer filter upstream of the main inference engine.

## 2. Poor Image Quality
**Scenario**: Images with extreme backlighting, motion blur, or low resolution.
*   **Model Response**: High noise typically flattens the softmax output distribution.
*   **System Action**:
    *   If confidence < threshold, fallback to `inconclusive_result` state.
    *   Frontend prompts user to **"Retake Photo"** with specific guidance (e.g., "Ensure steady lighting").

## 3. Ambiguous / Mixed Symptoms
**Scenario**: A leaf showing signs of multiple diseases (e.g., Early Blight + Pest Damage).
*   **Model Limitation**: The current MobileNetV2 architecture is a **multi-class** (single label), not **multi-label** classifier. It will predict the dominant visual feature.
*   **Safety Net**:
    *   **Gemini Validation**: The Generative AI layer is prompted to identify "secondary symptoms" in its explanation, providing a textual cross-check against the deterministic single-label prediction.

## 4. Network / API Failures
**Scenario**: Backend API is unreachable or Gemini API rate limits are exceeded.
*   **Backend Fallback**:
    *   If Gemini fails: The system returns the **Deterministic Diagnosis** only. The "AI Analysis" section in the UI is replaced with a standard "Analysis Unavailable" message, preserving the core functionality.
*   **Frontend Fallback**:
    *   Offline Mode: Currently displays a generic connection error. (See Roadmap for IndexedDB caching strategy).

## 5. False Positives (High Confidence Errors)
**Scenario**: Model confidently predicts "Late Blight" on a healthy leaf due to a similar visual artifact (e.g., dirt/shadow).
*   **Safety Layer**:
    *   **Severity Gating**: High-severity treatments (chemical fungicides) are gated behind strict verification warnings ("Consult an expert before application").
    *   **Disclaimer**: Every result includes a mandatory disclaimer that AI results are advisory only.
