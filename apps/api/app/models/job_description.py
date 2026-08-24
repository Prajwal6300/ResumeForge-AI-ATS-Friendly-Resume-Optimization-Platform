"""
ResumeForge AI - Job Description Model
"""

from sqlalchemy import Column, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class JobDescription(Base, TimestampMixin):
    __tablename__ = "job_descriptions"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    structured_content = Column(JSON, nullable=False, default=dict)

    # Relationships
    user = relationship("User", back_populates="job_descriptions")
    analyses = relationship("ResumeAnalysis", back_populates="job_description", cascade="all, delete-orphan")
