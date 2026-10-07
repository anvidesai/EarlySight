"""
SQLAlchemy database model for EarlySight preventive actions and resolution lifecycle (Milestone 9).
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Action(Base):
    """
    Preventive Action and Resolution entity.

    Tracks mitigation workflows converted from identified risks through:
    OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> VERIFIED -> RESOLVED (or CANCELLED).
    Linked to the originating Signal.
    """

    __tablename__ = "actions"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    signal_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("signals.id"), nullable=False, index=True
    )
    risk_score: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )
    title: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True
    )
    assigned_to: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="OPEN", index=True
    )
    priority: Mapped[str] = mapped_column(
        String(50), nullable=False, default="MEDIUM", index=True
    )
    due_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
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
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    verified_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    resolution_notes: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True
    )

    # Optional relationship to originating Signal
    signal: Mapped[Optional["Signal"]] = relationship(  # noqa: F821
        "Signal", foreign_keys=[signal_id], lazy="selectin"
    )

    def __repr__(self) -> str:
        return (
            f"<Action(id={self.id}, signal_id={self.signal_id}, title='{self.title}', "
            f"status='{self.status}', priority='{self.priority}')>"
        )
