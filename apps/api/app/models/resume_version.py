"""
ResumeForge AI - Resume Version Model
Tracks immutable snapshots of resume content over time.
"""

from sqlalchemy import Boolean, Column, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ResumeVersion(Base, TimestampMixin):
    __tablename__ = "resume_versions"

    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False, default=1)
    title = Column(String(255), nullable=False)
    content = Column(JSON, nullable=False)
    change_summary = Column(Text, nullable=True)
    is_current = Column(Boolean, default=True, nullable=False)

    # Relationships
    resume = relationship("Resume", back_populates="versions")
    analyses = relationship("ResumeAnalysis", back_populates="resume_version", cascade="all, delete-orphan")
    suggestions = relationship("AISuggestion", back_populates="resume_version", cascade="all, delete-orphan")
    generated_documents = relationship("GeneratedDocument", back_populates="resume_version", cascade="all, delete-orphan")
