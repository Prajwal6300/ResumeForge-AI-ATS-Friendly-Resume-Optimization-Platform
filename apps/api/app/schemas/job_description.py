"""
ResumeForge AI - Job Description Schemas
"""

from datetime import datetime
from typing import List, Optional
from pydantic import Field
from app.schemas.common import CoreModel


class JobDescriptionStructured(CoreModel):
    job_title: str = Field(default="", max_length=255)
    company: Optional[str] = Field(default=None, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    experience_level: Optional[str] = Field(default=None, max_length=100)
    years_of_experience: Optional[str] = Field(default=None, max_length=100)
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    qualifications: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    domain_keywords: List[str] = Field(default_factory=list)


class JobDescriptionPaste(CoreModel):
    title: str = Field(default="Untitled Job Description", max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    raw_text: str = Field(..., min_length=20, max_length=50000)


class JobDescriptionCreate(CoreModel):
    title: str = Field(..., max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    raw_text: str
    structured_content: Optional[JobDescriptionStructured] = None


class JobDescriptionResponse(CoreModel):
    id: str
    user_id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    raw_text: str
    structured_content: JobDescriptionStructured
    created_at: datetime
    updated_at: datetime
