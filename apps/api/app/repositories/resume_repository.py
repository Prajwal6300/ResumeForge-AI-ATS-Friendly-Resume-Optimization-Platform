"""
ResumeForge AI - Resume and Version Repository
"""

from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.resume import Resume
from app.models.resume_version import ResumeVersion
from app.repositories.base_repository import BaseRepository


class ResumeRepository(BaseRepository[Resume]):
    def __init__(self, db: AsyncSession):
        super().__init__(Resume, db)

    async def list_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Resume]:
        query = (
            select(Resume)
            .where(Resume.user_id == user_id, Resume.is_archived == False)
            .order_by(Resume.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_user(self, resume_id: str, user_id: str) -> Optional[Resume]:
        query = (
            select(Resume)
            .options(selectinload(Resume.versions))
            .where(Resume.id == resume_id, Resume.user_id == user_id, Resume.is_archived == False)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_with_initial_version(
        self,
        user_id: str,
        title: str,
        parsed_content: dict,
        original_filename: Optional[str] = None,
        file_url: Optional[str] = None,
        file_type: Optional[str] = None,
        raw_text: Optional[str] = None,
    ) -> Resume:
        resume = Resume(
            user_id=user_id,
            title=title,
            original_filename=original_filename,
            file_url=file_url,
            file_type=file_type,
            raw_text=raw_text,
            parsed_content=parsed_content,
        )
        self.db.add(resume)
        await self.db.flush()

        # Create Version 1 (Original Snapshot)
        v1 = ResumeVersion(
            resume_id=resume.id,
            version_number=1,
            title=f"{title} (Original)",
            content=parsed_content,
            change_summary="Original imported version",
            is_current=True,
        )
        self.db.add(v1)
        await self.db.flush()
        await self.db.refresh(resume)
        return resume

    async def create_new_version(
        self,
        resume: Resume,
        content: dict,
        title: Optional[str] = None,
        change_summary: Optional[str] = None,
    ) -> ResumeVersion:
        # Mark all existing versions for this resume as is_current=False
        await self.db.execute(
            update(ResumeVersion)
            .where(ResumeVersion.resume_id == resume.id)
            .values(is_current=False)
        )

        # Get highest version number
        query = select(ResumeVersion.version_number).where(ResumeVersion.resume_id == resume.id).order_by(ResumeVersion.version_number.desc())
        res = await self.db.execute(query)
        latest_num = res.scalars().first() or 0
        new_version_num = latest_num + 1

        v_title = title or f"Version {new_version_num}"
        new_version = ResumeVersion(
            resume_id=resume.id,
            version_number=new_version_num,
            title=v_title,
            content=content,
            change_summary=change_summary or f"Updated to version {new_version_num}",
            is_current=True,
        )
        self.db.add(new_version)

        # Update parent resume active content
        resume.parsed_content = content
        if title:
            resume.title = title
        await self.db.flush()
        await self.db.refresh(new_version)
        return new_version

    async def get_versions(self, resume_id: str) -> List[ResumeVersion]:
        query = (
            select(ResumeVersion)
            .where(ResumeVersion.resume_id == resume_id)
            .order_by(ResumeVersion.version_number.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_version(self, resume_id: str, version_id: str) -> Optional[ResumeVersion]:
        query = select(ResumeVersion).where(
            ResumeVersion.id == version_id,
            ResumeVersion.resume_id == resume_id,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def restore_version(self, resume: Resume, version: ResumeVersion) -> Resume:
        # Set this version as current
        await self.db.execute(
            update(ResumeVersion)
            .where(ResumeVersion.resume_id == resume.id)
            .values(is_current=False)
        )
        version.is_current = True
        resume.parsed_content = version.content
        await self.db.flush()
        await self.db.refresh(resume)
        return resume
