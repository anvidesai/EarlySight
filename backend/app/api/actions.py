"""
Preventive Actions and Resolution Lifecycle REST API router (Milestone 9).
Provides endpoints for creating, assigning, progressing, verifying, and resolving
mitigation actions linked to operational risks.
"""

import logging
from typing import List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.action import (
    ActionAssignRequest,
    ActionCancelRequest,
    ActionCompleteRequest,
    ActionCreate,
    ActionResolveRequest,
    ActionResponse,
    ActionServiceUnavailableResponse,
    ActionUpdate,
    ActionVerifyRequest,
)
from app.services.action_service import (
    ActionNotFoundError,
    InvalidActionTransitionError,
    SignalNotFoundError,
    action_service,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "",
    response_model=ActionResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {
            "model": ActionResponse,
            "description": "Preventive action created successfully from risk/signal.",
        },
        404: {"description": "Originating signal not found."},
        503: {
            "model": ActionServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="Create preventive action from risk",
    description=(
        "Converts an identified signal/risk into a trackable preventive action. "
        "Automatically links the originating signal, calculates and records the current "
        "M7 risk score for traceability, and defaults priority to the risk priority if omitted."
    ),
)
def create_action_endpoint(
    payload: ActionCreate,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Creates a new preventive action linked to an operational signal."""
    try:
        action = action_service.create_action(db=db, payload=payload)
        return action_service.to_response(action)
    except SignalNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )


@router.get(
    "",
    response_model=List[ActionResponse],
    responses={
        200: {
            "model": List[ActionResponse],
            "description": "Paginated list of preventive actions, ordered newest first.",
        },
        503: {
            "model": ActionServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="List preventive actions",
    description=(
        "Retrieves a paginated list of preventive actions with optional filtering by "
        "status (OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, VERIFIED, RESOLVED, CANCELLED), "
        "priority, originating signal ID, or assigned personnel."
    ),
)
def list_actions_endpoint(
    status_filter: Optional[str] = Query(
        None,
        alias="status",
        description="Filter by workflow status (case-insensitive)",
        examples=["IN_PROGRESS"],
    ),
    priority_filter: Optional[str] = Query(
        None,
        alias="priority",
        description="Filter by priority ranking (case-insensitive)",
        examples=["HIGH"],
    ),
    signal_id: Optional[int] = Query(
        None,
        ge=1,
        description="Filter by originating signal ID",
        examples=[1],
    ),
    assigned_to: Optional[str] = Query(
        None,
        description="Filter by assigned personnel name or team (partial match)",
        examples=["Maintenance Team"],
    ),
    skip: int = Query(0, ge=0, description="Number of actions to skip for pagination"),
    limit: int = Query(
        50,
        ge=1,
        le=100,
        description="Maximum number of actions to return (1 to 100)",
    ),
    db: Session = Depends(get_db),
) -> Union[List[ActionResponse], JSONResponse]:
    """Lists actions with filtering and pagination."""
    try:
        actions = action_service.list_actions(
            db=db,
            status=status_filter,
            priority=priority_filter,
            signal_id=signal_id,
            assigned_to=assigned_to,
            skip=skip,
            limit=limit,
        )
        return [action_service.to_response(a) for a in actions]
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )


@router.get(
    "/{action_id}",
    response_model=ActionResponse,
    responses={
        200: {
            "model": ActionResponse,
            "description": "Action details retrieved successfully.",
        },
        404: {"description": "Action not found in database."},
        503: {
            "model": ActionServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="Get preventive action by ID",
    description="Retrieves a specific action record including lifecycle status and timestamps.",
)
def get_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Retrieves an action by ID."""
    try:
        action = action_service.get_action(db=db, action_id=action_id)
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )


@router.patch(
    "/{action_id}",
    response_model=ActionResponse,
    responses={
        200: {
            "model": ActionResponse,
            "description": "Action updated successfully.",
        },
        400: {"description": "Invalid lifecycle transition requested."},
        404: {"description": "Action not found in database."},
        503: {
            "model": ActionServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="Update preventive action",
    description="Partially updates action fields, strictly validating lifecycle state transitions.",
)
def update_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    payload: ActionUpdate = ...,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Updates fields on an existing action record."""
    try:
        action = action_service.update_action(
            db=db, action_id=action_id, payload=payload
        )
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except InvalidActionTransitionError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )


@router.post(
    "/{action_id}/assign",
    response_model=ActionResponse,
    responses={
        200: {"description": "Action assigned successfully."},
        400: {"description": "Invalid lifecycle transition."},
        404: {"description": "Action not found."},
        503: {"model": ActionServiceUnavailableResponse},
    },
    summary="Assign action",
    description="Assigns an action to personnel or team and sets status to ASSIGNED.",
)
def assign_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    payload: ActionAssignRequest = ...,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Assigns an action to personnel/team."""
    try:
        action = action_service.assign_action(
            db=db,
            action_id=action_id,
            assigned_to=payload.assigned_to,
            notes=payload.notes,
        )
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except InvalidActionTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": "Database service is currently unavailable."},
        )


@router.post(
    "/{action_id}/complete",
    response_model=ActionResponse,
    responses={
        200: {"description": "Action marked completed."},
        400: {"description": "Invalid lifecycle transition."},
        404: {"description": "Action not found."},
        503: {"model": ActionServiceUnavailableResponse},
    },
    summary="Complete action",
    description="Transitions an in-progress action to COMPLETED and records completed_at timestamp.",
)
def complete_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    payload: Optional[ActionCompleteRequest] = None,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Marks an action completed."""
    try:
        notes = payload.resolution_notes if payload else None
        action = action_service.complete_action(
            db=db, action_id=action_id, resolution_notes=notes
        )
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except InvalidActionTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": "Database service is currently unavailable."},
        )


@router.post(
    "/{action_id}/verify",
    response_model=ActionResponse,
    responses={
        200: {"description": "Action verified successfully."},
        400: {"description": "Invalid lifecycle transition."},
        404: {"description": "Action not found."},
        503: {"model": ActionServiceUnavailableResponse},
    },
    summary="Verify action remediation",
    description="Independently verifies that completed mitigation resolves the hazard and records verified_at timestamp.",
)
def verify_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    payload: Optional[ActionVerifyRequest] = None,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Verifies remediation quality of a completed action."""
    try:
        notes = payload.resolution_notes if payload else None
        action = action_service.verify_action(
            db=db, action_id=action_id, resolution_notes=notes
        )
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except InvalidActionTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": "Database service is currently unavailable."},
        )


@router.post(
    "/{action_id}/resolve",
    response_model=ActionResponse,
    responses={
        200: {"description": "Action formally resolved and closed."},
        400: {"description": "Invalid lifecycle transition (must be VERIFIED first)."},
        404: {"description": "Action not found."},
        503: {"model": ActionServiceUnavailableResponse},
    },
    summary="Resolve action",
    description="Formally closes an action as RESOLVED. An action must be VERIFIED prior to resolution.",
)
def resolve_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    payload: Optional[ActionResolveRequest] = None,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Formally resolves an action after verification."""
    try:
        notes = payload.resolution_notes if payload else None
        action = action_service.resolve_action(
            db=db, action_id=action_id, resolution_notes=notes
        )
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except InvalidActionTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": "Database service is currently unavailable."},
        )


@router.post(
    "/{action_id}/cancel",
    response_model=ActionResponse,
    responses={
        200: {"description": "Action cancelled."},
        400: {"description": "Invalid transition."},
        404: {"description": "Action not found."},
        503: {"model": ActionServiceUnavailableResponse},
    },
    summary="Cancel action",
    description="Cancels an action and records cancellation justification.",
)
def cancel_action_endpoint(
    action_id: int = Path(..., ge=1, description="Unique integer action identifier"),
    payload: Optional[ActionCancelRequest] = None,
    db: Session = Depends(get_db),
) -> Union[ActionResponse, JSONResponse]:
    """Cancels an action."""
    try:
        notes = payload.resolution_notes if payload else None
        action = action_service.cancel_action(
            db=db, action_id=action_id, resolution_notes=notes
        )
        return action_service.to_response(action)
    except ActionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except InvalidActionTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except SQLAlchemyError:
        db.rollback()
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": "Database service is currently unavailable."},
        )
