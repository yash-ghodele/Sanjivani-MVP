"""
AI-Powered Search Endpoint
Uses Gemini 1.5 Flash to answer natural language queries about crop diseases.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
import google.generativeai as genai

router = APIRouter()

# Configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

class SearchQuery(BaseModel):
    query: str
    language: str = "en"

class DiseaseMatch(BaseModel):
    id: str
    name: str
    relevance: str

class SearchResponse(BaseModel):
    answer: str
    matches: List[DiseaseMatch]
    suggestions: List[str]
    provider: str

@router.post("/search/ai", response_model=SearchResponse)
async def ai_search(request: SearchQuery):
    """
    AI-powered search using Gemini 1.5 Flash.
    Returns a conversational answer and structured disease matches.
    """
    if not API_KEY:
        raise HTTPException(
            status_code=503,
            detail="AI search is currently unavailable. Please configure GEMINI_API_KEY environment variable."
        )
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""You are an agricultural disease expert helping farmers.
        
User Query: "{request.query}"

Task: Provide a helpful, conversational answer about this crop disease/symptom query.

Format your response EXACTLY as JSON:
{{
    "answer": "A clear, helpful 2-3 sentence answer in simple farmer-friendly language",
    "matches": [
        {{"id": "disease_slug", "name": "Disease Name", "relevance": "High/Medium/Low"}},
        {{"id": "another_disease", "name": "Another Disease", "relevance": "Medium"}}
    ],
    "suggestions": ["Follow-up question 1?", "Follow-up question 2?"]
}}

Guidelines:
- Be concise and practical
- Focus on identification and basic organic remedies
- Return 1-3 disease matches maximum
- Suggest 2 helpful follow-up questions
- Language: {request.language}
"""
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Parse JSON response
        import json
        # Handle markdown code blocks if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        
        data = json.loads(text)
        
        return SearchResponse(
            answer=data.get("answer", "I couldn't find specific information about that."),
            matches=[DiseaseMatch(**m) for m in data.get("matches", [])],
            suggestions=data.get("suggestions", []),
            provider="Gemini 1.5 Flash"
        )
        
    except json.JSONDecodeError:
        # Fallback if Gemini doesn't return valid JSON
        return SearchResponse(
            answer=response.text.strip() if response else "Unable to process query.",
            matches=[],
            suggestions=["Try searching for specific symptoms", "Describe the affected plant part"],
            provider="Gemini 1.5 Flash (Raw)"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI search failed: {str(e)}")
