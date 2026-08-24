"""
ResumeForge AI - Resume Schemas
Structured Resume Data Model for ATS optimization.
"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import Field, field_validator
from app.schemas.common import CoreModel


def default_uuid() -> str:
    return str(uuid.uuid4())


class PersonalInfo(CoreModel):
    name: str = Field(default="", max_length=255)
    email: str = Field(default="", max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)
    location: Optional[str] = Field(default=None, max_length=255)
    linkedin: Optional[str] = Field(default=None, max_length=512)
    github: Optional[str] = Field(default=None, max_length=512)
    website: Optional[str] = Field(default=None, max_length=512)
    title: Optional[str] = Field(default=None, max_length=255)


class ExperienceItem(CoreModel):
    id: str = Field(default_factory=default_uuid)
    company: str = Field(default="", max_length=255)
    position: str = Field(default="", max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    start_date: str = Field(default="", max_length=100)
    end_date: Optional[str] = Field(default=None, max_length=100)
    is_current: Optional[bool] = Field(default=False)
    highlights: List[str] = Field(default_factory=list)


class EducationItem(CoreModel):
    id: str = Field(default_factory=default_uuid)
    institution: str = Field(default="", max_length=255)
    degree: str = Field(default="", max_length=255)
    field_of_study: Optional[str] = Field(default=None, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    start_date: Optional[str] = Field(default=None, max_length=100)
    end_date: Optional[str] = Field(default=None, max_length=100)
    gpa: Optional[str] = Field(default=None, max_length=50)
    honors: List[str] = Field(default_factory=list)


class ProjectItem(CoreModel):
    id: str = Field(default_factory=default_uuid)
    title: str = Field(default="", max_length=255)
    role: Optional[str] = Field(default=None, max_length=255)
    url: Optional[str] = Field(default=None, max_length=512)
    description: Optional[str] = Field(default=None)
    technologies: List[str] = Field(default_factory=list)
    highlights: List[str] = Field(default_factory=list)


class SkillCategory(CoreModel):
    category: str = Field(default="Skills", max_length=100)
    items: List[str] = Field(default_factory=list)


class CertificationItem(CoreModel):
    id: str = Field(default_factory=default_uuid)
    name: str = Field(default="", max_length=255)
    issuer: str = Field(default="", max_length=255)
    issue_date: Optional[str] = Field(default=None, max_length=100)
    expiration_date: Optional[str] = Field(default=None, max_length=100)
    credential_id: Optional[str] = Field(default=None, max_length=255)
    url: Optional[str] = Field(default=None, max_length=512)


class AchievementItem(CoreModel):
    id: str = Field(default_factory=default_uuid)
    title: str = Field(default="", max_length=255)
    date: Optional[str] = Field(default=None, max_length=100)
    description: str = Field(default="")


class CustomSectionItem(CoreModel):
    id: str = Field(default_factory=default_uuid)
    heading: str = Field(default="Additional Section", max_length=255)
    items: List[str] = Field(default_factory=list)


class StructuredResumeContent(CoreModel):
    personal: PersonalInfo = Field(default_factory=PersonalInfo)
    summary: str = Field(default="")
    skills: List[SkillCategory] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)
    achievements: List[AchievementItem] = Field(default_factory=list)
    custom_sections: List[CustomSectionItem] = Field(default_factory=list)


class ResumeCreate(CoreModel):
    title: str = Field(default="My Resume", max_length=255)
    parsed_content: Optional[StructuredResumeContent] = None
    raw_text: Optional[str] = None


class ResumeUpdate(CoreModel):
    title: Optional[str] = Field(None, max_length=255)
    parsed_content: Optional[StructuredResumeContent] = None
    change_summary: Optional[str] = Field(None, max_length=500)


class ResumeBaseResponse(CoreModel):
    id: str
    user_id: str
    title: str
    original_filename: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    is_archived: bool
    created_at: datetime
    updated_at: datetime


class ResumeResponse(ResumeBaseResponse):
    parsed_content: StructuredResumeContent


class ResumeDetailResponse(ResumeResponse):
    raw_text: Optional[str] = None
    version_count: Optional[int] = 1
    current_version_id: Optional[str] = None
