"""
AI Operational Intelligence API router.
Provides endpoints for AI-powered signal analysis, summarization, and structured reasoning.
"""

from typing import Union

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.signal import Signal
from app.schemas.ai import (
    AIServiceUnavailableResponse,
    SignalAnalysisResponse,
)
from app.services.ai_service import (
    AIServiceError,
    AIServiceNotConfiguredError,
    ai_service,
)

router = APIRouter()


@router.post(
    "/analyze-signal/{signal_id}",
    response_model=SignalAnalysisResponse,
    responses={
        200: {"model": SignalAnalysisResponse, "description": "Successful structured AI analysis"},
        404: {"description": "Signal not found in database"},
        503: {
            "model": AIServiceUnavailableResponse,
            "description": "Database or OpenAI AI service is unavailable / not configured",
        },
    },
    summary="Analyze operational signal with AI",
    description="Loads a signal by ID, passes its details to the configured OpenAI model, and returns structured intelligence.",
)
def analyze_signal_endpoint(
    signal_id: int,
    db: Session = Depends(get_db),
) -> Union[SignalAnalysisResponse, JSONResponse]:
    """
    Analyzes an operational signal using OpenAI.
    Gracefully handles missing database, missing signal, and unconfigured AI service.
    """
    # 1. Retrieve signal from PostgreSQL
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

    # 2. Verify signal exists
    if not signal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Signal with ID {signal_id} not found.",
        )

    # 3. Check AI Service configuration
    if not ai_service.is_configured:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "message": "AI service is not configured. Please configure OPENAI_API_KEY.",
            },
        )

    # 4. Perform structured AI analysis
    try:
        analysis_result = ai_service.analyze_signal(signal)
        return SignalAnalysisResponse(
            signal_id=signal.id,
            signal_title=signal.title,
            status="analyzed",
            analysis=analysis_result,
            model_used=ai_service.model,
        )
    except AIServiceNotConfiguredError as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": str(exc)},
        )
    except AIServiceError as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unavailable", "message": str(exc)},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during AI signal analysis.",
        ) from None
