"""
Database configuration, session management, and Base model for EarlySight Backend.
Uses SQLAlchemy 2.x with psycopg driver for PostgreSQL.
"""

from typing import Generator, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

# 1. SQLAlchemy Engine
# pool_pre_ping=True checks connection validity prior to checkout from pool
# connect_timeout=3 ensures non-blocking responsive health checks when DB is offline
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=settings.debug,
    connect_args={"connect_timeout": 3},
)

# 2. Session Factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# 3. Declarative Base Model for future domain models (Milestone 3+)
class Base(DeclarativeBase):
    """
    Declarative Base class for all EarlySight database models.
    Domain models (Signals, Risks, Actions, etc.) will inherit from this Base.
    """
    pass


# 4. FastAPI Database Session Dependency
def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency yielding an independent database session per request.
    Ensures proper cleanup and closing when request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 5. Lightweight Connectivity Check
def check_database_connection() -> Tuple[bool, str]:
    """
    Executes a quick 'SELECT 1' check to verify PostgreSQL connectivity.
    Does NOT raise unhandled exceptions; returns (is_connected, status_or_error_message).
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True, "connected"
    except Exception as exc:
        # Return cleanly on connection failure, timeout, or missing database
        return False, str(exc)


# 6. Database Table Initialization
def create_tables() -> Tuple[bool, str]:
    """
    Initializes all registered SQLAlchemy database tables.
    Gracefully catches connection failures so application startup does not crash
    when PostgreSQL is offline.
    """
    try:
        # Import models to ensure they are registered with Base.metadata
        from app.models.action import Action  # noqa: F401
        from app.models.signal import Signal  # noqa: F401

        Base.metadata.create_all(bind=engine)
        return True, "tables created"
    except Exception as exc:
        return False, str(exc)
