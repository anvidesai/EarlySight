"""
Action and Resolution Lifecycle Service for EarlySight (Milestone 9).
Manages conversion of identified risks into preventive actions,
state machine transitions, lifecycle timestamps, and verification audit trails.
"""

from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional, Set

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models.action import Action
from app.models.signal import Signal
from app.schemas.action import (
    ActionCreate,
    ActionPriorityType,
    ActionResponse,
    ActionStatusType,
    ActionUpdate,
)
from app.services.risk_service import risk_service

logger = logging.getLogger(__name__)

# Valid state machine transitions
VALID_TRANSITIONS: Dict[str, Set[str]] = {
    "OPEN": {"ASSIGNED", "IN_PROGRESS", "CANCELLED"},
    "ASSIGNED": {"IN_PROGRESS", "CANCELLED", "ASSIGNED"},
    "IN_PROGRESS": {"COMPLETED", "CANCELLED"},
    "COMPLETED": {"VERIFIED", "CANCELLED"},
    "VERIFIED": {"RESOLVED", "CANCELLED"},
    "RESOLVED": set(),  # Terminal state
    "CANCELLED": set(),  # Terminal state
}


class ActionServiceError(Exception):
    """Base exception for action service errors."""
    pass


class ActionNotFoundError(ActionServiceError):
    """Raised when the requested action is not found."""
    pass


class SignalNotFoundError(ActionServiceError):
    """Raised when the originating signal is not found."""
    pass


class InvalidActionTransitionError(ActionServiceError):
    """Raised when an invalid lifecycle state transition is requested."""
    pass


