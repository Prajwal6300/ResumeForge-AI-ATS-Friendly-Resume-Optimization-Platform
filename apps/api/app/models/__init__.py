"""
ResumeForge AI - Database Models Registry
"""

from app.db.base import Base, TimestampMixin
from app.models.user import User
from app.models.resume import Resume
from app.models.resume_version import ResumeVersion
from app.models.job_description import JobDescription
from app.models.analysis import ResumeAnalysis
from app.models.ai_suggestion import AISuggestion
from app.models.generated_document import GeneratedDocument

__all__ = [
    "Base",
    "TimestampMixin",
    "User",
    "Resume",
    "ResumeVersion",
    "JobDescription",
    "ResumeAnalysis",
    "AISuggestion",
    "GeneratedDocument",
]
