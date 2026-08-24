"""
ResumeForge AI - Job Description API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.job_description import (
    JobDescriptionPaste,
    JobDescriptionResponse,
)
from app.services.job_service import JobDescriptionService

router = APIRouter(prefix="/job-descriptions", tags=["Job Descriptions"])


@router.post("/paste", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def paste_job_description(
    payload: JobDescriptionPaste,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Paste raw Job Description text to analyze keywords, technical requirements, and responsibilities."""
    service = JobDescriptionService(db)
    return await service.create_from_paste(current_user.id, payload)


@router.post("/upload", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def upload_job_description(
    file: UploadFile = File(...),
    title: str = Form("Job Position"),
    company: str = Form(""),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a PDF or DOCX Job Description document."""
    file_bytes = await file.read()
    service = JobDescriptionService(db)
    return await service.create_from_upload(
        user_id=current_user.id,
        file_bytes=file_bytes,
        filename=file.filename or "job_description.pdf",
        title=title,
        company=company,
    )


@router.get("", response_model=List[JobDescriptionResponse])
async def list_job_descriptions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List all saved job descriptions for current user."""
    service = JobDescriptionService(db)
    return await service.list_job_descriptions(current_user.id, skip=skip, limit=limit)


@router.get("/{jd_id}", response_model=JobDescriptionResponse)
async def get_job_description_by_id(
    jd_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get single job description with structured criteria."""
    service = JobDescriptionService(db)
    return await service.get_job_description(current_user.id, jd_id)


@router.delete("/{jd_id}")
async def delete_job_description_by_id(
    jd_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a job description."""
    service = JobDescriptionService(db)
    await service.delete_job_description(current_user.id, jd_id)
    return {"message": "Job description deleted successfully."}
