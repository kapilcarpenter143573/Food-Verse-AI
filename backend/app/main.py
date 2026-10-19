"""
Food Verse AI – FastAPI Backend
================================
Entry point for the application.
Run with: uvicorn app.main:app --reload --port 8000
"""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure stdout handles Unicode on Windows consoles (cp1252 → utf-8)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from app.config import settings
from app.routes import food, meals, health


# ── Lifespan ───────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Replaces deprecated @app.on_event('startup')."""
    mode = "DEMO" if settings.DEMO_MODE else "AI"
    key_set = bool(settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "your_google_api_key_here")
    print("\n[Food Verse AI] Backend starting up")
    print(f"   Mode      : {mode}")
    print(f"   AI Key    : {'OK - configured' if key_set else 'NOT SET - running in demo mode'}")
    print(f"   Docs      : http://localhost:{os.getenv('PORT', 8000)}/api/docs\n")
    yield


# ── Application factory ────────────────────────────────────────
app = FastAPI(
    title="Food Verse AI API",
    description="Multimodal Food Intelligence Agent – FastAPI Backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api")
app.include_router(food.router,   prefix="/api/food",  tags=["Food Analysis"])
app.include_router(meals.router,  prefix="/api/meals", tags=["Meal Planner"])


# ── Root ───────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
async def root():
    return JSONResponse(
        {
            "name": "Food Verse AI API",
            "version": "1.0.0",
            "docs": "/api/docs",
            "health": "/api/health",
        }
    )
