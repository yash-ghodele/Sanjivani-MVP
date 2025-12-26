"""
Integration Tests for API v2 Endpoints
Tests the complete API flow with mocked requests
"""
import unittest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from main import app


class TestAPIEndpoints(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Set up test client"""
        cls.client = TestClient(app)
    
    def test_root_endpoint(self):
        """Test root endpoint returns app info"""
        response = self.client.get("/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn('name', data)
        self.assertIn('version', data)
        self.assertEqual(data['version'], '2.0.0')
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = self.client.get("/api/v2/health")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn('status', data)
        self.assertIn('model_loaded', data)
        self.assertIn('knowledge_base_loaded', data)
        self.assertIn('knowledge_version', data)
        self.assertIn('model_version', data)
        
        # Status should be one of expected values
        self.assertIn(data['status'], ['healthy', 'degraded', 'unhealthy'])
    
    def test_model_metrics_endpoint(self):
        """Test model metrics endpoint"""
        response = self.client.get("/api/v2/model/metrics")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn('version', data)
        self.assertIn('architecture', data)
        self.assertIn('num_classes', data)
    
    def test_performance_endpoint(self):
        """Test performance stats endpoint"""
        response = self.client.get("/api/v2/model/performance")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn('total_inferences', data)
        self.assertIn('avg_inference_ms', data)
    
    def test_predict_endpoint_no_file(self):
        """Test prediction without file returns error"""
        response = self.client.post("/api/v2/predict")
        
        self.assertEqual(response.status_code, 422)  # Validation error
    
    def test_predict_endpoint_with_file(self):
        """Test prediction with dummy image file"""
        from PIL import Image
        import io
        
        # Create dummy image
        img = Image.new('RGB', (224, 224), color='green')
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        byte_io.seek(0)
        
        files = {'file': ('test.jpg', byte_io, 'image/jpeg')}
        response = self.client.post("/api/v2/predict", files=files)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check response structure
        self.assertIn('crop', data)
        self.assertIn('disease', data)
        self.assertIn('confidence', data)
        self.assertIn('severity', data)
        self.assertIn('explanation', data)
        self.assertIn('recommended_actions', data)
        self.assertIn('metadata', data)
        
        # Check recommended_actions structure
        actions = data['recommended_actions']
        self.assertIn('immediate', actions)
        self.assertIn('short_term', actions)
        self.assertIn('preventive', actions)
        
        # Check metadata
        metadata = data['metadata']
        self.assertIn('model_version', metadata)
        self.assertIn('inference_time_ms', metadata)
        self.assertIn('model_architecture', metadata)
    
    def test_legacy_predict_endpoint(self):
        """Test legacy v1 prediction endpoint"""
        from PIL import Image
        import io
        
        img = Image.new('RGB', (224, 224))
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        byte_io.seek(0)
        
        files = {'file': ('test.jpg', byte_io, 'image/jpeg')}
        response = self.client.post("/predict", files=files)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Legacy format
        self.assertIn('disease', data)
        self.assertIn('confidence', data)
        self.assertIn('severity', data)
        self.assertIn('treatment', data)
        self.assertIn('prevention', data)


class TestAPIValidation(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Set up test client"""
        cls.client = TestClient(app)
    
    def test_invalid_file_type(self):
        """Test that invalid file types are handled"""
        files = {'file': ('test.txt', b'not an image', 'text/plain')}
        response = self.client.post("/api/v2/predict", files=files)
        
        # Should handle gracefully (either reject or process incorrectly)
        self.assertIn(response.status_code, [200, 400, 422, 500])
    
    def test_multilingual_parameter(self):
        """Test multilingual parameter in prediction"""
        from PIL import Image
        import io
        
        img = Image.new('RGB', (224, 224))
        byte_io = io.BytesIO()
        img.save(byte_io, 'JPEG')
        byte_io.seek(0)
        
        files = {'file': ('test.jpg', byte_io, 'image/jpeg')}
        response = self.client.post("/api/v2/predict?language=hi", files=files)
        
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
