"""
ResumeForge AI - Generated Document Repository
"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.generated_document import GeneratedDocument
from app.repositories.base_repository import BaseRepository


class GeneratedDocumentRepository(BaseRepository[GeneratedDocument]):
    def __init__(self, db: AsyncSession):
        super().__init__(GeneratedDocument, db)

    async def list_by_resume(self, resume_id: str, user_id: str) -> List[GeneratedDocument]:
        query = (
            select(GeneratedDocument)
            .where(GeneratedDocument.resume_id == resume_id, GeneratedDocument.user_id == user_id)
            .order_by(GeneratedDocument.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
