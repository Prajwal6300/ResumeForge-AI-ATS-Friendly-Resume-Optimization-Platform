"""
ResumeForge AI - Resume API Endpoints
"""

from typing import Annotated, List
from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.resume import (
    ResumeBaseResponse,
    ResumeCreate,
    ResumeDetailResponse,
    ResumeUpdate,
)
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeDetailResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload and parse a PDF or DOCX resume document."""
    file_bytes = await file.read()
    service = ResumeService(db)
    return await service.upload_and_parse(
        user_id=current_user.id,
        file_bytes=file_bytes,
        filename=file.filename or "resume.pdf",
        content_type=file.content_type or "application/octet-stream",
    )


@router.post("", response_model=ResumeDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_resume_manually(
    payload: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new resume manually from structured JSON."""
    service = ResumeService(db)
    return await service.create_manual(current_user.id, payload)


@router.get("", response_model=List[ResumeBaseResponse])
async def list_my_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List all active resumes for the authenticated user."""
    service = ResumeService(db)
    return await service.list_resumes(current_user.id, skip=skip, limit=limit)


@router.get("/{resume_id}", response_model=ResumeDetailResponse)
async def get_resume_by_id(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full structured resume details and parsed sections."""
    service = ResumeService(db)
    return await service.get_resume(current_user.id, resume_id)


@router.put("/{resume_id}", response_model=ResumeDetailResponse)
async def update_resume_by_id(
    resume_id: str,
    payload: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update resume content and automatically create a new version snapshot."""
    service = ResumeService(db)
    return await service.update_resume(current_user.id, resume_id, payload)


@router.delete("/{resume_id}")
async def delete_resume_by_id(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a resume."""
    service = ResumeService(db)
    await service.delete_resume(current_user.id, resume_id)
    return {"message": "Resume deleted successfully."}
