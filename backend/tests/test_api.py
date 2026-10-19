"""
Backend test suite – tests key endpoints WITHOUT requiring AI credentials.
Run with: pytest tests/ -v
"""

import pytest
from fastapi.testclient import TestClient
from io import BytesIO
from PIL import Image

# Ensure we're in demo mode for tests (no real AI calls)
import os
os.environ.setdefault("DEMO_MODE", "true")
os.environ.setdefault("GOOGLE_API_KEY", "")

from app.main import app

client = TestClient(app)


# ── Health ────────────────────────────────────────────────────
class TestHealth:
    def test_health_returns_200(self):
        r = client.get("/api/health")
        assert r.status_code == 200

    def test_health_schema(self):
        r = client.get("/api/health")
        data = r.json()
        assert "status" in data
        assert "demo_mode" in data
        assert "ai_configured" in data
        assert data["status"] == "ok"

    def test_health_demo_mode_true(self):
        """In test environment demo mode should be active."""
        r = client.get("/api/health")
        # demo_mode is True when AI is not configured
        data = r.json()
        assert isinstance(data["demo_mode"], bool)


# ── Helpers ────────────────────────────────────────────────────
def _make_test_image(fmt="JPEG") -> bytes:
    """Create a small in-memory test image."""
    img = Image.new("RGB", (64, 64), color=(100, 180, 100))
    buf = BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


# ── Food Analysis ──────────────────────────────────────────────
class TestFoodAnalyze:
    def test_analyze_returns_200(self):
        img_bytes = _make_test_image()
        r = client.post(
            "/api/food/analyze",
            files={"image": ("test.jpg", BytesIO(img_bytes), "image/jpeg")},
            data={"serving_size": "1.0"},
        )
        assert r.status_code == 200

    def test_analyze_response_schema(self):
        img_bytes = _make_test_image()
        r = client.post(
            "/api/food/analyze",
            files={"image": ("test.jpg", BytesIO(img_bytes), "image/jpeg")},
            data={"serving_size": "1.0"},
        )
        data = r.json()
        assert "food_name" in data
        assert "nutrition" in data
        assert "is_demo" in data
        assert data["is_demo"] is True, "Demo flag should be True when AI is not configured"

    def test_analyze_nutrition_fields(self):
        img_bytes = _make_test_image()
        r = client.post(
            "/api/food/analyze",
            files={"image": ("test.jpg", BytesIO(img_bytes), "image/jpeg")},
            data={"serving_size": "1.0"},
        )
        nutrition = r.json()["nutrition"]
        for field in ("calories", "protein_g", "carbs_g", "fat_g", "fiber_g"):
            assert field in nutrition

    def test_analyze_invalid_file_type(self):
        r = client.post(
            "/api/food/analyze",
            files={"image": ("test.txt", BytesIO(b"not an image"), "text/plain")},
            data={"serving_size": "1.0"},
        )
        assert r.status_code == 422

    def test_analyze_no_image_returns_422(self):
        r = client.post("/api/food/analyze", data={"serving_size": "1.0"})
        assert r.status_code == 422

    def test_analyze_invalid_serving_size(self):
        """Serving size 0 is below the minimum of 0.1."""
        img_bytes = _make_test_image()
        r = client.post(
            "/api/food/analyze",
            files={"image": ("test.jpg", BytesIO(img_bytes), "image/jpeg")},
            data={"serving_size": "0"},
        )
        assert r.status_code == 422


# ── Freshness ─────────────────────────────────────────────────
class TestFreshness:
    def test_freshness_returns_200(self):
        img_bytes = _make_test_image()
        r = client.post(
            "/api/food/freshness",
            files={"image": ("test.jpg", BytesIO(img_bytes), "image/jpeg")},
            data={"food_type": "apple"},
        )
        assert r.status_code == 200

    def test_freshness_schema(self):
        img_bytes = _make_test_image()
        r = client.post(
            "/api/food/freshness",
            files={"image": ("test.jpg", BytesIO(img_bytes), "image/jpeg")},
        )
        data = r.json()
        assert "freshness_score" in data
        assert "assessment" in data
        assert "is_demo" in data
        assert isinstance(data["freshness_score"], int)
        assert 0 <= data["freshness_score"] <= 100

    def test_freshness_invalid_type(self):
        r = client.post(
            "/api/food/freshness",
            files={"image": ("doc.pdf", BytesIO(b"%PDF"), "application/pdf")},
        )
        assert r.status_code == 422


# ── Meal Plan ─────────────────────────────────────────────────
class TestMealPlan:
    def test_plan_returns_200(self):
        r = client.post(
            "/api/meals/plan",
            json={
                "diet": "vegetarian",
                "calorie_goal": 2000,
                "budget_inr": 400,
                "meal_count": 3,
                "allergens": [],
                "avoid_ingredients": [],
            },
        )
        assert r.status_code == 200

    def test_plan_schema(self):
        r = client.post(
            "/api/meals/plan",
            json={"diet": "vegan", "calorie_goal": 1800, "budget_inr": 350, "meal_count": 3},
        )
        data = r.json()
        assert "meals" in data
        assert "nutrition_totals" in data
        assert "shopping_list" in data
        assert "is_demo" in data
        assert isinstance(data["meals"], list)

    def test_plan_non_vegetarian(self):
        r = client.post(
            "/api/meals/plan",
            json={"diet": "non-vegetarian", "calorie_goal": 2200, "budget_inr": 500, "meal_count": 3},
        )
        assert r.status_code == 200

    def test_plan_invalid_calorie_goal_too_low(self):
        r = client.post(
            "/api/meals/plan",
            json={"diet": "vegetarian", "calorie_goal": 100},
        )
        assert r.status_code == 422

    def test_plan_invalid_calorie_goal_too_high(self):
        r = client.post(
            "/api/meals/plan",
            json={"diet": "vegetarian", "calorie_goal": 99999},
        )
        assert r.status_code == 422

    def test_plan_with_allergens(self):
        """Allergens should be accepted without errors."""
        r = client.post(
            "/api/meals/plan",
            json={
                "diet": "vegetarian",
                "calorie_goal": 2000,
                "budget_inr": 400,
                "meal_count": 3,
                "allergens": ["Gluten", "Dairy"],
                "avoid_ingredients": ["mushrooms"],
            },
        )
        assert r.status_code == 200

    def test_plan_is_demo_true(self):
        r = client.post(
            "/api/meals/plan",
            json={"diet": "eggetarian", "calorie_goal": 1900, "budget_inr": 400, "meal_count": 3},
        )
        data = r.json()
        assert data["is_demo"] is True


# ── Root ──────────────────────────────────────────────────────
class TestRoot:
    def test_root_returns_200(self):
        r = client.get("/")
        assert r.status_code == 200

    def test_root_has_docs_key(self):
        data = client.get("/").json()
        assert "docs" in data
