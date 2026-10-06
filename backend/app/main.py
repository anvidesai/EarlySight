"""
Main FastAPI entry point for EarlySight Backend API.
Includes health check with PostgreSQL connectivity verification and Signals API router.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/", tags=["Root"])
def read_root() -> Dict[str, str]:
    """
    Root endpoint for EarlySight Backend API.
    """
    return {"message": "EarlySight Backend API"}


@app.get("/api/health", tags=["Health"])
def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify backend operational readiness
    and PostgreSQL database connectivity.
    """
    db_connected, _ = check_database_connection()

    if db_connected:
        return {
            "status": "healthy",
            "service": "EarlySight Backend",
            "database": "connected",
        }
    else:
        return {
            "status": "degraded",
            "service": "EarlySight Backend",
            "database": "unavailable",
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
