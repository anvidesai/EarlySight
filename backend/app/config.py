"""
Application configuration for EarlySight Backend.
Minimal baseline settings for Milestone 1.
"""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    """Basic application runtime settings."""

    app_name: str = "EarlySight Backend"
    app_version: str = "0.1.0"
    app_description: str = "Operational intelligence early warning backend API."
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes")


settings = Settings()
