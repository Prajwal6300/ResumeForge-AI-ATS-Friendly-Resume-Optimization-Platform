"""
ResumeForge AI - Generated Document Model
Tracks exported PDF and DOCX files.
"""

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class GeneratedDocument(Base, TimestampMixin):
    __tablename__ = "generated_documents"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_version_id = Column(String(36), ForeignKey("resume_versions.id", ondelete="SET NULL"), nullable=True)

    format = Column(String(20), nullable=False)  # "pdf", "docx"
    template_name = Column(String(100), nullable=False, default="classic")
    file_url = Column(String(512), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)

    # Relationships
    user = relationship("User", back_populates="generated_documents")
    resume = relationship("Resume", back_populates="generated_documents")
    resume_version = relationship("ResumeVersion", back_populates="generated_documents")
