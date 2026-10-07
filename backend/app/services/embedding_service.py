"""
Reusable Embedding Service and Semantic Similarity Engine for EarlySight.
Generates vector representations of operational signals via OpenAI embeddings API
and calculates cosine similarity for precursor / related signal detection.
"""

import hashlib
import logging
import math
from typing import Any, Dict, List, Optional, Tuple

from openai import (
    APIConnectionError,
    AuthenticationError,
    OpenAI,
    OpenAIError,
    RateLimitError,
)

from app.config import settings

logger = logging.getLogger(__name__)


class EmbeddingServiceNotConfiguredError(Exception):
    """Raised when the embedding service is requested but OPENAI_API_KEY is not configured."""
    pass


class EmbeddingServiceError(Exception):
    """Raised when an OpenAI API call fails or encounters a network/provider error."""
    pass


def signal_to_embedding_text(signal: Any) -> str:
    """
    Deterministically transforms an operational signal entity or dict into
    structured text for semantic embedding generation.

    Includes key operational fields: title, description, category, location, severity, source.
    """
    title = getattr(signal, "title", None) or (
        signal.get("title") if isinstance(signal, dict) else ""
    )
    description = getattr(signal, "description", None) or (
        signal.get("description") if isinstance(signal, dict) else ""
    )
    category = getattr(signal, "category", None) or (
        signal.get("category") if isinstance(signal, dict) else ""
    )
    location = getattr(signal, "location", None) or (
        signal.get("location") if isinstance(signal, dict) else ""
    )
    severity = getattr(signal, "severity", None) or (
        signal.get("severity") if isinstance(signal, dict) else ""
    )
    source = getattr(signal, "source", None) or (
        signal.get("source") if isinstance(signal, dict) else ""
    )

    lines = [
        f"Title: {title.strip() if title else 'Unknown'}",
        f"Description: {description.strip() if description else 'None'}",
        f"Category: {category.strip() if category else 'other'}",
        f"Location: {location.strip() if location else 'Unspecified'}",
        f"Severity: {severity.strip() if severity else 'medium'}",
        f"Source: {source.strip() if source else 'manual'}",
    ]
    return "\n".join(lines)


def cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
    """
    Computes standard cosine similarity between two numerical vectors:
        cos(theta) = (A . B) / (||A|| * ||B||)

    Returns a float strictly between 0.0 and 1.0.
    Handles zero vectors and float rounding gracefully.
    """
    if not vector_a or not vector_b:
        return 0.0

    if len(vector_a) != len(vector_b):
        raise ValueError(
            f"Vector dimensions do not match: {len(vector_a)} vs {len(vector_b)}"
        )

    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
    norm_a = math.sqrt(sum(a * a for a in vector_a))
    norm_b = math.sqrt(sum(b * b for b in vector_b))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0

    similarity = dot_product / (norm_a * norm_b)
    # Clamp to [0.0, 1.0] to safeguard against negative angles or float imprecision
    return max(0.0, min(1.0, float(similarity)))


