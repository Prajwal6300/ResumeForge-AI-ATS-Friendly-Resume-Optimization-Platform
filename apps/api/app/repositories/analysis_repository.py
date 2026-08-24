"""
ResumeForge AI - Resume Analysis Repository
"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.analysis import ResumeAnalysis
from app.repositories.base_repository import BaseRepository


class AnalysisRepository(BaseRepository[ResumeAnalysis]):
    def __init__(self, db: AsyncSession):
        super().__init__(ResumeAnalysis, db)

    async def list_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[ResumeAnalysis]:
        query = (
            select(ResumeAnalysis)
            .where(ResumeAnalysis.user_id == user_id)
            .order_by(ResumeAnalysis.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_user(self, analysis_id: str, user_id: str) -> Optional[ResumeAnalysis]:
        query = select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == user_id,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def list_by_resume(self, resume_id: str, user_id: str) -> List[ResumeAnalysis]:
        query = (
            select(ResumeAnalysis)
            .where(ResumeAnalysis.resume_id == resume_id, ResumeAnalysis.user_id == user_id)
            .order_by(ResumeAnalysis.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
