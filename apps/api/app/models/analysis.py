"""
ResumeForge AI - Resume Analysis Model
Stores ATS scores, keyword matching, and explainable recommendations.
"""

from sqlalchemy import Column, Float, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ResumeAnalysis(Base, TimestampMixin):
    __tablename__ = "resume_analyses"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_version_id = Column(String(36), ForeignKey("resume_versions.id", ondelete="SET NULL"), nullable=True)
    jd_id = Column(String(36), ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False, index=True)

    overall_score = Column(Float, nullable=False, default=0.0)
    breakdown = Column(JSON, nullable=False, default=dict)
    matched_keywords = Column(JSON, nullable=False, default=list)
    missing_keywords = Column(JSON, nullable=False, default=list)
    weak_keywords = Column(JSON, nullable=False, default=list)
    keyword_details = Column(JSON, nullable=False, default=list)
    recommendations = Column(JSON, nullable=False, default=list)
    summary_critique = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    resume_version = relationship("ResumeVersion", back_populates="analyses")
    job_description = relationship("JobDescription", back_populates="analyses")
    suggestions = relationship("AISuggestion", back_populates="analysis", cascade="all, delete-orphan")
