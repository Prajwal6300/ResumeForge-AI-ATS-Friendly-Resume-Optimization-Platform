"""
ResumeForge AI - AI Optimization & Suggestion Service
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.orchestrator import ai_orchestrator
from app.ai.prompts.bullet_rewriting import build_bullet_rewrite_prompt
from app.ai.prompts.optimization import build_full_optimization_prompt
from app.ai.prompts.section_improvement import build_section_improvement_prompt
from app.core.exceptions import BadRequestException, NotFoundException
from app.repositories.ai_suggestion_repository import AISuggestionRepository
from app.repositories.job_repository import JobDescriptionRepository
from app.repositories.resume_repository import ResumeRepository
from app.schemas.ai import (
    AIRewriteBulletResponse,
    AISectionImprovementResponse,
    AISuggestionCreate,
    AISuggestionResponse,
    AISuggestionStatus,
    OptimizeResumeRequest,
    OptimizeSectionRequest,
    RewriteBulletRequest,
)
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import ResumeDetailResponse, StructuredResumeContent


class OptimizationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.resume_repo = ResumeRepository(db)
        self.jd_repo = JobDescriptionRepository(db)
        self.suggestion_repo = AISuggestionRepository(db)

    async def improve_section(
        self,
        user_id: str,
        request: OptimizeSectionRequest,
    ) -> AISectionImprovementResponse:
        resume = await self.resume_repo.get_by_user(request.resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        jd_text = ""
        if request.jd_id:
            jd = await self.jd_repo.get_by_user(request.jd_id, user_id)
            if jd:
                jd_text = jd.raw_text

        prompt = build_section_improvement_prompt(
            section=request.section,
            content=request.current_content,
            jd_text=jd_text,
            instruction=request.instruction or f"Optimize for {request.goal}",
        )

        result: AISectionImprovementResponse = await ai_orchestrator.execute_structured_task(
            task_prompt=prompt,
            schema=AISectionImprovementResponse,
        )

        # Store as pending suggestion
        await self.suggestion_repo.create(
            user_id=user_id,
            resume_id=request.resume_id,
            section=request.section,
            item_id=request.item_id,
            field=request.field,
            original_text=request.current_content,
            suggested_text=result.improved_text,
            reason=result.reasoning,
            status="pending",
        )

        return result

    async def rewrite_bullet(
        self,
        user_id: str,
        request: RewriteBulletRequest,
    ) -> AIRewriteBulletResponse:
        resume = await self.resume_repo.get_by_user(request.resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        jd_text = ""
        if request.jd_id:
            jd = await self.jd_repo.get_by_user(request.jd_id, user_id)
            if jd:
                jd_text = jd.raw_text

        prompt = build_bullet_rewrite_prompt(
            bullet=request.original_bullet,
            jd_text=jd_text,
            goal=request.goal,
        )

        result: AIRewriteBulletResponse = await ai_orchestrator.execute_structured_task(
            task_prompt=prompt,
            schema=AIRewriteBulletResponse,
        )

        return result

    async def optimize_full_resume(
        self,
        user_id: str,
        request: OptimizeResumeRequest,
    ) -> ResumeDetailResponse:
        resume = await self.resume_repo.get_by_user(request.resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        jd = await self.jd_repo.get_by_user(request.jd_id, user_id)
        if not jd:
            raise NotFoundException("Job description not found.")

        resume_struct = StructuredResumeContent.model_validate(resume.parsed_content)
        jd_struct = JobDescriptionStructured.model_validate(jd.structured_content)

        prompt = build_full_optimization_prompt(resume_struct, jd_struct)

        optimized_content: StructuredResumeContent = await ai_orchestrator.execute_structured_task(
            task_prompt=prompt,
            schema=StructuredResumeContent,
        )

        # Create a new version snapshot for the optimized resume
        version_title = request.version_title or f"Optimized for {jd.title}"
        await self.resume_repo.create_new_version(
            resume=resume,
            content=optimized_content.model_dump(),
            title=resume.title,
            change_summary=f"AI-optimized version tailored for {jd.title} at {jd.company or 'Target Company'}",
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

    async def update_suggestion_status(
        self,
        user_id: str,
        suggestion_id: str,
        status: AISuggestionStatus,
    ) -> AISuggestionResponse:
        suggestion = await self.suggestion_repo.get_by_user(suggestion_id, user_id)
        if not suggestion:
            raise NotFoundException("Suggestion not found.")

        updated = await self.suggestion_repo.update(suggestion_id, status=status)
        return AISuggestionResponse.model_validate(updated)

    async def list_suggestions(self, user_id: str, resume_id: str) -> List[AISuggestionResponse]:
        suggestions = await self.suggestion_repo.list_by_resume(resume_id, user_id)
        return [AISuggestionResponse.model_validate(s) for s in suggestions]
