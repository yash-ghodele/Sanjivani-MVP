"""
API v2 Model Metrics and Health Endpoints
"""
from fastapi import APIRouter
import json
from pathlib import Path

from schemas.prediction import ModelMetrics, HealthCheckResponse, PerformanceStats
from ai.inference_engine import get_inference_engine
from knowledge.knowledge_engine import get_knowledge_engine

router = APIRouter(prefix="/api/v2", tags=["metrics-v2"])


@router.get("/model/metrics", response_model=ModelMetrics)
async def get_model_metrics():
    """
    Get model performance benchmarks and metadata
    
    Shows:
    - Model version and architecture
    - Training accuracy/precision/recall
    - Model size
    - Average inference time
    - Training date
    """
    try:
        # Robust path handling
        metadata_path = Path("models/model_metadata.json")
        if not metadata_path.exists():
            metadata_path = Path("backend/models/model_metadata.json")
        
        if metadata_path.exists():
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
        else:
            # Return basic info if metadata not available
            inference_engine = get_inference_engine()
            model_info = inference_engine.get_model_info()
            metadata = {
                "version": "2.0.0",
                "architecture": "MobileNetV2",
                "num_classes": model_info.get("class_count", 10)
            }
        
        return ModelMetrics(**metadata)
        
    except Exception as e:
        # Return minimal metadata on error
        return ModelMetrics(
            version="2.0.0",
            architecture="MobileNetV2",
            num_classes=10
        )


@router.get("/model/performance", response_model=PerformanceStats)
async def get_performance_stats():
    """
    Get real-time model performance statistics
    
    Tracks:
    - Total number of inferences
    - Average inference time
    - Min/max inference times
    - Standard deviation
    """
    inference_engine = get_inference_engine()
    stats = inference_engine.get_performance_stats()
    
    if "message" in stats:
        # No inferences yet
        return PerformanceStats(
            total_inferences=0,
            avg_inference_ms=0,
            min_inference_ms=0,
            max_inference_ms=0,
            std_inference_ms=0
        )
    
    return PerformanceStats(**stats)


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    API health check endpoint
    
    Returns:
    - Overall system status
    - Model loaded status
    - Knowledge base status
    - Version information
    - Runtime statistics
    """
    inference_engine = get_inference_engine()
    knowledge_engine = get_knowledge_engine()
    
    # Check model status
    model_info = inference_engine.get_model_info()
    model_loaded = model_info.get("loaded", False)
    
    # Check knowledge base
    kb_version = knowledge_engine.get_knowledge_version()
    kb_loaded = kb_version != "unknown"
    
    # Get performance stats
    perf_stats = inference_engine.get_performance_stats()
    total_inferences = perf_stats.get("total_inferences", 0)
    avg_inference_ms = perf_stats.get("avg_inference_ms")
    
    # Determine overall status
    if model_loaded and kb_loaded:
        status = "healthy"
    elif model_loaded or kb_loaded:
        status = "degraded"
    else:
        status = "unhealthy"
    
    return HealthCheckResponse(
        status=status,
        model_loaded=model_loaded,
        knowledge_base_loaded=kb_loaded,
        knowledge_version=kb_version,
        model_version=model_info.get("metadata", {}).get("version", "2.0.0"),
        total_inferences=total_inferences,
        avg_inference_ms=avg_inference_ms
    )
