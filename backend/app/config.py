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

    # OpenAI AI / LLM Configuration
    # Safe development defaults: API key empty by default; never hardcode credentials
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # OpenAI Embedding & Related Signal Detection Configuration (Milestone 6)
    openai_embedding_model: str = os.getenv(
        "OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"
    )
    related_signal_limit: int = int(os.getenv("RELATED_SIGNAL_LIMIT", "5"))
    related_signal_threshold: float = float(
        os.getenv("RELATED_SIGNAL_THRESHOLD", "0.70")
    )
    candidate_signal_limit: int = int(os.getenv("CANDIDATE_SIGNAL_LIMIT", "50"))

    @property
    def is_ai_configured(self) -> bool:
        """Returns True if an OpenAI API key is populated in the environment."""
        return bool(self.openai_api_key.strip())

    @property
    def is_embeddings_configured(self) -> bool:
        """Returns True if an OpenAI API key is populated for the embedding service."""
        return bool(self.openai_api_key.strip())


settings = Settings()
