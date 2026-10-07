"""
Pydantic schemas for Embedding service and Related Signal detection (Milestone 6).
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class RelatedSignalItem(BaseModel):
    """
    Summary representation of an operational signal determined to be semantically related.
    Never exposes raw embedding vectors.
    """

    signal_id: int = Field(..., description="Unique integer ID of the related signal")
    similarity: float = Field(
        ...,
        description="Calculated cosine similarity score between 0.0 and 1.0",
        ge=0.0,
        le=1.0,
        examples=[0.87],
    )
    title: str = Field(..., description="Headline of the related signal")
    category: str = Field(..., description="Operational category of the signal")
    location: Optional[str] = Field(
        default=None, description="Physical or logical zone of the incident"
    )
    severity: Optional[str] = Field(
        default=None, description="Assessed operational severity level"
    )


class RelatedSignalsResponse(BaseModel):
    """
    API Response model for POST /api/signals/{signal_id}/related.
    """

    status: str = Field(
        default="ok",
        description="Status of the similarity search ('ok' or 'unavailable')",
    )
    signal_id: int = Field(..., description="The ID of the target signal being queried")
    related_signals: List[RelatedSignalItem] = Field(
        default_factory=list,
        description="List of related signals ordered from highest to lowest similarity",
    )
    model_used: Optional[str] = Field(
        default=None,
        description="The OpenAI embedding model identifier used for vector generation",
    )


class EmbeddingServiceUnavailableResponse(BaseModel):
    """
    Degraded response returned when OpenAI API key or embedding service is not configured.
    """

    status: str = Field(
        default="unavailable",
        description="Service availability state",
    )
    message: str = Field(
        default="Embedding service is not configured. Please configure OPENAI_API_KEY.",
        description="Actionable explanation of why embeddings cannot be generated",
    )
