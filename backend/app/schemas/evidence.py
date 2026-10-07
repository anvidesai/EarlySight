"""
Pydantic schemas for Evidence and Explainability layer (Milestone 8).
Connects signals, related evidence, risk factor attribution, and natural-language explanations.
"""

from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.risk import (
    RiskFactorBreakdown,
    RiskLevelType,
    RiskPriorityType,
)

# Domain enumerations for Evidence Types and Evidence Strength
EvidenceType = Literal[
    "PRIMARY_SIGNAL",
    "RELATED_SIGNAL",
    "RECURRENCE",
    "FREQUENCY",
    "TREND",
    "SEVERITY",
]

EvidenceStrengthType = Literal["LOW", "MODERATE", "HIGH"]


class EvidenceItem(BaseModel):
    """
    Structured representation of a single piece of corroborating operational evidence.
    Grounds risk factors in verified physical observations, cohort frequency, or semantic linkages.
    """

    type: EvidenceType = Field(
        ...,
        description="Categorical evidence classification (PRIMARY_SIGNAL, RELATED_SIGNAL, RECURRENCE, FREQUENCY, TREND, SEVERITY).",
        examples=["PRIMARY_SIGNAL"],
    )
    description: str = Field(
        ...,
        description="Factual, verifiable statement describing this specific piece of operational evidence.",
        examples=["Water leakage reported near Server Room 3B."],
    )
    signal_id: Optional[int] = Field(
        default=None,
        description="Referenced signal ID (if related to a specific incident report).",
        examples=[1],
    )
    similarity: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
        description="Calculated cosine similarity score (for RELATED_SIGNAL evidence).",
        examples=[0.82],
    )
    timestamp: Optional[datetime] = Field(
        default=None,
        description="Observation or creation timestamp associated with this evidence point.",
    )
    location: Optional[str] = Field(
        default=None,
        description="Physical or logical location zone associated with this evidence point.",
        examples=["Building 2, 3rd Floor"],
    )
    severity: Optional[str] = Field(
        default=None,
        description="Assessed operational severity level of this evidence point.",
        examples=["high"],
    )
    contribution_factor: Optional[str] = Field(
        default=None,
        description="Associated risk factor dimension (severity, frequency, recurrence, related_signals, trend).",
        examples=["severity"],
    )
    contribution_points: Optional[int] = Field(
        default=None,
        ge=0,
        description="Points contributed to the M7 risk score by this evidence dimension.",
        examples=[19],
    )

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class EvidenceResponse(BaseModel):
    """
    Comprehensive explainability and evidence synthesis response for an operational signal.
    Answers: WHAT happened, WHERE, HOW OFTEN, IS it recurring, and WHY it matters.
    """

    signal_id: int = Field(
        ...,
        description="Unique integer identifier of the primary signal being explained.",
        examples=[1],
    )
    signal_title: Optional[str] = Field(
        default=None,
        description="Headline summary of the evaluated primary signal.",
        examples=["Water leakage detected near Server Room 3B"],
    )
    summary: str = Field(
        ...,
        description="Cautious, fact-grounded operational narrative answering what happened, where, and why it matters.",
        examples=[
            "High-severity infrastructure reports have appeared repeatedly near Building 2, 3rd Floor. Two related signals were detected, increasing the evidence for a recurring operational issue."
        ],
    )
    evidence_strength: EvidenceStrengthType = Field(
        ...,
        description="Verifiable evidence density tier: LOW, MODERATE, or HIGH (based on multi-source corroborate data).",
        examples=["HIGH"],
    )
    evidence: List[EvidenceItem] = Field(
        default_factory=list,
        description="Ordered list of supporting operational evidence items.",
    )
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Composite M7 risk score between 0 and 100.",
        examples=[78],
    )
    risk_level: RiskLevelType = Field(
        ...,
        description="Categorical risk tier: LOW, MODERATE, HIGH, CRITICAL.",
        examples=["CRITICAL"],
    )
    priority: RiskPriorityType = Field(
        ...,
        description="Operational action priority ranking: LOW, MEDIUM, HIGH, CRITICAL.",
        examples=["HIGH"],
    )
    factors: Optional[RiskFactorBreakdown] = Field(
        default=None,
        description="Point contribution breakdown across the 5 risk dimensions.",
    )
    evaluated_at: Optional[datetime] = Field(
        default=None,
        description="UTC timestamp when the evidence analysis was synthesized.",
    )

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class EvidenceServiceUnavailableResponse(BaseModel):
    """
    Degraded response returned when the database is unavailable.
    """

    status: str = Field(
        default="unavailable",
        description="Service availability state.",
    )
    message: str = Field(
        default="Database service is currently unavailable. Please verify PostgreSQL connection.",
        description="Actionable explanation of why evidence synthesis could not access the database.",
    )
