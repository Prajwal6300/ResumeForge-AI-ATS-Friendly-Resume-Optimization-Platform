"""
ResumeForge AI - User Model
"""

from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, default="")
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_descriptions = relationship("JobDescription", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")
    suggestions = relationship("AISuggestion", back_populates="user", cascade="all, delete-orphan")
    generated_documents = relationship("GeneratedDocument", back_populates="user", cascade="all, delete-orphan")
