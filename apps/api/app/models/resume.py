"""
ResumeForge AI - Resume Model
"""

from sqlalchemy import Boolean, Column, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Resume(Base, TimestampMixin):
    __tablename__ = "resumes"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False, default="Untitled Resume")
    original_filename = Column(String(255), nullable=True)
    file_url = Column(String(512), nullable=True)
    file_type = Column(String(50), nullable=True)  # "pdf", "docx", "manual"
    raw_text = Column(Text, nullable=True)
    parsed_content = Column(JSON, nullable=False, default=dict)
    is_archived = Column(Boolean, default=False, nullable=False)

    # Relationships
    user = relationship("User", back_populates="resumes")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan", order_by="ResumeVersion.version_number.desc()")
    analyses = relationship("ResumeAnalysis", back_populates="resume", cascade="all, delete-orphan")
    suggestions = relationship("AISuggestion", back_populates="resume", cascade="all, delete-orphan")
    generated_documents = relationship("GeneratedDocument", back_populates="resume", cascade="all, delete-orphan")
