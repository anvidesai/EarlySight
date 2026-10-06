"""
Application configuration for EarlySight Backend.
Supports runtime settings and PostgreSQL DATABASE_URL.
"""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    """Basic application runtime settings."""

    app_name: str = "EarlySight Backend"
    app_version: str = "0.2.0"
    app_description: str = "Operational intelligence early warning backend API."
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes")

    # PostgreSQL Database URL
    # Expected format: postgresql+psycopg://username:password@localhost:5432/earlysight
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/earlysight",
    )

    # CORS Allowed Origins for Local Frontend Development
    cors_origins: tuple = tuple(
        os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
    )


settings = Settings()
