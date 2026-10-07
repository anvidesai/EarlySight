"""
Operational Risk Scoring and Prioritization REST API router (Milestone 7).
Provides endpoints for calculating transparent, explainable 0–100 risk scores,
evaluating risk factors, and ranking prioritized operational hazards.
"""

import logging
from typing import List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.signal import Signal
from app.schemas.risk import (
    RiskScoreResponse,
    RiskServiceUnavailableResponse,
)
from app.services.embedding_service import embedding_service
from app.services.risk_service import risk_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "",
    response_model=List[RiskScoreResponse],
    responses={
        200: {
            "model": List[RiskScoreResponse],
            "description": "List of dynamically evaluated operational risk objects, sorted by risk score descending.",
        },
        503: {
            "model": RiskServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="List prioritized operational risks",
    description=(
        "Retrieves operational signals and calculates their current dynamic risk scores. "
        "Supports filtering by categorical risk level and minimum score cutoff. "
        "Results are ordered by risk score descending by default for operational dashboard views."
    ),
)
def list_risks(
    risk_level: Optional[str] = Query(
        None,
        description="Filter by categorical risk level: LOW, MODERATE, HIGH, CRITICAL (case-insensitive).",
        examples=["HIGH"],
    ),
    minimum_score: Optional[int] = Query(
        None,
        ge=0,
        le=100,
        description="Filter for signals with a composite risk score greater than or equal to this threshold.",
        examples=[50],
    ),
    skip: int = Query(0, ge=0, description="Number of evaluated risks to skip for pagination."),
    limit: int = Query(
        50,
        ge=1,
        le=100,
        description="Maximum number of evaluated risks to return (1 to 100).",
    ),
    db: Session = Depends(get_db),
) -> Union[List[RiskScoreResponse], JSONResponse]:
    """
    Returns prioritized operational risks calculated dynamically from stored signals.
    Gracefully handles database outage with HTTP 503.
    """
    try:
        stmt = (
            select(Signal)
            .order_by(Signal.created_at.desc())
            .limit(settings.candidate_signal_limit)
        )
        signals = list(db.scalars(stmt).all())
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )

    if not signals:
        return []

    # Score each signal dynamically within the candidate cohort context
    scored_items: List[RiskScoreResponse] = []
    for sig in signals:
        candidates = [c for c in signals if c.id != sig.id]
        score_obj = risk_service.score_signal(
            signal=sig,
            candidate_signals=candidates,
            related_eval_failed=not embedding_service.is_configured,
        )
        scored_items.append(score_obj)

    # 1. Filter by risk_level (case-insensitive) if specified
    if risk_level:
        target_level = risk_level.strip().upper()
        scored_items = [
            item for item in scored_items if item.risk_level.upper() == target_level
        ]

    # 2. Filter by minimum_score if specified
    if minimum_score is not None:
        scored_items = [
            item for item in scored_items if item.risk_score >= minimum_score
        ]

    # 3. Sort by risk score descending by default
    scored_items.sort(key=lambda item: item.risk_score, reverse=True)

    # 4. Apply pagination slice
    return scored_items[skip : skip + limit]


@router.get(
    "/{signal_id}",
    response_model=RiskScoreResponse,
    responses={
        200: {
            "model": RiskScoreResponse,
            "description": "Dynamic risk score, level, priority, and 5-factor breakdown for the signal.",
        },
        404: {"description": "Signal not found in database."},
        503: {
            "model": RiskServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="Get dynamic risk score for signal",
    description=(
        "Loads an operational signal from PostgreSQL, evaluates its severity, frequency, "
        "recurrence, related-signal similarity (via M6), and trend factors, and returns "
        "a transparent 0–100 score, categorical tier, priority rank, and explainable breakdown."
    ),
)
def get_signal_risk(
    signal_id: int = Path(..., ge=1, description="Unique integer signal identifier"),
    db: Session = Depends(get_db),
) -> Union[RiskScoreResponse, JSONResponse]:
    """
    Evaluates and returns the dynamic risk score and explainable breakdown for a specific signal.
    """
    # 1. Retrieve target signal from database
    try:
        signal = db.get(Signal, signal_id)
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "Database service is currently unavailable. Please verify PostgreSQL connection.",
            },
        )

    # 2. Verify signal existence
    if not signal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Signal with ID {signal_id} not found.",
        )

    # 3. Retrieve candidate signals for cohort frequency, recurrence, and related signal evaluation
    try:
        stmt = (
            select(Signal)
            .where(Signal.id != signal_id)
            .order_by(Signal.created_at.desc())
            .limit(settings.candidate_signal_limit)
        )
        candidates = list(db.scalars(stmt).all())
    except SQLAlchemyError:
        candidates = []

    # 4. Integrate M6 related signals if embedding service is configured
    related_signals = None
    related_eval_failed = False

    if embedding_service.is_configured and candidates:
        try:
            related_signals = embedding_service.find_related_signals(
                target_signal=signal,
                candidate_signals=candidates,
                threshold=settings.related_signal_threshold,
                limit=settings.related_signal_limit,
            )
        except Exception as exc:
            logger.warning(
                "Embedding similarity search failed for signal %s: %s",
                signal_id,
                exc,
            )
            related_eval_failed = True
    elif not embedding_service.is_configured:
        related_eval_failed = True

    # 5. Calculate transparent risk score dynamically
    return risk_service.score_signal(
        signal=signal,
        related_signals=related_signals,
        candidate_signals=candidates,
        related_eval_failed=related_eval_failed,
    )
