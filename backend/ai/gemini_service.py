import os
import google.generativeai as genai
from typing import Dict, List, Optional
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiService:
    """Service for interacting with Google's Gemini AI"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        else:
            logger.warning("GEMINI_API_KEY not found. Gemini service disabled.")
            self.model = None

    def generate_disease_analysis(self, crop: str, disease: str, confidence: float) -> Dict:
        """
        Generate detailed disease analysis using Gemini
        
        Returns:
            Dict containing explanation, treatment plan, and economic impact
        """
        if not self.model:
            return None

        prompt = f"""
        You are an expert agricultural plant pathologist. 
        A farmer has scanned a {crop} plant detecting '{disease}' with {confidence*100:.1f}% confidence.
        
        Provide a detailed JSON response with the following structure:
        {{
            "explanation": "Detailed explanation of what this disease is, how it spreads, and why it's harmful, in simple terms for a farmer.",
            "recommended_actions": {{
                "immediate": ["List of 2-3 immediate actions to take"],
                "short_term": ["List of 2-3 short term treatments (sprays, pruning)"],
                "preventive": ["List of 2-3 preventive measures for future"]
            }},
            "economic_impact": "Brief description of potential yield loss and economic impact if untreated.",
            "symptoms": ["List of 3-4 key visual symptoms to look for to confirm diagnosis"]
        }}
        
        Keep the tone professional yet accessible to a farmer.
        Ensure the output is valid JSON. Do not include markdown formatting like ```json.
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            # Clean up markdown if present
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            return json.loads(text)
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return None

# Global instance
_gemini_service = None

def get_gemini_service() -> GeminiService:
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
