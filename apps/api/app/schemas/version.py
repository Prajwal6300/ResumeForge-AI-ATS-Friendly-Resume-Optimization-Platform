"""
ResumeForge AI - Resume Version Schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import Field
from app.schemas.common import CoreModel
from app.schemas.resume import StructuredResumeContent


class ResumeVersionCreate(CoreModel):
    title: str = Field(..., max_length=255)
    content: StructuredResumeContent
    change_summary: Optional[str] = Field(None, max_length=500)


class ResumeVersionResponse(CoreModel):
    id: str
    resume_id: str
    version_number: int
    title: str
    content: StructuredResumeContent
    change_summary: Optional[str] = None
    is_current: bool
    created_at: datetime