class EmbeddingService:
    """
    Service layer encapsulating OpenAI embedding generation,
    in-memory vector caching, and semantic signal similarity.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.api_key = api_key if api_key is not None else settings.openai_api_key
        self.model = model if model is not None else settings.openai_embedding_model
        self.timeout = timeout
        self._client: Optional[OpenAI] = None
        # In-memory LRU/dict cache mapping text SHA-256 hash -> embedding vector
        self._cache: Dict[str, List[float]] = {}

    @property
    def is_configured(self) -> bool:
        """Checks whether a non-empty OpenAI API key is set."""
        return bool(self.api_key and self.api_key.strip())

    def get_client(self) -> OpenAI:
        """
        Lazily creates and returns the OpenAI client.
        Raises EmbeddingServiceNotConfiguredError if no API key is available.
        """
        if not self.is_configured:
            raise EmbeddingServiceNotConfiguredError(
                "Embedding service is not configured. Please configure OPENAI_API_KEY."
            )

        if self._client is None:
            self._client = OpenAI(
                api_key=self.api_key.strip(),
                timeout=self.timeout,
                max_retries=2,
            )
        return self._client

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generates an embedding vector for the provided text using OpenAI.
        Does not expose raw API keys or unhandled network exceptions.
        """
        if not self.is_configured:
            raise EmbeddingServiceNotConfiguredError(
                "Embedding service is not configured. Please configure OPENAI_API_KEY."
            )

        clean_text = text.strip()
        if not clean_text:
            return []

        try:
            client = self.get_client()
            response = client.embeddings.create(
                input=clean_text,
                model=self.model,
            )
            return response.data[0].embedding

        except AuthenticationError:
            logger.error("OpenAI authentication failed. Please verify OPENAI_API_KEY.")
            raise EmbeddingServiceError(
                "OpenAI authentication failed. Invalid or revoked API key."
            ) from None

        except RateLimitError:
            logger.warning("OpenAI rate limit reached during embedding generation.")
            raise EmbeddingServiceError(
                "OpenAI service rate limit exceeded. Please retry shortly."
            ) from None

        except APIConnectionError as exc:
            logger.warning("Failed to connect to OpenAI API: %s", type(exc).__name__)
            raise EmbeddingServiceError(
                "Unable to reach OpenAI API service. Network timeout or connection failure."
            ) from None

        except OpenAIError as exc:
            logger.error("OpenAI API error during embedding: %s", type(exc).__name__)
            raise EmbeddingServiceError(
                f"OpenAI service error: {type(exc).__name__}"
            ) from None

        except Exception as exc:
            logger.error(
                "Unexpected error during embedding generation: %s", type(exc).__name__
            )
            raise EmbeddingServiceError(
                "An unexpected error occurred during embedding generation."
            ) from None

    def get_or_create_embedding(self, signal: Any) -> List[float]:
        """
        Retrieves a cached embedding vector or generates and caches a new one.
        Accepts a Signal model instance, dictionary, or raw string text.
        """
        if isinstance(signal, str):
            text = signal
        else:
            text = signal_to_embedding_text(signal)

        # Hash text for consistent cache lookup
        cache_key = hashlib.sha256(text.encode("utf-8")).hexdigest()
        if cache_key in self._cache:
            return self._cache[cache_key]

        vector = self.generate_embedding(text)
        if vector:
            self._cache[cache_key] = vector
        return vector

    def find_related_signals(
        self,
        target_signal: Any,
        candidate_signals: List[Any],
        threshold: float = 0.70,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Computes semantic similarity between target_signal and candidate_signals.
        Excludes the target signal itself.
        Filters candidates with similarity >= threshold.
        Returns up to `limit` candidates ordered from highest to lowest similarity.
        """
        target_id = getattr(target_signal, "id", None) or (
            target_signal.get("id") if isinstance(target_signal, dict) else None
        )
        target_vector = self.get_or_create_embedding(target_signal)
        if not target_vector:
            return []

        scored_candidates: List[Tuple[float, Any]] = []

        for candidate in candidate_signals:
            cand_id = getattr(candidate, "id", None) or (
                candidate.get("id") if isinstance(candidate, dict) else None
            )
            # Exclude the target signal itself
            if target_id is not None and cand_id == target_id:
                continue

            cand_vector = self.get_or_create_embedding(candidate)
            if not cand_vector:
                continue

            sim = cosine_similarity(target_vector, cand_vector)
            if sim >= threshold:
                scored_candidates.append((sim, candidate))

        # Sort descending by similarity score
        scored_candidates.sort(key=lambda item: item[0], reverse=True)

        results: List[Dict[str, Any]] = []
        for sim, candidate in scored_candidates[:limit]:
            cand_id = getattr(candidate, "id", None) or (
                candidate.get("id") if isinstance(candidate, dict) else 0
            )
            cand_title = getattr(candidate, "title", None) or (
                candidate.get("title") if isinstance(candidate, dict) else "Untitled"
            )
            cand_cat = getattr(candidate, "category", None) or (
                candidate.get("category") if isinstance(candidate, dict) else "other"
            )
            cand_loc = getattr(candidate, "location", None) or (
                candidate.get("location") if isinstance(candidate, dict) else None
            )
            cand_sev = getattr(candidate, "severity", None) or (
                candidate.get("severity") if isinstance(candidate, dict) else None
            )

            results.append(
                {
                    "signal_id": cand_id,
                    "similarity": round(sim, 4),
                    "title": cand_title,
                    "category": cand_cat,
                    "location": cand_loc,
                    "severity": cand_sev,
                }
            )

        return results


# Default application-wide singleton
embedding_service = EmbeddingService()
