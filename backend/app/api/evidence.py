"""
Evidence and Explainability REST API router (Milestone 8).
Provides endpoints for retrieving structured operational evidence,
evidence-strength classification, and factual explainability summaries.
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
from app.schemas.evidence import (
    EvidenceResponse,
    EvidenceServiceUnavailableResponse,
)
from app.services.embedding_service import embedding_service
from app.services.evidence_service import evidence_service
from app.services.risk_service import risk_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "",
    response_model=List[EvidenceResponse],
    responses={
        200: {
            "model": List[EvidenceResponse],
            "description": "List of structured evidence and explainability summaries, sorted by risk score descending.",
        },
        503: {
            "model": EvidenceServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="List operational evidence syntheses",
    description=(
        "Retrieves operational signals and synthesizes their structured evidence breakdowns. "
        "Supports filtering by evidence strength (LOW, MODERATE, HIGH) and categorical risk level. "
        "Results are ordered by risk score descending by default."
    ),
)
def list_evidence(
    evidence_strength: Optional[str] = Query(
        None,
        description="Filter by evidence strength: LOW, MODERATE, HIGH (case-insensitive).",
        examples=["HIGH"],
    ),
    risk_level: Optional[str] = Query(
        None,
        description="Filter by categorical risk level: LOW, MODERATE, HIGH, CRITICAL (case-insensitive).",
        examples=["CRITICAL"],
    ),
    minimum_score: Optional[int] = Query(
        None,
        ge=0,
        le=100,
        description="Filter for signals with a composite risk score greater than or equal to this threshold.",
        examples=[50],
    ),
    skip: int = Query(0, ge=0, description="Number of evidence records to skip for pagination."),
    limit: int = Query(
        50,
        ge=1,
        le=100,
        description="Maximum number of evidence records to return (1 to 100).",
    ),
    db: Session = Depends(get_db),
) -> Union[List[EvidenceResponse], JSONResponse]:
    """
    Returns structured evidence summaries across active operational signals.
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

    results: List[EvidenceResponse] = []
    for sig in signals:
        candidates = [c for c in signals if c.id != sig.id]
        risk_res = risk_service.score_signal(
            signal=sig,
            candidate_signals=candidates,
            related_eval_failed=not embedding_service.is_configured,
        )
        evidence_res = evidence_service.build_evidence(
            signal=sig,
            risk_response=risk_res,
            candidate_signals=candidates,
            related_eval_failed=not embedding_service.is_configured,
        )
        results.append(evidence_res)

    # 1. Filter by evidence_strength (case-insensitive) if specified
    if evidence_strength:
        target_strength = evidence_strength.strip().upper()
        results = [
            item
            for item in results
            if item.evidence_strength.upper() == target_strength
        ]

    # 2. Filter by risk_level (case-insensitive) if specified
    if risk_level:
        target_level = risk_level.strip().upper()
        results = [
            item for item in results if item.risk_level.upper() == target_level
        ]

    # 3. Filter by minimum_score if specified
    if minimum_score is not None:
        results = [item for item in results if item.risk_score >= minimum_score]

    # 4. Sort by risk score descending by default
    results.sort(key=lambda item: item.risk_score, reverse=True)

    # 5. Apply pagination slice
    return results[skip : skip + limit]


@router.get(
    "/{signal_id}",
    response_model=EvidenceResponse,
    responses={
        200: {
            "model": EvidenceResponse,
            "description": "Structured operational evidence, evidence strength, risk factors, and explainable narrative.",
        },
        404: {"description": "Signal not found in database."},
        503: {
            "model": EvidenceServiceUnavailableResponse,
            "description": "Database service is currently offline or unreachable.",
        },
    },
    summary="Get structured evidence for signal",
    description=(
        "Answers why a signal/risk was flagged as important by synthesizing primary signal facts, "
        "corroborating M6 precursor signals, location recurrence, category frequency, and trend activity."
    ),
)
def get_signal_evidence(
    signal_id: int = Path(..., ge=1, description="Unique integer signal identifier"),
    db: Session = Depends(get_db),
) -> Union[EvidenceResponse, JSONResponse]:
    """
    Retrieves and synthesizes structured evidence and explainable narrative for a specific signal.
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

    # 3. Retrieve candidate signals for cohort context
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

    # 4. Detect related signals via M6 embedding service if configured
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

    # 5. Compute M7 risk score
    risk_res = risk_service.score_signal(
        signal=signal,
        related_signals=related_signals,
        candidate_signals=candidates,
        related_eval_failed=related_eval_failed,
    )

    # 6. Build structured evidence response
    return evidence_service.build_evidence(
        signal=signal,
        risk_response=risk_res,
        candidate_signals=candidates,
        related_signals=related_signals,
        related_eval_failed=related_eval_failed,
    )
