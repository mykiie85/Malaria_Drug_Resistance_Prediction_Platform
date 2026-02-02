"""Health check endpoints."""
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "message": "Malaria Drug Resistance API is running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }
