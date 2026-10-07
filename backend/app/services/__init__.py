"""
Services package for EarlySight business logic and external integrations.
"""

from app.services.ai_service import (
    AIService,
    AIServiceError,
    AIServiceNotConfiguredError,
    ai_service,
)
from app.services.embedding_service import (
    EmbeddingService,
    EmbeddingServiceError,
    EmbeddingServiceNotConfiguredError,
    cosine_similarity,
    embedding_service,
    signal_to_embedding_text,
)

__all__ = [
    "AIService",
    "AIServiceError",
    "AIServiceNotConfiguredError",
    "ai_service",
    "EmbeddingService",
    "EmbeddingServiceError",
    "EmbeddingServiceNotConfiguredError",
    "embedding_service",
    "cosine_similarity",
    "signal_to_embedding_text",
]
