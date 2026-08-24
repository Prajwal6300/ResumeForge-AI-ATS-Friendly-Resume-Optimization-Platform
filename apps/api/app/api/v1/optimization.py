"""
ResumeForge AI - AI Optimization & Suggestion API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ai import (
    AIRewriteBulletResponse,
    AISectionImprovementResponse,
    AISuggestionResponse,
    AISuggestionUpdate,
    OptimizeResumeRequest,
    OptimizeSectionRequest,
    RewriteBulletRequest,
)
from app.schemas.resume import ResumeDetailResponse
from app.services.optimization_service import OptimizationService

router = APIRouter(prefix="", tags=["AI Optimization"])


@router.post("/optimization/section", response_model=AISectionImprovementResponse)
async def improve_resume_section(
    payload: OptimizeSectionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    AI-powered section improvement with strict Anti-Fabrication guardrails.
    Rephrases existing content with stronger action verbs and keyword alignment.
    """
    service = OptimizationService(db)
    return await service.improve_section(current_user.id, payload)


@router.post("/optimization/bullet", response_model=AIRewriteBulletResponse)
async def rewrite_resume_bullet(
    payload: RewriteBulletRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    AI-powered bullet rewriting focusing on measurable outcomes and XYZ impact structure.
    """
    service = OptimizationService(db)
    return await service.rewrite_bullet(current_user.id, payload)


@router.post("/optimization/full-resume", response_model=ResumeDetailResponse)
async def optimize_full_resume(
    payload: OptimizeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a tailored, ATS-optimized version of the resume without fabricating experience.
    Creates a new version snapshot.
    """
    service = OptimizationService(db)
    return await service.optimize_full_resume(current_user.id, payload)


@router.get("/resumes/{resume_id}/suggestions", response_model=List[AISuggestionResponse])
async def list_resume_suggestions(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List AI suggestions generated for a resume."""
    service = OptimizationService(db)
    return await service.list_suggestions(current_user.id, resume_id)


@router.patch("/suggestions/{suggestion_id}", response_model=AISuggestionResponse)
async def update_suggestion_status(
    suggestion_id: str,
    payload: AISuggestionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept or reject an AI suggestion."""
    service = OptimizationService(db)
    return await service.update_suggestion_status(current_user.id, suggestion_id, payload.status)
