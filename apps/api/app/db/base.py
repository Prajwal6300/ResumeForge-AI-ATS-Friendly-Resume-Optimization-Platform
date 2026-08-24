"""
ResumeForge AI - Database Base Model
"""

import uuid
from datetime import datetime, timezone
from typing import Any
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import DeclarativeBase, declared_attr


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    __name__: str

    # Generate __tablename__ automatically from class name
    @declared_attr.directive
    def __tablename__(cls) -> str:
        # Convert CamelCase to snake_case table name
        name = cls.__name__
        import re
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower() + "s"


class TimestampMixin:
    """Mixin for ID and standard timestamps."""
    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=get_utc_now,
        onupdate=get_utc_now,
        nullable=False,
    )
