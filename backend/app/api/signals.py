"""
Operational signals REST API router.
Provides endpoints for listing, retrieving, creating, updating, and deleting signals.
"""

from typing import List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.signal import Signal
from app.schemas.embedding import (
    EmbeddingServiceUnavailableResponse,
    RelatedSignalItem,
    RelatedSignalsResponse,
)
from app.schemas.signal import SignalCreate, SignalResponse, SignalUpdate
from app.services.embedding_service import (
    EmbeddingServiceError,
    EmbeddingServiceNotConfiguredError,
    embedding_service,
)

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


@router.post(
    "/{signal_id}/related",
    response_model=RelatedSignalsResponse,
    responses={
        200: {
            "model": RelatedSignalsResponse,
            "description": "Successful retrieval of semantically related signals",
        },
        404: {"description": "Signal not found in database"},
        503: {
            "model": EmbeddingServiceUnavailableResponse,
            "description": "Database or OpenAI Embedding service is unavailable / not configured",
        },
    },
    summary="Find semantically related signals",
    description=(
        "Retrieves operational signals semantically similar to the target signal "
        "using OpenAI vector embeddings and cosine similarity comparison."
    ),
)
def find_related_signals_endpoint(
    signal_id: int,
    limit: Optional[int] = Query(
        None,
        ge=1,
        le=50,
        description="Maximum number of related signals to return (defaults to configured setting)",
    ),
    threshold: Optional[float] = Query(
        None,
        ge=0.0,
        le=1.0,
        description="Cosine similarity cutoff threshold between 0.0 and 1.0 (defaults to configured setting)",
    ),
    db: Session = Depends(get_db),
) -> Union[RelatedSignalsResponse, JSONResponse]:
    """
    Finds semantically similar operational signals for a given signal ID.
    Gracefully handles missing database, missing signal, and unconfigured embedding service.
    """
    # 1. Retrieve target signal from PostgreSQL
    try:
        target_signal = db.get(Signal, signal_id)
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )

    # 2. Verify target signal exists
    if not target_signal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Signal with ID {signal_id} not found.",
        )

    # 3. Check Embedding Service configuration
    if not embedding_service.is_configured:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Embedding service is not configured. Please configure OPENAI_API_KEY.",
            },
        )

    # 4. Retrieve candidate signals from database (excluding the target signal itself)
    try:
        stmt = (
            select(Signal)
            .where(Signal.id != signal_id)
            .order_by(Signal.created_at.desc())
            .limit(settings.candidate_signal_limit)
        )
        candidate_signals = list(db.scalars(stmt).all())
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )

    if not candidate_signals:
        return RelatedSignalsResponse(
            status="ok",
            signal_id=signal_id,
            related_signals=[],
            model_used=embedding_service.model,
        )

    # 5. Determine active limits and threshold
    active_limit = limit if limit is not None else settings.related_signal_limit
    active_threshold = (
        threshold if threshold is not None else settings.related_signal_threshold
    )

    # 6. Compute similarities
    try:
        related_data = embedding_service.find_related_signals(
            target_signal=target_signal,
            candidate_signals=candidate_signals,
            threshold=active_threshold,
            limit=active_limit,
        )
        return RelatedSignalsResponse(
            status="ok",
            signal_id=signal_id,
            related_signals=[
                item if isinstance(item, RelatedSignalItem) else RelatedSignalItem(**item)
                for item in related_data
            ],
            model_used=embedding_service.model,
        )
    except EmbeddingServiceNotConfiguredError as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": str(exc)},
        )
    except EmbeddingServiceError as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": str(exc)},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during related signal detection.",
        ) from None

