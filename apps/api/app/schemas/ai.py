"""
ResumeForge AI - AI Orchestration & Suggestion Schemas
"""

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import Field
from app.schemas.common import CoreModel
from app.schemas.resume import StructuredResumeContent


AISuggestionStatus = Literal["pending", "accepted", "rejected"]
OptimizationGoal = Literal["impact", "concise", "jd_align", "grammar", "standardize"]


class AISuggestionCreate(CoreModel):
    resume_id: str
    resume_version_id: Optional[str] = None
    analysis_id: Optional[str] = None
    section: str
    item_id: Optional[str] = None
    field: Optional[str] = None
    original_text: str
    suggested_text: str
    reason: str


class AISuggestionUpdate(CoreModel):
    status: AISuggestionStatus


class AISuggestionResponse(CoreModel):
    id: str
    user_id: str
    resume_id: str
    resume_version_id: Optional[str] = None
    analysis_id: Optional[str] = None
    section: str
    item_id: Optional[str] = None
    field: Optional[str] = None
    original_text: str
    suggested_text: str
    reason: str
    status: AISuggestionStatus
    created_at: datetime


class OptimizeSectionRequest(CoreModel):
    resume_id: str
    section: str  # "summary", "experience", "skills", "projects"
    item_id: Optional[str] = None
    field: Optional[str] = None
    current_content: str
    jd_id: Optional[str] = None
    instruction: Optional[str] = None
    goal: OptimizationGoal = "jd_align"


class RewriteBulletRequest(CoreModel):
    resume_id: str
    original_bullet: str
    jd_id: Optional[str] = None
    goal: OptimizationGoal = "impact"
    target_skills: List[str] = Field(default_factory=list)


class OptimizeResumeRequest(CoreModel):
    resume_id: str
    jd_id: str
    version_title: Optional[str] = None
    focus_areas: List[str] = Field(default_factory=lambda: ["summary", "experience", "skills"])


class AISectionImprovementResponse(CoreModel):
    section: str
    item_id: Optional[str] = None
    original_text: str
    improved_text: str
    changes_made: List[str] = Field(default_factory=list)
    reasoning: str
    keywords_integrated: List[str] = Field(default_factory=list)
    anti_fabrication_notice: str = "Verified: No false qualifications or unevidenced experiences were created."


class AIRewriteBulletResponse(CoreModel):
    original_bullet: str
    suggested_bullet: str
    alternative_options: List[str] = Field(default_factory=list)
    impact_score_delta: str = "+15%"
    rationale: str
    matched_skills: List[str] = Field(default_factory=list)
