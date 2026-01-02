import { RecommendedActions, PredictionMetadata, PredictionResponse } from './api';

export interface GeminiAnalysisResponse {
    explanation: string;
    recommended_actions: {
        immediate: string[];
        short_term: string[];
        preventive: string[];
    };
    economic_impact: string;
    symptoms: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getGeminiAnalysis(
    crop: string,
    disease: string,
    confidence: number
): Promise<GeminiAnalysisResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v2/ai/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                crop,
                disease,
                confidence
            }),
        });

        if (!response.ok) {
            throw new Error('AI analysis failed');
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
