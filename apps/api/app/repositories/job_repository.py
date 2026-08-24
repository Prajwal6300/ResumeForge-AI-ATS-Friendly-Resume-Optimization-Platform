"""
ResumeForge AI - Job Description Repository
"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.job_description import JobDescription
from app.repositories.base_repository import BaseRepository


class JobDescriptionRepository(BaseRepository[JobDescription]):
    def __init__(self, db: AsyncSession):
        super().__init__(JobDescription, db)

    async def list_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[JobDescription]:
        query = (
            select(JobDescription)
            .where(JobDescription.user_id == user_id)
            .order_by(JobDescription.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_user(self, jd_id: str, user_id: str) -> Optional[JobDescription]:
        query = select(JobDescription).where(
            JobDescription.id == jd_id,
            JobDescription.user_id == user_id,
        )
        result = await self.db.execute(query)
        return result.scalars().first()
