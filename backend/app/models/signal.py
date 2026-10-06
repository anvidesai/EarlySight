"""
SQLAlchemy database model for EarlySight operational signals.
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Signal(Base):
    """
    Operational Signal entity.

    Represents an observed operational data point, event, or report
    (e.g., water leakage, equipment failure, safety concern, crowding)
    that may contribute to emerging risks.
    """

    __tablename__ = "signals"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(
        String(50), nullable=False, default="other", index=True
    )
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    severity: Mapped[str] = mapped_column(
        String(20), nullable=False, default="medium", index=True
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="open", index=True
    )
    source: Mapped[str] = mapped_column(
        String(50), nullable=False, default="manual", index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Signal(id={self.id}, title='{self.title}', severity='{self.severity}', status='{self.status}')>"
