"""
ResumeForge AI - Resume Versioning API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.resume import ResumeDetailResponse
from app.schemas.version import ResumeVersionResponse
from app.services.version_service import VersionService

router = APIRouter(prefix="/resumes", tags=["Resume Versions"])


@router.get("/{resume_id}/versions", response_model=List[ResumeVersionResponse])
async def list_resume_versions(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full version history and snapshots for a resume."""
    service = VersionService(db)
    return await service.list_versions(current_user.id, resume_id)


@router.post("/{resume_id}/versions/{version_id}/restore", response_model=ResumeDetailResponse)
async def restore_resume_version(
    resume_id: str,
    version_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Restore resume state to a previous version snapshot."""
    service = VersionService(db)
    return await service.restore_version(current_user.id, resume_id, version_id)
