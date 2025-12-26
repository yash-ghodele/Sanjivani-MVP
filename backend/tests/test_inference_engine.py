"""
Unit Tests for AI Inference Engine
Tests model loading, preprocessing, and prediction logic
"""
import unittest
import numpy as np
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent))

from ai.inference_engine import InferenceEngine
from ai.dataset_config import CLASS_NAMES, MODEL_CONFIG


class TestInferenceEngine(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Set up inference engine once for all tests"""
        cls.engine = InferenceEngine()
    
    def test_engine_initialization(self):
        """Test that engine initializes correctly"""
        self.assertIsNotNone(self.engine)
        self.assertEqual(len(self.engine.inference_times), 0)
    
    def test_model_config(self):
        """Test model configuration is correct"""
        self.assertEqual(MODEL_CONFIG["num_classes"], len(CLASS_NAMES))
        self.assertEqual(MODEL_CONFIG["input_size"], (224, 224, 3))
    
    def test_preprocessing(self):
        """Test image preprocessing pipeline"""
        # Create dummy image bytes
        from PIL import Image
        import io
        
        img = Image.new('RGB', (500, 500), color='red')
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        img_bytes = byte_io.getvalue()
        
        # Preprocess
        processed = self.engine.preprocess_image(img_bytes)
        
        # Check shape
        self.assertEqual(processed.shape, (1, 224, 224, 3))
        
        # Check normalization (should be [0, 1])
        self.assertTrue(np.all(processed >= 0))
        self.assertTrue(np.all(processed <= 1))
    
    def test_prediction_structure(self):
        """Test that prediction returns correct structure"""
        # Create dummy image
        from PIL import Image
        import io
        
        img = Image.new('RGB', (300, 300), color='green')
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        img_bytes = byte_io.getvalue()
        
        # Get prediction
        result = self.engine.predict(img_bytes)
        
        # Check structure
        self.assertIn('crop', result)
        self.assertIn('disease', result)
        self.assertIn('disease_key', result)
        self.assertIn('confidence', result)
        self.assertIn('metadata', result)
        
        # Check types
        self.assertIsInstance(result['crop'], str)
        self.assertIsInstance(result['disease'], str)
        self.assertIsInstance(result['confidence'], float)
        
        # Check metadata
        metadata = result['metadata']
        self.assertIn('model_version', metadata)
        self.assertIn('inference_time_ms', metadata)
        self.assertIn('model_architecture', metadata)
    
    def test_confidence_range(self):
        """Test that confidence is in valid range"""
        from PIL import Image
        import io
        
        img = Image.new('RGB', (224, 224))
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        img_bytes = byte_io.getvalue()
        
        result = self.engine.predict(img_bytes)
        confidence = result['confidence']
        
        self.assertGreaterEqual(confidence, 0.0)
        self.assertLessEqual(confidence, 1.0)
    
    def test_performance_tracking(self):
        """Test that performance is tracked"""
        from PIL import Image
        import io
        
        img = Image.new('RGB', (224, 224))
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        img_bytes = byte_io.getvalue()
        
        initial_count = len(self.engine.inference_times)
        self.engine.predict(img_bytes)
        
        self.assertEqual(len(self.engine.inference_times), initial_count + 1)
    
    def test_get_performance_stats(self):
        """Test performance statistics calculation"""
        stats = self.engine.get_performance_stats()
        
        if stats.get("total_inferences", 0) > 0:
            self.assertIn('avg_inference_ms', stats)
            self.assertIn('min_inference_ms', stats)
            self.assertIn('max_inference_ms', stats)
            self.assertIn('std_inference_ms', stats)
    
    def test_model_info(self):
        """Test model information retrieval"""
        info = self.engine.get_model_info()
        
        self.assertIn('loaded', info)
        self.assertIn('model_path', info)
        self.assertIn('class_count', info)
        self.assertIn('classes', info)
        
        self.assertEqual(info['class_count'], len(CLASS_NAMES))
        self.assertEqual(info['classes'], CLASS_NAMES)


if __name__ == '__main__':
    unittest.main()
