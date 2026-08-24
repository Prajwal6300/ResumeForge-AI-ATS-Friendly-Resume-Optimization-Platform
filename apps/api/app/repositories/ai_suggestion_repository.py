"""
ResumeForge AI - AI Suggestion Repository
"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ai_suggestion import AISuggestion
from app.repositories.base_repository import BaseRepository


class AISuggestionRepository(BaseRepository[AISuggestion]):
    def __init__(self, db: AsyncSession):
        super().__init__(AISuggestion, db)

    async def list_by_resume(self, resume_id: str, user_id: str) -> List[AISuggestion]:
        query = (
            select(AISuggestion)
            .where(AISuggestion.resume_id == resume_id, AISuggestion.user_id == user_id)
            .order_by(AISuggestion.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_user(self, suggestion_id: str, user_id: str) -> Optional[AISuggestion]:
        query = select(AISuggestion).where(
            AISuggestion.id == suggestion_id,
            AISuggestion.user_id == user_id,
        )
        result = await self.db.execute(query)
        return result.scalars().first()
