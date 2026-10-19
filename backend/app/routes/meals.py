"""
Meal planner routes:
  POST /api/meals/plan – generate a personalised one-day meal plan
"""

import logging
from fastapi import APIRouter, HTTPException

from app.config import settings
from app.schemas.models import MealPlanRequest, MealPlanResponse, MealItem, ShoppingItem, NutritionTotals
from app.services import gemini_service, demo_data

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/plan",
    response_model=MealPlanResponse,
    summary="Generate a personalised meal plan",
    description=(
        "Accepts dietary preferences, calorie goal, budget, and allergen restrictions. "
        "Returns a structured one-day meal plan with shopping list. "
        "Demo mode returns clearly labelled sample data that does NOT respect allergen restrictions fully."
    ),
)
async def generate_meal_plan(request: MealPlanRequest):
    if settings.is_ai_configured:
        result = await gemini_service.generate_meal_plan(
            diet              = request.diet,
            calorie_goal      = request.calorie_goal,
            budget_inr        = request.budget_inr,
            meal_count        = request.meal_count,
            allergens         = request.allergens,
            avoid_ingredients = request.avoid_ingredients,
        )
        if result is None:
            logger.warning("Gemini meal plan returned None – falling back to demo data")
            result = demo_data.get_demo_meal_plan(request.diet, request.allergens, request.avoid_ingredients)
    else:
        result = demo_data.get_demo_meal_plan(request.diet, request.allergens, request.avoid_ingredients)

    # Normalise
    meals_raw = result.get("meals", [])
    meals = [
        MealItem(
            slot        = m.get("slot", "meal"),
            name        = m.get("name", ""),
            description = m.get("description", ""),
            calories    = int(m.get("calories", 0)),
            ingredients = m.get("ingredients", []),
            prep_time   = m.get("prep_time"),
            cost        = m.get("cost"),
        )
        for m in meals_raw
    ]

    nt_raw = result.get("nutrition_totals", {})
    nutrition_totals = NutritionTotals(
        calories  = int(nt_raw.get("calories",  0)),
        protein_g = float(nt_raw.get("protein_g", 0)),
        carbs_g   = float(nt_raw.get("carbs_g",   0)),
        fat_g     = float(nt_raw.get("fat_g",     0)),
    )

    shopping_list = [
        ShoppingItem(name=s.get("name", ""), quantity=s.get("quantity", "as needed"))
        for s in result.get("shopping_list", [])
    ]

    return MealPlanResponse(
        meals            = meals,
        nutrition_totals = nutrition_totals,
        shopping_list    = shopping_list,
        nutrition_notes  = result.get("nutrition_notes"),
        is_demo          = result.get("is_demo", False),
    )
