"""
ResumeForge AI - AI Suggestion Model
Tracks AI suggestions, user acceptance/rejection, and section edits.
"""

from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class AISuggestion(Base, TimestampMixin):
    __tablename__ = "ai_suggestions"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_version_id = Column(String(36), ForeignKey("resume_versions.id", ondelete="SET NULL"), nullable=True)
    analysis_id = Column(String(36), ForeignKey("resume_analyses.id", ondelete="SET NULL"), nullable=True)

    section = Column(String(100), nullable=False)  # "summary", "experience", "skills", "projects", etc.
    item_id = Column(String(100), nullable=True)
    field = Column(String(100), nullable=True)
    original_text = Column(Text, nullable=False)
    suggested_text = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="pending")  # "pending", "accepted", "rejected"

    # Relationships
    user = relationship("User", back_populates="suggestions")
    resume = relationship("Resume", back_populates="suggestions")
    resume_version = relationship("ResumeVersion", back_populates="suggestions")
    analysis = relationship("ResumeAnalysis", back_populates="suggestions")
