"""
Demo data module – clearly labelled sample responses used when no AI provider is configured.

IMPORTANT: These responses must NEVER be presented to the user as real AI predictions.
The is_demo=True flag in every response tells the frontend to display the DemoBanner.
"""

import random

# ── Food Analysis Demos ────────────────────────────────────────
FOOD_DEMO_ITEMS = [
    {
        "food_name": "Butter Chicken (Murgh Makhani)",
        "description": "A rich, creamy Indian curry made with tender chicken pieces in a spiced tomato-butter sauce.",
        "confidence": None,
        "alternatives": ["Chicken Tikka Masala", "Dal Makhani"],
        "nutrition": {"calories": 350, "protein_g": 28.0, "carbs_g": 14.0, "fat_g": 20.0, "fiber_g": 2.5},
        "tags": ["non-vegetarian", "indian", "high-protein", "curry"],
    },
    {
        "food_name": "Masala Dosa",
        "description": "A crispy South Indian crepe made from fermented rice-lentil batter, filled with spiced potato.",
        "confidence": None,
        "alternatives": ["Plain Dosa", "Rava Dosa"],
        "nutrition": {"calories": 290, "protein_g": 8.0, "carbs_g": 48.0, "fat_g": 8.0, "fiber_g": 4.0},
        "tags": ["vegetarian", "south-indian", "breakfast", "gluten-free"],
    },
    {
        "food_name": "Caesar Salad",
        "description": "A classic salad of romaine lettuce, croutons, and Parmesan cheese with Caesar dressing.",
        "confidence": None,
        "alternatives": ["Greek Salad", "Garden Salad"],
        "nutrition": {"calories": 180, "protein_g": 9.0, "carbs_g": 12.0, "fat_g": 12.0, "fiber_g": 3.0},
        "tags": ["vegetarian", "salad", "low-calorie"],
    },
    {
        "food_name": "Margherita Pizza",
        "description": "A classic Neapolitan pizza with tomato sauce, fresh mozzarella, and basil on a thin crust.",
        "confidence": None,
        "alternatives": ["Pepperoni Pizza", "Cheese Pizza"],
        "nutrition": {"calories": 266, "protein_g": 11.0, "carbs_g": 33.0, "fat_g": 10.0, "fiber_g": 2.0},
        "tags": ["vegetarian", "italian", "pizza"],
    },
]


def get_demo_food_analysis() -> dict:
    item = random.choice(FOOD_DEMO_ITEMS)
    return {**item, "is_demo": True, "raw_analysis": None}


# ── Freshness Demo Items ───────────────────────────────────────
FRESHNESS_DEMOS = [
    {
        "freshness_score": 82,
        "assessment": "The produce appears to be in good condition with vibrant colour and no visible signs of spoilage.",
        "indicators": [
            {"label": "Colour", "score": 85},
            {"label": "Texture", "score": 80},
            {"label": "Surface condition", "score": 82},
        ],
        "reasons": ["Colour is vivid and consistent", "Surface shows no visible mould or discolouration"],
        "uncertainty": "This is sample demo data. No actual image analysis was performed.",
    },
    {
        "freshness_score": 55,
        "assessment": "The item shows some signs of age. It may still be usable but should be consumed soon.",
        "indicators": [
            {"label": "Colour", "score": 60},
            {"label": "Texture", "score": 50},
            {"label": "Surface condition", "score": 55},
        ],
        "reasons": ["Some colour fading visible", "Minor surface softening noted"],
        "uncertainty": "This is sample demo data. No actual image analysis was performed.",
    },
]


def get_demo_freshness() -> dict:
    item = random.choice(FRESHNESS_DEMOS)
    return {**item, "is_demo": True}


