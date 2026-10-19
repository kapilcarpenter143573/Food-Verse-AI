"""
Gemini AI service – wraps the google-generativeai SDK.

Design principles:
- All credentials come from the Settings object (environment variables).
- If credentials are missing or DEMO_MODE is enabled this module returns None
  so the route can fall back to demo data.
- Prompts are designed to elicit structured JSON responses.
"""

import json
import logging
import re
from io import BytesIO
from typing import Optional

from PIL import Image

from app.config import settings

logger = logging.getLogger(__name__)


def _get_model():
    """Return a configured GenerativeModel, or None if not available."""
    if not settings.is_ai_configured:
        return None
    try:
        import google.generativeai as genai  # imported lazily so the app works without the SDK
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        return genai.GenerativeModel(settings.GEMINI_MODEL)
    except Exception as exc:
        logger.warning("Could not initialise Gemini model: %s", exc)
        return None


def _prepare_image(image_bytes: bytes) -> "Image.Image":
    """Convert raw bytes to a PIL Image, normalise orientation."""
    img = Image.open(BytesIO(image_bytes))
    # Convert to RGB so all formats are consistent
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    # Resize if very large to keep prompt tokens reasonable
    max_px = 1024
    if max(img.size) > max_px:
        img.thumbnail((max_px, max_px), Image.LANCZOS)
    return img


def _extract_json(text: str) -> Optional[dict]:
    """Try to pull a JSON object out of an LLM response string."""
    # Strip markdown code fences
    text = re.sub(r"```(?:json)?", "", text).strip("` \n")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Attempt to find the first {...} block
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    return None


# ── Food Analysis ──────────────────────────────────────────────
FOOD_ANALYSIS_PROMPT = """
Analyse the food item in this image and return ONLY valid JSON with NO additional text.

JSON schema:
{
  "food_name": "string – the identified food name",
  "description": "string – 1-2 sentence description",
  "confidence": 0.92,
  "alternatives": ["string – other possible foods"],
  "nutrition": {
    "calories": 250,
    "protein_g": 8.5,
    "carbs_g": 35.0,
    "fat_g": 7.0,
    "fiber_g": 3.0
  },
  "tags": ["vegetarian", "high-carb", "indian"]
}

Notes:
- confidence is a float 0-1 representing your certainty in the primary identification.
- nutrition values should be per standard serving (roughly 100-200 g or one portion).
- if you cannot identify a food item, set food_name to "Unknown food item" and confidence to 0.
"""


async def analyze_food(image_bytes: bytes) -> Optional[dict]:
    """
    Run Gemini vision analysis on the image.
    Returns a dict matching FoodAnalysisResponse schema, or None if unavailable.
    """
    model = _get_model()
    if model is None:
        return None

    try:
        img = _prepare_image(image_bytes)

        # Convert PIL image to bytes for the API
        buf = BytesIO()
        img.save(buf, format="JPEG", quality=85)
        image_data = {
            "mime_type": "image/jpeg",
            "data": buf.getvalue(),
        }

        response = model.generate_content([FOOD_ANALYSIS_PROMPT, image_data])
        raw_text = response.text

        parsed = _extract_json(raw_text)
        if parsed:
            parsed["raw_analysis"] = raw_text
            return parsed

        logger.warning("Could not parse Gemini response as JSON: %s", raw_text[:200])
        return {"food_name": "Unrecognised", "raw_analysis": raw_text}

    except Exception as exc:
        logger.error("Gemini food analysis failed: %s", exc)
        return None


# ── Freshness Detection ────────────────────────────────────────
FRESHNESS_PROMPT = """
Assess the visual freshness of the food item in this image. Return ONLY valid JSON with NO additional text.

JSON schema:
{
  "freshness_score": 75,
  "assessment": "string – concise assessment paragraph",
  "indicators": [
    {"label": "Colour", "score": 80},
    {"label": "Texture", "score": 70},
    {"label": "Surface condition", "score": 75}
  ],
  "reasons": ["reason 1", "reason 2"],
  "uncertainty": "string – what limits confidence (lighting, angle, etc.) or null"
}

Notes:
- freshness_score is an integer 0-100 (100 = perfectly fresh, 0 = clearly spoiled).
- Base assessment only on visible characteristics. Do NOT state that the food is safe to eat.
- If you cannot determine freshness, set freshness_score to 50 and explain in uncertainty.
"""


async def analyze_freshness(image_bytes: bytes, food_type: str = "") -> Optional[dict]:
    """Run freshness analysis. Returns dict or None."""
    model = _get_model()
    if model is None:
        return None

    try:
        img = _prepare_image(image_bytes)
        buf = BytesIO()
        img.save(buf, format="JPEG", quality=85)
        image_data = {"mime_type": "image/jpeg", "data": buf.getvalue()}

        hint = f"\nThe food type is: {food_type}." if food_type else ""
        response = model.generate_content([FRESHNESS_PROMPT + hint, image_data])
        raw_text = response.text

        parsed = _extract_json(raw_text)
        return parsed

    except Exception as exc:
        logger.error("Gemini freshness analysis failed: %s", exc)
        return None


# ── Meal Plan Generation ────────────────────────────────────────
MEAL_PLAN_PROMPT_TEMPLATE = """
Create a one-day personalised meal plan based on the following preferences.
Return ONLY valid JSON with NO additional text.

Preferences:
- Diet: {diet}
- Daily calorie goal: {calorie_goal} kcal
- Budget: ₹{budget_inr} per day
- Number of meals: {meal_count}
- Allergens to avoid: {allergens}
- Ingredients to avoid: {avoid_ingredients}

JSON schema:
{{
  "meals": [
    {{
      "slot": "breakfast",
      "name": "string",
      "description": "string",
      "calories": 400,
      "ingredients": ["ingredient1", "ingredient2"],
      "prep_time": "10 minutes",
      "cost": 80
    }}
  ],
  "nutrition_totals": {{
    "calories": 2000,
    "protein_g": 65,
    "carbs_g": 250,
    "fat_g": 55
  }},
  "shopping_list": [
    {{"name": "Oats", "quantity": "100 g"}},
    {{"name": "Banana", "quantity": "2 nos"}}
  ],
  "nutrition_notes": "string – brief note about the plan"
}}

Slot names must be chosen from: breakfast, morning_snack, lunch, afternoon_snack, dinner, evening_snack.
Ensure NONE of the meals contain the listed allergens or avoided ingredients.
Cost is approximate cost in Indian Rupees.
"""


async def generate_meal_plan(
    diet: str,
    calorie_goal: int,
    budget_inr: int,
    meal_count: int,
    allergens: list[str],
    avoid_ingredients: list[str],
) -> Optional[dict]:
    """Generate a meal plan via Gemini. Returns dict or None."""
    model = _get_model()
    if model is None:
        return None

    try:
        prompt = MEAL_PLAN_PROMPT_TEMPLATE.format(
            diet=diet,
            calorie_goal=calorie_goal,
            budget_inr=budget_inr,
            meal_count=meal_count,
            allergens=", ".join(allergens) if allergens else "none",
            avoid_ingredients=", ".join(avoid_ingredients) if avoid_ingredients else "none",
        )
        response = model.generate_content(prompt)
        parsed = _extract_json(response.text)
        return parsed

    except Exception as exc:
        logger.error("Gemini meal plan generation failed: %s", exc)
        return None
