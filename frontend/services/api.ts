export interface RecommendedActions {
    immediate: string[];
    short_term: string[];
    preventive: string[];
}

export interface PredictionMetadata {
    model_version: string;
    inference_time_ms: number;
    visual_features?: string[];
}

export interface PredictionResponse {
    crop: string;
    disease: string;
    confidence: number;
    severity: "Low" | "Moderate" | "High" | "Critical";
    explanation: string;
    recommended_actions: RecommendedActions;
    metadata: PredictionMetadata;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeCropImage(imageFile: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Prediction failed: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch (error) {
        console.warn("Backend Unreachable:", error);
        return false;
    }
}
