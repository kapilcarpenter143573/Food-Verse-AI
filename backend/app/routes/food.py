"""
Food analysis routes:
  POST /api/food/analyze   – food recognition & nutrition
  POST /api/food/freshness – freshness & spoilage detection
"""

import logging
from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.config import settings
from app.schemas.models import FoodAnalysisResponse, FreshnessResponse, NutritionInfo
from app.services import gemini_service, demo_data

logger = logging.getLogger(__name__)
router = APIRouter()


def _validate_image(file: UploadFile) -> None:
    """Raise HTTPException if the uploaded file is not an accepted image type or too large."""
    if file.content_type not in settings.allowed_types_list:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type '{file.content_type}'. "
                   f"Accepted: {', '.join(settings.allowed_types_list)}",
        )


async def _read_and_validate(file: UploadFile) -> bytes:
    """Read the file bytes and enforce size limit."""
    _validate_image(file)
    data = await file.read()
    if len(data) > settings.max_file_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {settings.MAX_FILE_SIZE_MB} MB.",
        )
    return data


# ── POST /api/food/analyze ─────────────────────────────────────
@router.post(
    "/analyze",
    response_model=FoodAnalysisResponse,
    summary="Identify food and estimate nutrition",
    description=(
        "Upload a food image. Returns the predicted food name, confidence (if supported), "
        "estimated nutrition, and tags. "
        "When no AI provider is configured the response is clearly marked is_demo=true."
    ),
)
async def analyze_food(
    image: UploadFile = File(..., description="JPEG, PNG or WebP food image"),
    serving_size: float = Form(default=1.0, ge=0.1, le=10.0, description="Serving size multiplier"),
):
    image_bytes = await _read_and_validate(image)

    if settings.is_ai_configured:
        result = await gemini_service.analyze_food(image_bytes)
        if result is None:
            logger.warning("Gemini returned None – falling back to demo data")
            result = demo_data.get_demo_food_analysis()
    else:
        result = demo_data.get_demo_food_analysis()

    # Normalise the result into the response schema
    nutrition_raw = result.get("nutrition", {})
    nutrition = NutritionInfo(
        calories  = nutrition_raw.get("calories",   0),
        protein_g = nutrition_raw.get("protein_g",  0),
        carbs_g   = nutrition_raw.get("carbs_g",    0),
        fat_g     = nutrition_raw.get("fat_g",      0),
        fiber_g   = nutrition_raw.get("fiber_g",    0),
    )

    return FoodAnalysisResponse(
        food_name    = result.get("food_name", "Unknown"),
        description  = result.get("description"),
        confidence   = result.get("confidence"),
        alternatives = result.get("alternatives", []),
        nutrition    = nutrition,
        tags         = result.get("tags", []),
        raw_analysis = result.get("raw_analysis"),
        is_demo      = result.get("is_demo", False),
    )


# ── POST /api/food/freshness ───────────────────────────────────
@router.post(
    "/freshness",
    response_model=FreshnessResponse,
    summary="Assess visual freshness of food",
    description=(
        "Upload a food image to receive a visual freshness assessment. "
        "Results are for guidance only – image analysis cannot determine food safety. "
        "Demo mode returns clearly labelled sample data."
    ),
)
async def analyze_freshness(
    image: UploadFile = File(..., description="JPEG, PNG or WebP food image"),
    food_type: str = Form(default="", description="Optional hint about the food type"),
):
    image_bytes = await _read_and_validate(image)

    if settings.is_ai_configured:
        result = await gemini_service.analyze_freshness(image_bytes, food_type)
        if result is None:
            logger.warning("Gemini freshness returned None – falling back to demo data")
            result = demo_data.get_demo_freshness()
    else:
        result = demo_data.get_demo_freshness()

    from app.schemas.models import FreshnessIndicator
    indicators = [
        FreshnessIndicator(label=ind.get("label", ""), score=ind.get("score", 50))
        for ind in result.get("indicators", [])
    ]

    return FreshnessResponse(
        freshness_score = int(result.get("freshness_score", 50)),
        assessment      = result.get("assessment", "Assessment unavailable."),
        indicators      = indicators,
        reasons         = result.get("reasons", []),
        uncertainty     = result.get("uncertainty"),
        is_demo         = result.get("is_demo", False),
    )
