"""
ResumeForge AI - Resume Management Service
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.parsers.docx_parser import DOCXParser
from app.parsers.pdf_parser import PDFParser
from app.parsers.section_extractor import parse_resume_sections
from app.repositories.resume_repository import ResumeRepository
from app.schemas.resume import (
    ResumeBaseResponse,
    ResumeCreate,
    ResumeDetailResponse,
    ResumeResponse,
    ResumeUpdate,
    StructuredResumeContent,
)
from app.storage import get_storage_service


class ResumeService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.resume_repo = ResumeRepository(db)
        self.storage = get_storage_service()

    async def upload_and_parse(
        self,
        user_id: str,
        file_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> ResumeDetailResponse:
        # 1. Validation
        if not file_bytes:
            raise BadRequestException("The uploaded file is empty.")

        size_mb = len(file_bytes) / (1024 * 1024)
        if size_mb > settings.MAX_UPLOAD_SIZE_MB:
            raise BadRequestException(f"File size ({size_mb:.1f}MB) exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit.")

        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise BadRequestException(f"Unsupported file format '.{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS)}")

        # 2. Upload to storage
        stored_url = await self.storage.upload_file(
            file_bytes=file_bytes,
            filename=filename,
            content_type=content_type,
            subdir=f"resumes/{user_id}",
        )

        # 3. Parse text based on format
        if ext == "pdf":
            raw_text = PDFParser.extract_text(file_bytes)
        elif ext == "docx":
            raw_text = DOCXParser.extract_text(file_bytes)
        else:
            raise BadRequestException("Unsupported document type.")

        # 4. Extract structured sections
        structured = parse_resume_sections(raw_text)

        # Determine clean title
        title = filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
        if not title.strip():
            title = "My Resume"

        # 5. Persist resume & version 1 in DB
        resume = await self.resume_repo.create_with_initial_version(
            user_id=user_id,
            title=title,
            parsed_content=structured.model_dump(),
            original_filename=filename,
            file_url=stored_url,
            file_type=ext,
            raw_text=raw_text,
        )

        versions = await self.resume_repo.get_versions(resume.id)
        current_v_id = versions[0].id if versions else None

        return ResumeDetailResponse(
            id=resume.id,
            user_id=resume.user_id,
            title=resume.title,
            original_filename=resume.original_filename,
            file_url=resume.file_url,
            file_type=resume.file_type,
            is_archived=resume.is_archived,
            parsed_content=StructuredResumeContent.model_validate(resume.parsed_content),
            raw_text=resume.raw_text,
            version_count=len(versions),
            current_version_id=current_v_id,
            created_at=resume.created_at,
            updated_at=resume.updated_at,
        )

    async def create_manual(self, user_id: str, payload: ResumeCreate) -> ResumeDetailResponse:
        content = payload.parsed_content.model_dump() if payload.parsed_content else StructuredResumeContent().model_dump()
        resume = await self.resume_repo.create_with_initial_version(
            user_id=user_id,
            title=payload.title,
            parsed_content=content,
            file_type="manual",
            raw_text=payload.raw_text,
        )
        versions = await self.resume_repo.get_versions(resume.id)
        return ResumeDetailResponse(
            id=resume.id,
            user_id=resume.user_id,
            title=resume.title,
            original_filename=resume.original_filename,
            file_url=resume.file_url,
            file_type=resume.file_type,
            is_archived=resume.is_archived,
            parsed_content=StructuredResumeContent.model_validate(resume.parsed_content),
            raw_text=resume.raw_text,
            version_count=len(versions),
            current_version_id=versions[0].id if versions else None,
            created_at=resume.created_at,
            updated_at=resume.updated_at,
        )

    async def get_resume(self, user_id: str, resume_id: str) -> ResumeDetailResponse:
        resume = await self.resume_repo.get_by_user(resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        versions = await self.resume_repo.get_versions(resume.id)
        current_v = next((v for v in versions if v.is_current), versions[0] if versions else None)

        return ResumeDetailResponse(
            id=resume.id,
            user_id=resume.user_id,
            title=resume.title,
            original_filename=resume.original_filename,
            file_url=resume.file_url,
            file_type=resume.file_type,
            is_archived=resume.is_archived,
            parsed_content=StructuredResumeContent.model_validate(resume.parsed_content),
            raw_text=resume.raw_text,
            version_count=len(versions),
            current_version_id=current_v.id if current_v else None,
            created_at=resume.created_at,
            updated_at=resume.updated_at,
        )

    async def update_resume(self, user_id: str, resume_id: str, update_in: ResumeUpdate) -> ResumeDetailResponse:
        resume = await self.resume_repo.get_by_user(resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        content_to_save = update_in.parsed_content.model_dump() if update_in.parsed_content else resume.parsed_content
        title_to_save = update_in.title or resume.title

        # Create a new version snapshot to preserve previous versions
        await self.resume_repo.create_new_version(
            resume=resume,
            content=content_to_save,
            title=title_to_save,
            change_summary=update_in.change_summary or "Manual edit saved",
        )

        return await self.get_resume(user_id, resume.id)

    async def list_resumes(self, user_id: str, skip: int = 0, limit: int = 100) -> List[ResumeBaseResponse]:
        resumes = await self.resume_repo.list_by_user(user_id, skip, limit)
        return [ResumeBaseResponse.model_validate(r) for r in resumes]

    async def delete_resume(self, user_id: str, resume_id: str) -> bool:
        resume = await self.resume_repo.get_by_user(resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")
        return await self.resume_repo.delete(resume_id)
