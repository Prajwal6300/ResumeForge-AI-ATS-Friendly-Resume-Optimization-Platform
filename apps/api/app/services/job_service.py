"""
ResumeForge AI - Job Description Service
"""

from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.matching.keyword_extractor import parse_job_description_text
from app.parsers.docx_parser import DOCXParser
from app.parsers.pdf_parser import PDFParser
from app.parsers.text_cleaner import clean_text
from app.repositories.job_repository import JobDescriptionRepository
from app.schemas.job_description import (
    JobDescriptionCreate,
    JobDescriptionPaste,
    JobDescriptionResponse,
    JobDescriptionStructured,
)


class JobDescriptionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.jd_repo = JobDescriptionRepository(db)

    async def create_from_paste(self, user_id: str, payload: JobDescriptionPaste) -> JobDescriptionResponse:
        cleaned_text = clean_text(payload.raw_text)
        if len(cleaned_text) < 20:
            raise BadRequestException("Job description text is too short to analyze.")

        structured = parse_job_description_text(
            raw_text=cleaned_text,
            title=payload.title,
            company=payload.company or "",
        )

        jd = await self.jd_repo.create(
            user_id=user_id,
            title=payload.title,
            company=payload.company,
            location=payload.location,
            raw_text=cleaned_text,
            structured_content=structured.model_dump(),
        )

        return JobDescriptionResponse(
            id=jd.id,
            user_id=jd.user_id,
            title=jd.title,
            company=jd.company,
            location=jd.location,
            raw_text=jd.raw_text,
            structured_content=JobDescriptionStructured.model_validate(jd.structured_content),
            created_at=jd.created_at,
            updated_at=jd.updated_at,
        )

    async def create_from_upload(
        self,
        user_id: str,
        file_bytes: bytes,
        filename: str,
        title: str = "",
        company: str = "",
    ) -> JobDescriptionResponse:
        if not file_bytes:
            raise BadRequestException("Uploaded file is empty.")

        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext == "pdf":
            raw_text = PDFParser.extract_text(file_bytes)
        elif ext == "docx":
            raw_text = DOCXParser.extract_text(file_bytes)
        else:
            raise BadRequestException("Supported formats for JD upload: PDF, DOCX")

        clean_raw = clean_text(raw_text)
        doc_title = title.strip() or filename.rsplit(".", 1)[0].replace("_", " ").title()

        structured = parse_job_description_text(
            raw_text=clean_raw,
            title=doc_title,
            company=company,
        )

        jd = await self.jd_repo.create(
            user_id=user_id,
            title=doc_title,
            company=company or structured.company,
            location=structured.location,
            raw_text=clean_raw,
            structured_content=structured.model_dump(),
        )

        return JobDescriptionResponse(
            id=jd.id,
            user_id=jd.user_id,
            title=jd.title,
            company=jd.company,
            location=jd.location,
            raw_text=jd.raw_text,
            structured_content=JobDescriptionStructured.model_validate(jd.structured_content),
            created_at=jd.created_at,
            updated_at=jd.updated_at,
        )

    async def get_job_description(self, user_id: str, jd_id: str) -> JobDescriptionResponse:
        jd = await self.jd_repo.get_by_user(jd_id, user_id)
        if not jd:
            raise NotFoundException("Job description not found.")

        return JobDescriptionResponse(
            id=jd.id,
            user_id=jd.user_id,
            title=jd.title,
            company=jd.company,
            location=jd.location,
            raw_text=jd.raw_text,
            structured_content=JobDescriptionStructured.model_validate(jd.structured_content),
            created_at=jd.created_at,
            updated_at=jd.updated_at,
        )

    async def list_job_descriptions(self, user_id: str, skip: int = 0, limit: int = 100) -> List[JobDescriptionResponse]:
        jds = await self.jd_repo.list_by_user(user_id, skip, limit)
        return [
            JobDescriptionResponse(
                id=j.id,
                user_id=j.user_id,
                title=j.title,
                company=j.company,
                location=j.location,
                raw_text=j.raw_text,
                structured_content=JobDescriptionStructured.model_validate(j.structured_content),
                created_at=j.created_at,
                updated_at=j.updated_at,
            )
            for j in jds
        ]

    async def delete_job_description(self, user_id: str, jd_id: str) -> bool:
        jd = await self.jd_repo.get_by_user(jd_id, user_id)
        if not jd:
            raise NotFoundException("Job description not found.")
        return await self.jd_repo.delete(jd_id)
