"""
Operational signals REST API router.
Provides endpoints for listing, retrieving, creating, updating, and deleting signals.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.signal import Signal
from app.schemas.signal import SignalCreate, SignalResponse, SignalUpdate

router = APIRouter()


@router.get(
    "",
    response_model=List[SignalResponse],
    summary="List operational signals",
    description="Retrieve a paginated list of operational signals, ordered newest first.",
)
def list_signals(
    skip: int = Query(0, ge=0, description="Number of records to skip for pagination"),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of records to return (1 to 100)"
    ),
    db: Session = Depends(get_db),
) -> List[SignalResponse]:
    """Returns a paginated list of operational signals."""
    try:
        stmt = (
            select(Signal)
            .order_by(Signal.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        signals = db.scalars(stmt).all()
        return list(signals)
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable. Please verify PostgreSQL connection.",
        ) from None


@router.get(
    "/{signal_id}",
    response_model=SignalResponse,
    summary="Get signal by ID",
    description="Retrieve details of a single operational signal by its integer ID.",
)
def get_signal(signal_id: int, db: Session = Depends(get_db)) -> SignalResponse:
    """Returns a single signal by ID."""
    try:
        signal = db.get(Signal, signal_id)
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Signal with ID {signal_id} not found.",
            )
        return signal
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable. Please verify PostgreSQL connection.",
        ) from None


@router.post(
    "",
    response_model=SignalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create operational signal",
    description="Register a new operational incident, report, or signal in the database.",
)
def create_signal(
    payload: SignalCreate, db: Session = Depends(get_db)
) -> SignalResponse:
    """Creates a new operational signal record."""
    try:
        signal = Signal(**payload.model_dump())
        db.add(signal)
        db.commit()
        db.refresh(signal)
        return signal
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable. Please verify PostgreSQL connection.",
        ) from None


@router.patch(
    "/{signal_id}",
    response_model=SignalResponse,
    summary="Update operational signal",
    description="Partially update an existing operational signal by ID.",
)
def update_signal(
    signal_id: int, payload: SignalUpdate, db: Session = Depends(get_db)
) -> SignalResponse:
    """Updates fields on an existing signal."""
    try:
        signal = db.get(Signal, signal_id)
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Signal with ID {signal_id} not found.",
            )

        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(signal, field, value)

        db.commit()
        db.refresh(signal)
        return signal
    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable. Please verify PostgreSQL connection.",
        ) from None


@router.delete(
    "/{signal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete operational signal",
    description="Delete an operational signal record by its integer ID.",
)
def delete_signal(signal_id: int, db: Session = Depends(get_db)) -> Response:
    """Deletes a signal by ID."""
    try:
        signal = db.get(Signal, signal_id)
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Signal with ID {signal_id} not found.",
            )

        db.delete(signal)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable. Please verify PostgreSQL connection.",
        ) from None
