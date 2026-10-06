"""
Main FastAPI entry point for EarlySight Backend API.
"""

from typing import Dict
from fastapi import FastAPI
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.app_description,
    debug=settings.debug,
)


@app.get("/", tags=["Root"])
def read_root() -> Dict[str, str]:
    """
    Root endpoint for EarlySight Backend API.
    """
    return {"message": "EarlySight Backend API"}


@app.get("/api/health", tags=["Health"])
def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify backend operational readiness.
    """
    return {
        "status": "healthy",
        "service": "EarlySight Backend",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
