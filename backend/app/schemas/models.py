"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional


# ── Food Analysis ──────────────────────────────────────────────
class NutritionInfo(BaseModel):
    calories: float = 0
    protein_g: float = 0
    carbs_g: float = 0
    fat_g: float = 0
    fiber_g: float = 0


class FoodAnalysisResponse(BaseModel):
    food_name: str
    description: Optional[str] = None
    confidence: Optional[float] = None          # 0-1, only when model provides it
    alternatives: list[str] = []
    nutrition: NutritionInfo = NutritionInfo()
    tags: list[str] = []
    raw_analysis: Optional[str] = None
    is_demo: bool = False


# ── Freshness Detection ────────────────────────────────────────
class FreshnessIndicator(BaseModel):
    label: str
    score: int  # 0-100


class FreshnessResponse(BaseModel):
    freshness_score: int            # 0-100
    assessment: str
    indicators: list[FreshnessIndicator] = []
    reasons: list[str] = []
    uncertainty: Optional[str] = None
    is_demo: bool = False


# ── Meal Planner ──────────────────────────────────────────────
class MealPlanRequest(BaseModel):
    diet: str = Field(default="vegetarian", description="vegetarian | vegan | eggetarian | non-vegetarian")
    calorie_goal: int = Field(default=2000, ge=800, le=5000)
    budget_inr: int = Field(default=500, ge=50, le=10000)
    meal_count: int = Field(default=3, ge=2, le=6)
    allergens: list[str] = []
    avoid_ingredients: list[str] = []


class ShoppingItem(BaseModel):
    name: str
    quantity: str = "as needed"


class MealItem(BaseModel):
    slot: str                       # breakfast | lunch | dinner | morning_snack | …
    name: str
    description: str
    calories: int
    ingredients: list[str] = []
    prep_time: Optional[str] = None
    cost: Optional[int] = None      # approximate cost in INR


class NutritionTotals(BaseModel):
    calories: int = 0
    protein_g: float = 0
    carbs_g: float = 0
    fat_g: float = 0


class MealPlanResponse(BaseModel):
    meals: list[MealItem]
    nutrition_totals: NutritionTotals = NutritionTotals()
    shopping_list: list[ShoppingItem] = []
    nutrition_notes: Optional[str] = None
    is_demo: bool = False


# ── Health ────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    version: str
    demo_mode: bool
    ai_configured: bool
