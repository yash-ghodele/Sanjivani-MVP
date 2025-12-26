"""
Unit Tests for Knowledge Engine
Tests disease information retrieval and mapping logic
"""
import unittest
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from knowledge.knowledge_engine import KnowledgeEngine


class TestKnowledgeEngine(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Set up knowledge engine once for all tests"""
        cls.engine = KnowledgeEngine()
    
    def test_engine_initialization(self):
        """Test that engine initializes correctly"""
        self.assertIsNotNone(self.engine)
        self.assertIsInstance(self.engine.knowledge_db, dict)
    
    def test_get_disease_info(self):
        """Test disease information retrieval"""
        info = self.engine.get_disease_info("Early_Blight")
        
        if info:  # If knowledge base is loaded
            self.assertIn('severity', info)
            self.assertIn('symptoms', info)
            self.assertIn('recommended_actions', info)
            self.assertIn('explanation', info)
    
    def test_get_severity(self):
        """Test severity level retrieval"""
        severity = self.engine.get_severity("Late_Blight")
        self.assertIsInstance(severity, str)
    
    def test_get_recommended_actions(self):
        """Test treatment recommendations"""
        actions = self.engine.get_recommended_actions("Early_Blight")
        
        self.assertIn('immediate', actions)
        self.assertIn('short_term', actions)
        self.assertIn('preventive', actions)
        
        self.assertIsInstance(actions['immediate'], list)
        self.assertIsInstance(actions['short_term'], list)
        self.assertIsInstance(actions['preventive'], list)
    
    def test_map_prediction_to_response(self):
        """Test mapping AI prediction to full response"""
        response = self.engine.map_prediction_to_response(
            crop="Tomato",
            disease_key="Early_Blight",
            confidence=0.94,
            language="en"
        )
        
        # Check required fields
        self.assertIn('crop', response)
        self.assertIn('disease', response)
        self.assertIn('confidence', response)
        self.assertIn('severity', response)
        self.assertIn('explanation', response)
        self.assertIn('recommended_actions', response)
        
        # Check types
        self.assertEqual(response['crop'], "Tomato")
        self.assertEqual(response['confidence'], 0.94)
        self.assertIsInstance(response['recommended_actions'], dict)
    
    def test_get_all_diseases(self):
        """Test retrieving all disease keys"""
        diseases = self.engine.get_all_diseases()
        self.assertIsInstance(diseases, list)
    
    def test_knowledge_version(self):
        """Test version retrieval"""
        version = self.engine.get_knowledge_version()
        self.assertIsInstance(version, str)
    
    def test_multilingual_support(self):
        """Test multilingual disease names"""
        response_en = self.engine.get_disease_info("Early_Blight", language="en")
        response_hi = self.engine.get_disease_info("Early_Blight", language="hi")
        
        if response_en and response_hi and "multilingual" in response_en:
            # Hindi version should have localized name
            self.assertIn('name_localized', response_hi)
    
    def test_unknown_disease(self):
        """Test handling of unknown disease"""
        response = self.engine.map_prediction_to_response(
            crop="Unknown",
            disease_key="Unknown_Disease",
            confidence=0.5
        )
        
        # Should still return valid structure
        self.assertIn('disease', response)
        self.assertIn('recommended_actions', response)


if __name__ == '__main__':
    unittest.main()
