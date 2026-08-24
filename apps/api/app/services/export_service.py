"""
ResumeForge AI - Export Service
Generates and serves downloadable ATS-friendly PDF and DOCX files.
"""

from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import BadRequestException, NotFoundException
from app.exporters.docx import generate_docx_resume
from app.exporters.pdf import generate_pdf_resume
from app.repositories.export_repository import GeneratedDocumentRepository
from app.repositories.resume_repository import ResumeRepository
from app.schemas.export import ExportRequest, ExportResponse
from app.schemas.resume import StructuredResumeContent
from app.storage import get_storage_service


class ExportService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.resume_repo = ResumeRepository(db)
        self.export_repo = GeneratedDocumentRepository(db)
        self.storage = get_storage_service()

    async def export_document(self, user_id: str, request: ExportRequest) -> ExportResponse:
        resume = await self.resume_repo.get_by_user(request.resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        # Determine content to export (current or specified version)
        content_dict = resume.parsed_content
        if request.version_id:
            version = await self.resume_repo.get_version(request.resume_id, request.version_id)
            if version:
                content_dict = version.content

        resume_struct = StructuredResumeContent.model_validate(content_dict)

        # Generate binary payload
        filename_base = (resume_struct.personal.name or resume.title or "Resume").replace(" ", "_")
        if request.format == "pdf":
            file_bytes = generate_pdf_resume(resume_struct, request.template)
            filename = f"{filename_base}_ATS_Optimized.pdf"
            content_type = "application/pdf"
        elif request.format == "docx":
            file_bytes = generate_docx_resume(resume_struct, request.template)
            filename = f"{filename_base}_ATS_Optimized.docx"
            content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:
            raise BadRequestException("Supported export formats: 'pdf', 'docx'")

        # Save to storage
        file_url = await self.storage.upload_file(
            file_bytes=file_bytes,
            filename=filename,
            content_type=content_type,
            subdir=f"exports/{user_id}",
        )

        doc = await self.export_repo.create(
            user_id=user_id,
            resume_id=request.resume_id,
            resume_version_id=request.version_id,
            format=request.format,
            template_name=request.template,
            file_url=file_url,
            file_size_bytes=len(file_bytes),
        )

        download_url = f"/api/v1/exports/{doc.id}/download"

        return ExportResponse(
            document_id=doc.id,
            resume_id=doc.resume_id,
            format=request.format,
            template=request.template,
            filename=filename,
            download_url=download_url,
            file_size_bytes=len(file_bytes),
            created_at=doc.created_at,
        )

    async def get_document_bytes(self, user_id: str, document_id: str) -> Tuple[bytes, str, str]:
        doc = await self.export_repo.get(document_id)
        if not doc or doc.user_id != user_id:
            raise NotFoundException("Exported document not found.")

        file_bytes = await self.storage.get_file(doc.file_url)
        filename = f"Resume_{doc.template_name}.{doc.format}"
        content_type = "application/pdf" if doc.format == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        return file_bytes, filename, content_type