class ActionService:
    """
    Service layer for Action entity lifecycle, risk linkage, and resolution verification.
    """

    def validate_transition(self, current_status: str, target_status: str) -> None:
        """
        Validates whether transitioning from current_status to target_status is permitted.
        Raises InvalidActionTransitionError if the transition violates lifecycle rules.
        """
        current_upper = current_status.strip().upper()
        target_upper = target_status.strip().upper()

        if current_upper == target_upper:
            return

        allowed = VALID_TRANSITIONS.get(current_upper, set())
        if target_upper not in allowed:
            raise InvalidActionTransitionError(
                f"Invalid lifecycle transition from '{current_upper}' to '{target_upper}'. "
                f"Permitted transitions from '{current_upper}': {sorted(list(allowed)) or 'None (terminal state)'}."
            )

    def create_action(self, db: Session, payload: ActionCreate) -> Action:
        """
        Converts an identified signal/risk into a preventive action.
        Evaluates current M7 risk score for traceability and defaults priority
        from calculated risk priority if not explicitly specified.
        """
        signal = db.get(Signal, payload.signal_id)
        if not signal:
            raise SignalNotFoundError(
                f"Signal with ID {payload.signal_id} not found."
            )

        # Retrieve cohort context for M7 risk calculation
        stmt = (
            select(Signal)
            .where(Signal.id != payload.signal_id)
            .limit(settings.candidate_signal_limit)
        )
        candidates = list(db.scalars(stmt).all())

        # Reuse M7 risk service without duplicating formula
        risk_res = risk_service.score_signal(
            signal=signal,
            candidate_signals=candidates,
        )

        # Default priority from M7 risk priority if not explicitly given
        priority: ActionPriorityType = (
            payload.priority if payload.priority is not None else risk_res.priority
        )

        initial_status: ActionStatusType = (
            "ASSIGNED" if payload.assigned_to and payload.assigned_to.strip() else "OPEN"
        )

        action = Action(
            signal_id=signal.id,
            risk_score=risk_res.risk_score,
            title=payload.title,
            description=payload.description,
            assigned_to=payload.assigned_to,
            status=initial_status,
            priority=priority,
            due_date=payload.due_date,
            resolution_notes=payload.resolution_notes,
        )

        db.add(action)
        db.commit()
        db.refresh(action)
        return action

    def get_action(self, db: Session, action_id: int) -> Action:
        """
        Retrieves a single action by integer ID.
        Raises ActionNotFoundError if the record does not exist.
        """
        action = db.get(Action, action_id)
        if not action:
            raise ActionNotFoundError(f"Action with ID {action_id} not found.")
        return action

    def list_actions(
        self,
        db: Session,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        signal_id: Optional[int] = None,
        assigned_to: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Action]:
        """
        Retrieves actions with optional filtering and pagination.
        Ordered newest first by created_at.
        """
        stmt = select(Action).order_by(Action.created_at.desc())

        if status:
            stmt = stmt.where(Action.status == status.strip().upper())
        if priority:
            stmt = stmt.where(Action.priority == priority.strip().upper())
        if signal_id is not None:
            stmt = stmt.where(Action.signal_id == signal_id)
        if assigned_to:
            stmt = stmt.where(Action.assigned_to.ilike(f"%{assigned_to.strip()}%"))

        stmt = stmt.offset(skip).limit(limit)
        return list(db.scalars(stmt).all())

    def update_action(
        self, db: Session, action_id: int, payload: ActionUpdate
    ) -> Action:
        """
        Partially updates action fields, validating lifecycle status transitions.
        """
        action = self.get_action(db, action_id)

        update_data = payload.model_dump(exclude_unset=True)

        # Handle status transition if status is being updated
        if "status" in update_data and update_data["status"]:
            target_status = update_data["status"].strip().upper()
            self.validate_transition(action.status, target_status)
            self._apply_status_side_effects(action, target_status)
            action.status = target_status

        # If assigning while OPEN, transition to ASSIGNED
        if (
            "assigned_to" in update_data
            and update_data["assigned_to"]
            and action.status == "OPEN"
            and "status" not in update_data
        ):
            action.status = "ASSIGNED"

        for field, value in update_data.items():
            if field != "status":
                setattr(action, field, value)

        db.commit()
        db.refresh(action)
        return action

    def assign_action(
        self,
        db: Session,
        action_id: int,
        assigned_to: str,
        notes: Optional[str] = None,
    ) -> Action:
        """
        Assigns an action to personnel or team.
        Transitions OPEN -> ASSIGNED.
        """
        action = self.get_action(db, action_id)
        if action.status not in ("OPEN", "ASSIGNED"):
            self.validate_transition(action.status, "ASSIGNED")

        action.assigned_to = assigned_to
        action.status = "ASSIGNED"

        if notes:
            existing = action.resolution_notes or ""
            action.resolution_notes = (
                f"{existing}\n[Assignment]: {notes}".strip() if existing else f"[Assignment]: {notes}"
            )

        db.commit()
        db.refresh(action)
        return action

    def complete_action(
        self,
        db: Session,
        action_id: int,
        resolution_notes: Optional[str] = None,
    ) -> Action:
        """
        Marks an action COMPLETED from IN_PROGRESS.
        Sets completed_at timestamp.
        """
        action = self.get_action(db, action_id)
        self.validate_transition(action.status, "COMPLETED")

        now = datetime.now(timezone.utc)
        action.status = "COMPLETED"
        if not action.completed_at:
            action.completed_at = now

        if resolution_notes:
            existing = action.resolution_notes or ""
            action.resolution_notes = (
                f"{existing}\n[Completion]: {resolution_notes}".strip()
                if existing
                else f"[Completion]: {resolution_notes}"
            )

        db.commit()
        db.refresh(action)
        return action

    def verify_action(
        self,
        db: Session,
        action_id: int,
        resolution_notes: Optional[str] = None,
    ) -> Action:
        """
        Independently verifies remediation quality from COMPLETED.
        Sets verified_at timestamp.
        """
        action = self.get_action(db, action_id)
        self.validate_transition(action.status, "VERIFIED")

        now = datetime.now(timezone.utc)
        action.status = "VERIFIED"
        if not action.verified_at:
            action.verified_at = now

        if resolution_notes:
            existing = action.resolution_notes or ""
            action.resolution_notes = (
                f"{existing}\n[Verification]: {resolution_notes}".strip()
                if existing
                else f"[Verification]: {resolution_notes}"
            )

        db.commit()
        db.refresh(action)
        return action

    def resolve_action(
        self,
        db: Session,
        action_id: int,
        resolution_notes: Optional[str] = None,
    ) -> Action:
        """
        Formally closes an action as RESOLVED.
        Must transition strictly from VERIFIED.
        """
        action = self.get_action(db, action_id)
        self.validate_transition(action.status, "RESOLVED")

        action.status = "RESOLVED"

        if resolution_notes:
            existing = action.resolution_notes or ""
            action.resolution_notes = (
                f"{existing}\n[Resolution]: {resolution_notes}".strip()
                if existing
                else f"[Resolution]: {resolution_notes}"
            )

        db.commit()
        db.refresh(action)
        return action

    def cancel_action(
        self,
        db: Session,
        action_id: int,
        resolution_notes: Optional[str] = None,
    ) -> Action:
        """
        Cancels an action from any non-terminal state.
        """
        action = self.get_action(db, action_id)
        self.validate_transition(action.status, "CANCELLED")

        action.status = "CANCELLED"

        if resolution_notes:
            existing = action.resolution_notes or ""
            action.resolution_notes = (
                f"{existing}\n[Cancellation]: {resolution_notes}".strip()
                if existing
                else f"[Cancellation]: {resolution_notes}"
            )

        db.commit()
        db.refresh(action)
        return action

    def _apply_status_side_effects(
        self, action: Action, target_status: str
    ) -> None:
        """
        Updates relevant timestamps when transitioning status.
        """
        now = datetime.now(timezone.utc)
        if target_status == "COMPLETED" and not action.completed_at:
            action.completed_at = now
        elif target_status == "VERIFIED" and not action.verified_at:
            action.verified_at = now

    def to_response(
        self,
        action: Action,
        evidence_summary: Optional[str] = None,
    ) -> ActionResponse:
        """
        Converts an Action database model to an ActionResponse schema.
        """
        sig_title = action.signal.title if getattr(action, "signal", None) else None
        return ActionResponse(
            id=action.id,
            signal_id=action.signal_id,
            risk_score=action.risk_score,
            title=action.title,
            description=action.description,
            assigned_to=action.assigned_to,
            status=action.status,
            priority=action.priority,
            due_date=action.due_date,
            created_at=action.created_at,
            updated_at=action.updated_at,
            completed_at=action.completed_at,
            verified_at=action.verified_at,
            resolution_notes=action.resolution_notes,
            signal_title=sig_title,
            evidence_summary=evidence_summary,
        )


# Default singleton instance
action_service = ActionService()
