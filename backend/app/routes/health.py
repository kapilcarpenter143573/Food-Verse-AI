"""Health check endpoint."""

from fastapi import APIRouter
from app.config import settings
from app.schemas.models import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse, summary="API health check")
async def health():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        demo_mode=not settings.is_ai_configured,
        ai_configured=settings.is_ai_configured,
    )
