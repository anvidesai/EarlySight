"""
Pydantic schemas for EarlySight Signal entity validation, creation, update, and response serialization.
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

# Domain enumerations for Signal attributes
CategoryType = Literal[
    "maintenance",
    "safety",
    "infrastructure",
    "crowding",
    "complaint",
    "equipment",
    "other",
]

SeverityType = Literal["low", "medium", "high", "critical"]

StatusType = Literal["open", "investigating", "resolved"]

SourceType = Literal[
    "complaint",
    "maintenance_report",
    "incident_report",
    "sensor",
    "manual",
    "other",
]


class SignalBase(BaseModel):
    """Shared fields across Signal request and response schemas."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Concise summary of the operational signal",
        examples=["Water leakage detected near Server Room 3B"],
    )
    description: Optional[str] = Field(
        default=None,
        description="Detailed observations or background information",
        examples=["Slow dripping observed from ceiling tile above network rack."],
    )
    category: CategoryType = Field(
        default="other",
        description="Operational classification category",
        examples=["infrastructure"],
    )
    location: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Physical location or zone of the incident",
        examples=["Building 2, 3rd Floor"],
    )
    severity: SeverityType = Field(
        default="medium",
        description="Estimated operational impact severity",
        examples=["high"],
    )
    status: StatusType = Field(
        default="open",
        description="Current operational lifecycle status",
        examples=["open"],
    )
    source: SourceType = Field(
        default="manual",
        description="Origin source of the report or observation",
        examples=["maintenance_report"],
    )

    @field_validator("category", "severity", "status", "source", mode="before")
    @classmethod
    def normalize_string_enums(cls, value: object) -> object:
        """Normalizes string inputs to lowercase for lenient validation."""
        if isinstance(value, str):
            return value.strip().lower()
        return value


class SignalCreate(SignalBase):
    """Schema for creating a new operational signal."""
    pass


class SignalUpdate(BaseModel):
    """Schema for partially updating an existing signal (PATCH)."""

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Updated summary of the signal",
    )
    description: Optional[str] = Field(
        default=None,
        description="Updated detailed description",
    )
    category: Optional[CategoryType] = Field(
        default=None,
        description="Updated category",
    )
    location: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Updated location",
    )
    severity: Optional[SeverityType] = Field(
        default=None,
        description="Updated severity",
    )
    status: Optional[StatusType] = Field(
        default=None,
        description="Updated status",
    )
    source: Optional[SourceType] = Field(
        default=None,
        description="Updated source",
    )

    @field_validator("category", "severity", "status", "source", mode="before")
    @classmethod
    def normalize_string_enums(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip().lower()
        return value


class SignalResponse(SignalBase):
    """Schema for returning a stored signal from the API."""

    id: int = Field(..., description="Unique integer signal identifier")
    created_at: datetime = Field(
        ..., description="UTC timestamp when the signal was recorded"
    )
    updated_at: datetime = Field(
        ..., description="UTC timestamp of the most recent update"
    )

    model_config = ConfigDict(from_attributes=True)