# ── Meal Plan Demos ────────────────────────────────────────────
DEMO_MEAL_PLANS = {
    "vegetarian": {
        "meals": [
            {"slot": "breakfast",       "name": "Oats Upma",           "description": "Nutritious oats cooked with vegetables and mild spices.", "calories": 310, "ingredients": ["Oats", "Onion", "Tomato", "Green chilli", "Mustard seeds"], "prep_time": "15 min", "cost": 50},
            {"slot": "lunch",           "name": "Dal Tadka with Roti",  "description": "Protein-rich yellow lentils tempered with cumin and served with whole-wheat rotis.", "calories": 520, "ingredients": ["Yellow lentils", "Wheat flour", "Ghee", "Cumin", "Garlic"], "prep_time": "30 min", "cost": 80},
            {"slot": "dinner",          "name": "Paneer Stir-fry",      "description": "Cottage cheese cubes tossed with colourful vegetables and aromatic spices.", "calories": 420, "ingredients": ["Paneer", "Bell pepper", "Onion", "Tomato", "Spices"], "prep_time": "20 min", "cost": 120},
        ],
        "nutrition_totals": {"calories": 1800, "protein_g": 72, "carbs_g": 220, "fat_g": 60},
        "shopping_list": [{"name": "Oats", "quantity": "100 g"}, {"name": "Yellow lentils", "quantity": "200 g"}, {"name": "Paneer", "quantity": "200 g"}, {"name": "Assorted vegetables", "quantity": "500 g"}, {"name": "Whole-wheat flour", "quantity": "300 g"}],
        "nutrition_notes": "This is sample demo data for a vegetarian plan.",
    },
    "vegan": {
        "meals": [
            {"slot": "breakfast",       "name": "Smoothie Bowl",        "description": "Blended banana and berries topped with granola and seeds.", "calories": 340, "ingredients": ["Banana", "Mixed berries", "Granola", "Chia seeds"], "prep_time": "10 min", "cost": 90},
            {"slot": "lunch",           "name": "Chickpea Curry",       "description": "Hearty chickpea curry cooked in a spiced tomato-coconut base.", "calories": 490, "ingredients": ["Chickpeas", "Coconut milk", "Tomato", "Onion", "Spices"], "prep_time": "35 min", "cost": 70},
            {"slot": "dinner",          "name": "Tofu Veggie Bowl",      "description": "Pan-fried tofu served over brown rice with steamed vegetables.", "calories": 430, "ingredients": ["Tofu", "Brown rice", "Broccoli", "Soy sauce", "Sesame oil"], "prep_time": "25 min", "cost": 100},
        ],
        "nutrition_totals": {"calories": 1780, "protein_g": 65, "carbs_g": 240, "fat_g": 52},
        "shopping_list": [{"name": "Banana", "quantity": "2"}, {"name": "Chickpeas", "quantity": "400 g"}, {"name": "Tofu", "quantity": "300 g"}, {"name": "Brown rice", "quantity": "200 g"}, {"name": "Broccoli", "quantity": "250 g"}],
        "nutrition_notes": "This is sample demo data for a vegan plan.",
    },
    "non-vegetarian": {
        "meals": [
            {"slot": "breakfast",       "name": "Egg Bhurji with Toast", "description": "Scrambled eggs spiced with green chilli and coriander, served with multigrain toast.", "calories": 380, "ingredients": ["Eggs", "Onion", "Tomato", "Green chilli", "Multigrain bread"], "prep_time": "15 min", "cost": 60},
            {"slot": "lunch",           "name": "Chicken Rice Bowl",    "description": "Grilled chicken breast over steamed rice with cucumber raita.", "calories": 580, "ingredients": ["Chicken breast", "Basmati rice", "Yoghurt", "Cucumber", "Spices"], "prep_time": "40 min", "cost": 130},
            {"slot": "dinner",          "name": "Fish Curry with Roti",  "description": "Mild fish curry in a ginger-garlic tomato sauce served with rotis.", "calories": 460, "ingredients": ["Fish fillet", "Tomato", "Ginger", "Garlic", "Wheat flour"], "prep_time": "35 min", "cost": 150},
        ],
        "nutrition_totals": {"calories": 1960, "protein_g": 120, "carbs_g": 200, "fat_g": 65},
        "shopping_list": [{"name": "Eggs", "quantity": "4"}, {"name": "Chicken breast", "quantity": "250 g"}, {"name": "Fish fillet", "quantity": "200 g"}, {"name": "Basmati rice", "quantity": "200 g"}],
        "nutrition_notes": "This is sample demo data for a non-vegetarian plan.",
    },
    "eggetarian": {
        "meals": [
            {"slot": "breakfast",       "name": "Veggie Omelette",      "description": "Fluffy three-egg omelette filled with sautéed mushrooms and spinach.", "calories": 350, "ingredients": ["Eggs", "Mushrooms", "Spinach", "Cheese", "Olive oil"], "prep_time": "15 min", "cost": 70},
            {"slot": "lunch",           "name": "Egg Curry with Rice",  "description": "Boiled eggs in a fragrant onion-tomato curry served with steamed rice.", "calories": 510, "ingredients": ["Eggs", "Onion", "Tomato", "Basmati rice", "Spices"], "prep_time": "30 min", "cost": 80},
            {"slot": "dinner",          "name": "Paneer Egg Fried Rice","description": "Wok-tossed basmati rice with scrambled eggs and paneer cubes.", "calories": 430, "ingredients": ["Eggs", "Paneer", "Basmati rice", "Mixed vegetables", "Soy sauce"], "prep_time": "25 min", "cost": 100},
        ],
        "nutrition_totals": {"calories": 1850, "protein_g": 90, "carbs_g": 210, "fat_g": 70},
        "shopping_list": [{"name": "Eggs", "quantity": "8"}, {"name": "Paneer", "quantity": "150 g"}, {"name": "Basmati rice", "quantity": "300 g"}, {"name": "Mixed vegetables", "quantity": "400 g"}],
        "nutrition_notes": "This is sample demo data for an eggetarian plan.",
    },
}


def get_demo_meal_plan(diet: str, allergens: list, avoid_ingredients: list) -> dict:
    key = diet if diet in DEMO_MEAL_PLANS else "vegetarian"
    plan = DEMO_MEAL_PLANS[key].copy()

    # Basic allergen filter on demo data – warn user if conflicts detected
    allergy_lower = {a.lower() for a in allergens + avoid_ingredients}
    if allergy_lower:
        plan["nutrition_notes"] = (
            f"⚠️ DEMO MODE: Sample data may contain {', '.join(allergens + avoid_ingredients)}. "
            "Real AI mode respects all allergen restrictions. "
            + (plan.get("nutrition_notes") or "")
        )

    return {**plan, "is_demo": True}
