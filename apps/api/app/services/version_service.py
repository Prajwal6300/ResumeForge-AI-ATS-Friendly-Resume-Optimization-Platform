"""
ResumeForge AI - Resume Versioning Service
"""

from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.repositories.resume_repository import ResumeRepository
from app.schemas.resume import ResumeDetailResponse, StructuredResumeContent
from app.schemas.version import ResumeVersionResponse


class VersionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.resume_repo = ResumeRepository(db)

    async def list_versions(self, user_id: str, resume_id: str) -> List[ResumeVersionResponse]:
        resume = await self.resume_repo.get_by_user(resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        versions = await self.resume_repo.get_versions(resume_id)
        return [
            ResumeVersionResponse(
                id=v.id,
                resume_id=v.resume_id,
                version_number=v.version_number,
                title=v.title,
                content=StructuredResumeContent.model_validate(v.content),
                change_summary=v.change_summary,
                is_current=v.is_current,
                created_at=v.created_at,
            )
            for v in versions
        ]

    async def restore_version(self, user_id: str, resume_id: str, version_id: str) -> ResumeDetailResponse:
        resume = await self.resume_repo.get_by_user(resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        version = await self.resume_repo.get_version(resume_id, version_id)
        if not version:
            raise NotFoundException("Resume version not found.")

        await self.resume_repo.restore_version(resume, version)
        versions = await self.resume_repo.get_versions(resume_id)

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
            current_version_id=version.id,
            created_at=resume.created_at,
            updated_at=resume.updated_at,
        )
