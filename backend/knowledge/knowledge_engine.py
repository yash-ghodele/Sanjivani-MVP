"""
Knowledge Engine for SANJIVANI 2.0
Handles disease information queries and treatment recommendations
Completely deterministic - no AI/LLM logic here
"""
import json
from pathlib import Path
from typing import Dict, Optional, List


class KnowledgeEngine:
    """
    Query and retrieve disease information from knowledge database
    Maps AI predictions to actionable treatment recommendations
    """
    
    def __init__(self, knowledge_path: Optional[str] = None):
        # Robust path handling
        default_path = "knowledge/disease_knowledge.json"
        if not Path(default_path).exists():
            default_path = "backend/knowledge/disease_knowledge.json"
            
        self.knowledge_path = knowledge_path or default_path
        self.knowledge_db = {}
        self.version = "unknown"
        self.load_knowledge_base()
    
    def load_knowledge_base(self):
        """Load disease knowledge from JSON file"""
        try:
            kb_file = Path(self.knowledge_path)
            if kb_file.exists():
                with open(kb_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.knowledge_db = data.get("diseases", {})
                    self.version = data.get("version", "unknown")
                    print(f"✅ Knowledge base v{self.version} loaded successfully")
            else:
                print(f"⚠️ Knowledge base not found at {self.knowledge_path}")
        except Exception as e:
            print(f"❌ Error loading knowledge base: {e}")
    
    def get_disease_info(self, disease_key: str, language: str = "en") -> Optional[Dict]:
        """
        Get complete disease information
        
        Args:
            disease_key: Disease identifier (e.g., "Early_Blight")
            language: Language code (en, hi, mr)
            
        Returns:
            Complete disease information dict or None if not found
        """
        disease_info = self.knowledge_db.get(disease_key)
        
        if not disease_info:
            return None
        
        # Clone to avoid modifying original
        info = disease_info.copy()
        
        # Add multilingual name if requested
        if language != "en" and "multilingual" in info:
            lang_data = info["multilingual"].get(language, {})
            if "name" in lang_data:
                info["name_localized"] = lang_data["name"]
        
        return info
    
    def get_severity(self, disease_key: str) -> str:
        """Get disease severity level"""
        info = self.get_disease_info(disease_key)
        return info.get("severity", "Unknown") if info else "Unknown"
    
    def get_recommended_actions(self, disease_key: str) -> Dict[str, List[str]]:
        """Get treatment recommendations by category"""
        info = self.get_disease_info(disease_key)
        if not info:
            return {
                "immediate": ["Contact agricultural extension officer"],
                "short_term": ["Monitor plant closely"],
                "preventive": ["Practice good field hygiene"]
            }
        return info.get("recommended_actions", {})
    
    def get_explanation(self, disease_key: str) -> str:
        """Get disease explanation for farmers"""
        info = self.get_disease_info(disease_key)
        return info.get("explanation", "No information available") if info else "Disease information not found"
    
    def get_symptoms(self, disease_key: str) -> List[str]:
        """Get list of disease symptoms"""
        info = self.get_disease_info(disease_key)
        return info.get("symptoms", []) if info else []
    
    def get_economic_impact(self, disease_key: str) -> str:
        """Get economic impact description"""
        info = self.get_disease_info(disease_key)
        return info.get("economic_impact", "Impact unknown") if info else "Impact unknown"
    
    def map_prediction_to_response(
        self, 
        crop: str, 
        disease_key: str, 
        confidence: float,
        language: str = "en"
    ) -> Dict:
        """
        Map AI prediction to complete structured response
        
        Args:
            crop: Crop name from AI
            disease_key: Disease identifier from AI
            confidence: Confidence score from AI
            language: Target language
            
        Returns:
            Complete API response structure
        """
        # Get disease information
        disease_info = self.get_disease_info(disease_key, language)
        
        if not disease_info:
            # Fallback for unknown disease
            return {
                "crop": crop,
                "disease": disease_key.replace("_", " ").title(),
                "confidence": confidence,
                "severity": "Unknown",
                "explanation": "Disease information not available in database.",
                "recommended_actions": {
                    "immediate": ["Contact agricultural extension officer"],
                    "short_term": ["Document symptoms with photos"],
                    "preventive": ["Monitor plant health"]
                }
            }
        
        # Determine severity color/level
        severity = disease_info["severity"]
        
        # Build structured response
        response = {
            "crop": crop,
            "disease": disease_key.replace("_", " ").title(),
            "disease_key": disease_key,
            "confidence": confidence,
            "severity": severity,
            "explanation": disease_info["explanation"],
            "recommended_actions": disease_info["recommended_actions"],
            "symptoms": disease_info.get("symptoms", []),
            "economic_impact": disease_info.get("economic_impact", ""),
            "scientific_name": disease_info.get("scientific_name", "")
        }
        
        # Add localized name if available
        if language != "en" and "name_localized" in disease_info:
            response["disease_localized"] = disease_info["name_localized"]
        
        return response
    
    def get_all_diseases(self) -> List[str]:
        """Get list of all known diseases"""
        return list(self.knowledge_db.keys())
    
    def get_knowledge_version(self) -> str:
        """Get knowledge base version"""
        return self.version


# Global instance
_knowledge_engine = None

def get_knowledge_engine() -> KnowledgeEngine:
    """Get or create global knowledge engine instance"""
    global _knowledge_engine
    if _knowledge_engine is None:
        _knowledge_engine = KnowledgeEngine()
    return _knowledge_engine
