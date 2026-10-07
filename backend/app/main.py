"""
Main FastAPI entry point for EarlySight Backend API.
Includes health check, PostgreSQL connectivity, Signals API router, and AI service router.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.actions import router as actions_router
from app.api.ai import router as ai_router
from app.api.evidence import router as evidence_router
from app.api.risks import router as risks_router
from app.api.signals import router as signals_router
from app.config import settings
from app.database import check_database_connection, create_tables


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan handler.
    Attempts table creation on startup if PostgreSQL is reachable.
    Fails gracefully without halting application boot if database is offline.
    """
    success, _ = create_tables()
    if success:
        print("[EarlySight] Database tables initialized successfully.")
    else:
        print("[EarlySight] Database unavailable at startup; table initialization deferred.")
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.app_description,
    debug=settings.debug,
    lifespan=lifespan,
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(signals_router, prefix="/api/signals", tags=["Signals"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])
app.include_router(risks_router, prefix="/api/risks", tags=["Risks"])
app.include_router(evidence_router, prefix="/api/evidence", tags=["Evidence"])
app.include_router(actions_router, prefix="/api/actions", tags=["Actions"])


@app.get("/", tags=["Root"])
def read_root() -> Dict[str, str]:
    """
    Root endpoint for EarlySight Backend API.
    """
    return {"message": "EarlySight Backend API"}


@app.get("/api/health", tags=["Health"])
def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify backend operational readiness,
    PostgreSQL database connectivity, AI service configuration,
    and Embedding service status.
    """
    db_connected, _ = check_database_connection()
    ai_status = "configured" if settings.is_ai_configured else "unavailable"
    embeddings_status = (
        "configured" if settings.is_embeddings_configured else "unavailable"
    )
    overall_status = "healthy" if db_connected else "degraded"

    return {
        "status": overall_status,
        "service": "EarlySight Backend",
        "database": "connected" if db_connected else "unavailable",
        "ai": ai_status,
        "embeddings": embeddings_status,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
