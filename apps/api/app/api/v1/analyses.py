"""
ResumeForge AI - Resume Analysis & ATS Scoring API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.analysis import AnalysisCreateRequest, AnalysisResponse
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/analyses", tags=["ATS Analysis"])


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def run_ats_analysis(
    payload: AnalysisCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Run mathematical ATS compatibility analysis comparing Resume against Job Description.
    Calculates explainable 0-100 score across 5 weighted pillars.
    """
    service = AnalysisService(db)
    return await service.run_analysis(current_user.id, payload)


@router.get("", response_model=List[AnalysisResponse])
async def list_analyses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List all previous analysis reports for current user."""
    service = AnalysisService(db)
    return await service.list_analyses(current_user.id, skip=skip, limit=limit)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_by_id(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get single ATS analysis report by ID."""
    service = AnalysisService(db)
    return await service.get_analysis(current_user.id, analysis_id)
