"""
Pydantic schemas for Risk Scoring, Factor Breakdown, and Prioritization (Milestone 7).
Provides strongly-typed schemas for deterministic operational risk assessment.
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

# Domain enumerations for Risk Levels and Priorities
RiskLevelType = Literal["LOW", "MODERATE", "HIGH", "CRITICAL"]
RiskPriorityType = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class RiskFactorBreakdown(BaseModel):
    """
    Detailed breakdown of individual scoring factors that compose the final risk score.
    Each factor is an integer contribution score.
    """

    severity: int = Field(
        ...,
        ge=0,
        description="Assessed severity contribution score based on operational severity level.",
        examples=[20],
    )
    frequency: int = Field(
        ...,
        ge=0,
        description="Frequency contribution score based on category cluster density or report origin.",
        examples=[18],
    )
    recurrence: int = Field(
        ...,
        ge=0,
        description="Recurrence contribution score reflecting repeated pattern indicators or location history.",
        examples=[15],
    )
    related_signals: int = Field(
        ...,
        ge=0,
        description="Semantic related-signal contribution score derived from vector embeddings.",
        examples=[15],
    )
    trend: int = Field(
        ...,
        ge=0,
        description="Trend contribution score evaluating recency of activity and unresolved status.",
        examples=[10],
    )

    model_config = ConfigDict(extra="ignore")


class RiskScoreResponse(BaseModel):
    """
    Standardized risk evaluation response for an operational signal.
    Combines composite score, tier level, priority ranking, factor breakdown,
    and a transparent generated explanation.
    """

    signal_id: int = Field(
        ...,
        description="Unique integer identifier of the evaluated operational signal.",
        examples=[1],
    )
    signal_title: Optional[str] = Field(
        default=None,
        description="Headline summary of the evaluated signal.",
        examples=["Water leakage detected near Server Room 3B"],
    )
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Normalized composite risk score strictly between 0 and 100.",
        examples=[78],
    )
    risk_level: RiskLevelType = Field(
        ...,
        description="Categorical risk tier: LOW (0–24), MODERATE (25–49), HIGH (50–74), CRITICAL (75–100).",
        examples=["CRITICAL"],
    )
    priority: RiskPriorityType = Field(
        ...,
        description="Operational action priority ranking: LOW, MEDIUM, HIGH, CRITICAL.",
        examples=["HIGH"],
    )
    factors: RiskFactorBreakdown = Field(
        ...,
        description="Individual score contribution breakdown for all five risk dimensions.",
    )
    explanation: str = Field(
        ...,
        description="Deterministic, explainable rationale generated directly from evaluated factors.",
        examples=[
            "High severity combined with repeated related signals increases the likelihood of an emerging operational problem."
        ],
    )
    signal_severity: Optional[str] = Field(
        default=None,
        description="Original operational severity of the evaluated signal.",
        examples=["high"],
    )
    signal_category: Optional[str] = Field(
        default=None,
        description="Operational category classification of the signal.",
        examples=["infrastructure"],
    )
    signal_location: Optional[str] = Field(
        default=None,
        description="Physical location or zone of the incident.",
        examples=["Building 2, 3rd Floor"],
    )
    signal_status: Optional[str] = Field(
        default=None,
        description="Incident workflow status (open, investigating, resolved).",
        examples=["open"],
    )
    related_signals_count: int = Field(
        default=0,
        ge=0,
        description="Total count of semantically related precursor signals identified.",
        examples=[3],
    )
    evaluated_at: Optional[datetime] = Field(
        default=None,
        description="UTC timestamp when the risk evaluation was performed.",
    )

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class RiskServiceUnavailableResponse(BaseModel):
    """
    Degraded response returned when the database is unavailable.
    """

    status: str = Field(
        default="unavailable",
        description="Service availability state.",
    )
    message: str = Field(
        default="Database service is currently unavailable. Please verify PostgreSQL connection.",
        description="Actionable explanation of why risk calculation could not load signal data.",
    )
