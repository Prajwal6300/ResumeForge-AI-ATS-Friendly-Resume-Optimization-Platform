"""
ResumeForge AI - Schemas Registry
"""

from app.schemas.common import APIResponse, CoreModel
from app.schemas.user import AuthResponse, Token, UserCreate, UserLogin, UserResponse, UserUpdate
from app.schemas.resume import (
    AchievementItem,
    CertificationItem,
    CustomSectionItem,
    EducationItem,
    ExperienceItem,
    PersonalInfo,
    ProjectItem,
    ResumeCreate,
    ResumeDetailResponse,
    ResumeResponse,
    ResumeUpdate,
    SkillCategory,
    StructuredResumeContent,
)
from app.schemas.version import ResumeVersionCreate, ResumeVersionResponse
from app.schemas.job_description import (
    JobDescriptionCreate,
    JobDescriptionPaste,
    JobDescriptionResponse,
    JobDescriptionStructured,
)
from app.schemas.analysis import (
    AnalysisCreateRequest,
    AnalysisResponse,
    ATSRecommendation,
    ATSScoreBreakdown,
    KeywordMatchDetail,
    ScoreCategory,
)
from app.schemas.ai import (
    AIRewriteBulletResponse,
    AISectionImprovementResponse,
    AISuggestionCreate,
    AISuggestionResponse,
    AISuggestionUpdate,
    OptimizeResumeRequest,
    OptimizeSectionRequest,
    RewriteBulletRequest,
)
from app.schemas.export import ExportRequest, ExportResponse

__all__ = [
    "CoreModel",
    "APIResponse",
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "Token",
    "AuthResponse",
    "PersonalInfo",
    "ExperienceItem",
    "EducationItem",
    "ProjectItem",
    "SkillCategory",
    "CertificationItem",
    "AchievementItem",
    "CustomSectionItem",
    "StructuredResumeContent",
    "ResumeCreate",
    "ResumeUpdate",
    "ResumeResponse",
    "ResumeDetailResponse",
    "ResumeVersionCreate",
    "ResumeVersionResponse",
    "JobDescriptionStructured",
    "JobDescriptionPaste",
    "JobDescriptionCreate",
    "JobDescriptionResponse",
    "ScoreCategory",
    "ATSScoreBreakdown",
    "KeywordMatchDetail",
    "ATSRecommendation",
    "AnalysisCreateRequest",
    "AnalysisResponse",
    "AISuggestionCreate",
    "AISuggestionUpdate",
    "AISuggestionResponse",
    "OptimizeSectionRequest",
    "RewriteBulletRequest",
    "OptimizeResumeRequest",
    "AISectionImprovementResponse",
    "AIRewriteBulletResponse",
    "ExportRequest",
    "ExportResponse",
]
