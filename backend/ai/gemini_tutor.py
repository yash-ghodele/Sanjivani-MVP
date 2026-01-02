"""
Gemini Tutor Module
Provides "Explain Why" functionality using Google's Gemini 1.5 Flash model.
Acts as a responsible educational layer, not a doctor.
"""
import os
import google.generativeai as genai
from typing import Optional

# Configure API Key
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def get_explanation(disease_name: str, confidence: float, crop_name: str, language: str = "en") -> str:
    """
    Asks Gemini to explain a diagnosis in simple terms.
    """
    if not API_KEY:
        return "Gemini API Key not configured. (Mock Explanation: This looks like Early Blight because of the concentric rings on the leaves.)"

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        You are an expert agricultural tutor. A farmer has scanned a {crop_name} plant.
        The AI system detected '{disease_name}' with {confidence*100:.1f}% confidence.
        
        Task: Explain WHY this diagnosis is likely correct and provide 1 simple, organic tip.
        Constraints:
        - Be concise (max 3 sentences).
        - Use simple language suitable for a farmer.
        - Do NOT prescribe chemical medication (leave that to the main system).
        - Output in {language} language.
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "Unable to generate explanation at this time. Please consult the standard treatment guide."
