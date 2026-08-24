"""
ResumeForge AI - Export API Endpoints
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.exporters.renderer import render_resume_to_html
from app.models.user import User
from app.repositories.resume_repository import ResumeRepository
from app.schemas.export import ExportRequest, ExportResponse
from app.schemas.resume import StructuredResumeContent
from app.services.export_service import ExportService

router = APIRouter(prefix="", tags=["Document Exports"])


@router.post("/exports", response_model=ExportResponse, status_code=status.HTTP_201_CREATED)
async def export_resume_document(
    payload: ExportRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate an ATS-compliant PDF or DOCX export for a resume using selected template.
    """
    service = ExportService(db)
    return await service.export_document(current_user.id, payload)


@router.get("/exports/{document_id}/download")
async def download_exported_file(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Download compiled binary PDF or DOCX document."""
    service = ExportService(db)
    file_bytes, filename, media_type = await service.get_document_bytes(current_user.id, document_id)
    return Response(
        content=file_bytes,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/resumes/{resume_id}/preview", response_class=HTMLResponse)
async def preview_resume_template(
    resume_id: str,
    template: str = Query("classic"),
    version_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Render structured resume data in real-time as styled ATS HTML preview."""
    resume_repo = ResumeRepository(db)
    resume = await resume_repo.get_by_user(resume_id, current_user.id)
    if not resume:
        return HTMLResponse("<h3>Resume not found</h3>", status_code=404)

    content_dict = resume.parsed_content
    if version_id:
        v = await resume_repo.get_version(resume_id, version_id)
        if v:
            content_dict = v.content

    struct = StructuredResumeContent.model_validate(content_dict)
    html_content = render_resume_to_html(struct, template_name=template)
    return HTMLResponse(content=html_content)
