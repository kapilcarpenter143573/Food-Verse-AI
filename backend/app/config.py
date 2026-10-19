"""
Application configuration loaded from environment variables via pydantic-settings.
Never hard-code secrets here – use the .env file (see .env.example).
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # General
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Google AI
    GOOGLE_API_KEY: str = ""
    AI_PROVIDER: str = "gemini"
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # Demo mode – set True when no AI credentials are available
    DEMO_MODE: bool = False

    # File upload
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp,image/gif"
    UPLOAD_DIR: str = "uploads"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def is_ai_configured(self) -> bool:
        """True when a valid API key has been supplied and demo mode is disabled."""
        key_ok = bool(self.GOOGLE_API_KEY and self.GOOGLE_API_KEY != "your_google_api_key_here")
        return key_ok and not self.DEMO_MODE

    @property
    def max_file_bytes(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024

    @property
    def allowed_types_list(self) -> list[str]:
        return [t.strip() for t in self.ALLOWED_IMAGE_TYPES.split(",")]


settings = Settings()
