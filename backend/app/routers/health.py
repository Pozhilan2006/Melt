from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="", tags=["Health"])


@router.get("/health", summary="API Health Check")
def health_check():
    """Confirms backend service health and project configuration."""
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "api_v1": settings.API_V1_STR,
    }
