"""
Pydantic schemas for Preventive Actions and Resolution lifecycle (Milestone 9).
Provides schemas for action creation, update, lifecycle transitions, and API response serialization.
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

# Domain enumerations for Action Status and Priority
ActionStatusType = Literal[
    "OPEN",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "VERIFIED",
    "RESOLVED",
    "CANCELLED",
]

ActionPriorityType = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class ActionBase(BaseModel):
    """Shared fields across Action schemas."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Clear title of the preventive or corrective action",
        examples=["Inspect and repair overhead pipe valve above Rack 4"],
    )
    description: Optional[str] = Field(
        default=None,
        description="Detailed operational scope, instructions, or mitigation checklist",
        examples=["Isolate secondary shutoff valve, inspect gasket seal, and replace degraded ceiling tile."],
    )
    assigned_to: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Name, username, or team assigned to execute the action",
        examples=["Facilities Maintenance Team B"],
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Target completion deadline timestamp",
    )
    resolution_notes: Optional[str] = Field(
        default=None,
        description="Notes detailing execution, remediation evidence, or root cause mitigation",
    )


class ActionCreate(ActionBase):
    """
    Schema for creating a new preventive action linked to an identified risk/signal.
    """

    signal_id: int = Field(
        ...,
        ge=1,
        description="Unique integer identifier of the originating operational signal",
        examples=[1],
    )
    priority: Optional[ActionPriorityType] = Field(
        default=None,
        description="Action priority (if omitted, automatically populated from calculated M7 risk priority)",
        examples=["HIGH"],
    )

    @field_validator("priority", mode="before")
    @classmethod
    def normalize_priority(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip().upper()
        return value


class ActionUpdate(BaseModel):
    """
    Schema for partially updating an existing action (PATCH).
    """

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Updated title of the action",
    )
    description: Optional[str] = Field(
        default=None,
        description="Updated detailed scope or instructions",
    )
    assigned_to: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Updated assigned personnel or team",
    )
    status: Optional[ActionStatusType] = Field(
        default=None,
        description="Updated lifecycle status (must follow valid lifecycle transitions)",
    )
    priority: Optional[ActionPriorityType] = Field(
        default=None,
        description="Updated action priority",
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Updated due date deadline",
    )
    resolution_notes: Optional[str] = Field(
        default=None,
        description="Updated remediation or verification notes",
    )

    @field_validator("status", "priority", mode="before")
    @classmethod
    def normalize_enums(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip().upper()
        return value


class ActionAssignRequest(BaseModel):
    """Payload for POST /api/actions/{action_id}/assign."""

    assigned_to: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Name, username, or team to assign this action to",
        examples=["Sarah Jenkins (Plumbing Specialist)"],
    )
    notes: Optional[str] = Field(
        default=None,
        description="Optional assignment guidance or dispatch note",
    )


class ActionCompleteRequest(BaseModel):
    """Payload for POST /api/actions/{action_id}/complete."""

    resolution_notes: Optional[str] = Field(
        default=None,
        description="Summary of remediation steps executed to mitigate the precursor risk",
        examples=["Overhead valve gasket replaced; pressure tested for 45 minutes with zero leakage."],
    )


class ActionVerifyRequest(BaseModel):
    """Payload for POST /api/actions/{action_id}/verify."""

    resolution_notes: Optional[str] = Field(
        default=None,
        description="Quality control or independent verification notes confirming risk remediation",
        examples=["Independent facility inspection confirmed moisture levels returned to dry normal."],
    )


class ActionResolveRequest(BaseModel):
    """Payload for POST /api/actions/{action_id}/resolve."""

    resolution_notes: Optional[str] = Field(
        default=None,
        description="Final operational sign-off and closure confirmation",
        examples=["Action formally signed off; ticket closed in facility registry."],
    )


class ActionCancelRequest(BaseModel):
    """Payload for POST /api/actions/{action_id}/cancel."""

    resolution_notes: Optional[str] = Field(
        default=None,
        description="Reason why the action was cancelled or deemed redundant",
        examples=["Duplicated by work order #412; cancelled."],
    )


class ActionResponse(ActionBase):
    """
    Standardized response representation for an EarlySight preventive action.
    """

    id: int = Field(..., description="Unique integer identifier of the action record")
    signal_id: int = Field(..., description="Foreign key linking to the originating signal")
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="M7 composite risk score evaluated at action creation for traceability",
    )
    status: ActionStatusType = Field(
        ...,
        description="Current workflow status (OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, VERIFIED, RESOLVED, CANCELLED)",
    )
    priority: ActionPriorityType = Field(
        ...,
        description="Action priority ranking (LOW, MEDIUM, HIGH, CRITICAL)",
    )
    created_at: datetime = Field(
        ...,
        description="UTC timestamp when the action was created",
    )
    updated_at: datetime = Field(
        ...,
        description="UTC timestamp of the most recent action update",
    )
    completed_at: Optional[datetime] = Field(
        default=None,
        description="UTC timestamp when work was marked completed",
    )
    verified_at: Optional[datetime] = Field(
        default=None,
        description="UTC timestamp when resolution was independently verified",
    )
    signal_title: Optional[str] = Field(
        default=None,
        description="Headline title of the linked operational signal",
    )
    evidence_summary: Optional[str] = Field(
        default=None,
        description="Concise reference to M8 evidence explainability summary",
    )

    model_config = ConfigDict(from_attributes=True, extra="ignore")


class ActionServiceUnavailableResponse(BaseModel):
    """
    Degraded response returned when the database is unavailable.
    """

    status: str = Field(
        default="unavailable",
        description="Service availability state",
    )
    message: str = Field(
        default="Database service is currently unavailable. Please verify PostgreSQL connection.",
        description="Actionable explanation of why the action operation could not be processed",
    )
