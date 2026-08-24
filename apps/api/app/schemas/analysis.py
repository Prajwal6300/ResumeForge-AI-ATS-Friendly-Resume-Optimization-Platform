"""
ResumeForge AI - Resume Analysis & ATS Score Schemas
"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import Field
from app.schemas.common import CoreModel


def default_uuid() -> str:
    return str(uuid.uuid4())


class ScoreCategory(CoreModel):
    score: float = Field(..., ge=0, le=100)
    weight: float = Field(..., ge=0, le=100)
    weighted_score: float = Field(..., ge=0, le=100)
    feedback: str = ""
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)


class ATSScoreBreakdown(CoreModel):
    keyword_relevance: ScoreCategory
    technical_skills: ScoreCategory
    responsibilities: ScoreCategory
    experience_relevance: ScoreCategory
    resume_structure: ScoreCategory


class KeywordMatchDetail(CoreModel):
    keyword: str
    category: Literal["technical", "soft", "domain", "general"] = "general"
    importance: Literal["required", "preferred", "bonus"] = "required"
    found_in_resume: bool
    frequency_in_jd: int = 1
    context: Optional[str] = None


class ATSRecommendation(CoreModel):
    id: str = Field(default_factory=default_uuid)
    category: Literal["keyword", "experience", "structure", "impact", "formatting"] = "keyword"
    priority: Literal["high", "medium", "low"] = "medium"
    title: str
    description: str
    actionable_step: str
    disclaimer: Optional[str] = "Add this only if you genuinely possess this experience or skill."


class AnalysisCreateRequest(CoreModel):
    resume_id: str
    jd_id: str
    resume_version_id: Optional[str] = None


class AnalysisResponse(CoreModel):
    id: str
    user_id: str
    resume_id: str
    resume_version_id: Optional[str] = None
    jd_id: str
    overall_score: float
    breakdown: ATSScoreBreakdown
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    weak_keywords: List[str] = Field(default_factory=list)
    keyword_details: List[KeywordMatchDetail] = Field(default_factory=list)
    recommendations: List[ATSRecommendation] = Field(default_factory=list)
    summary_critique: Optional[str] = None
    created_at: datetime
