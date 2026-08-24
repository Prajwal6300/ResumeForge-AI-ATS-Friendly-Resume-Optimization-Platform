"""
ResumeForge AI - Resume Analysis & ATS Scoring Service
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.ats.recommendations import generate_recommendations
from app.ats.scorer import calculate_ats_score
from app.core.exceptions import NotFoundException
from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.job_repository import JobDescriptionRepository
from app.repositories.resume_repository import ResumeRepository
from app.schemas.analysis import (
    AnalysisCreateRequest,
    AnalysisResponse,
    ATSRecommendation,
    ATSScoreBreakdown,
    KeywordMatchDetail,
)
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent


class AnalysisService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analysis_repo = AnalysisRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.jd_repo = JobDescriptionRepository(db)

    async def run_analysis(self, user_id: str, request: AnalysisCreateRequest) -> AnalysisResponse:
        # 1. Fetch Resume
        resume = await self.resume_repo.get_by_user(request.resume_id, user_id)
        if not resume:
            raise NotFoundException("Resume not found.")

        # If specific version requested, fetch that version's content
        resume_content_dict = resume.parsed_content
        if request.resume_version_id:
            version = await self.resume_repo.get_version(request.resume_id, request.resume_version_id)
            if version:
                resume_content_dict = version.content

        resume_struct = StructuredResumeContent.model_validate(resume_content_dict)

        # 2. Fetch Job Description
        jd = await self.jd_repo.get_by_user(request.jd_id, user_id)
        if not jd:
            raise NotFoundException("Job description not found.")

        jd_struct = JobDescriptionStructured.model_validate(jd.structured_content)

        # 3. Calculate Deterministic ATS Score
        scoring_result = calculate_ats_score(resume_struct, jd_struct)

        # 4. Generate Explainable Recommendations
        recommendations = generate_recommendations(
            resume=resume_struct,
            jd=jd_struct,
            breakdown=scoring_result["breakdown"],
            missing_keywords=scoring_result["missing_keywords"],
            weak_keywords=scoring_result["weak_keywords"],
        )

        critique_summary = (
            f"Your resume matches {len(scoring_result['matched_keywords'])} target keywords with an estimated "
            f"ATS compatibility score of {scoring_result['overall_score']}%. "
            f"Focus on incorporating key missing technical skills ({', '.join(scoring_result['missing_keywords'][:3])}) "
            f"if you possess authentic experience with them."
        )

        # 5. Save Analysis to DB
        analysis = await self.analysis_repo.create(
            user_id=user_id,
            resume_id=request.resume_id,
            resume_version_id=request.resume_version_id,
            jd_id=request.jd_id,
            overall_score=scoring_result["overall_score"],
            breakdown=scoring_result["breakdown"].model_dump(),
            matched_keywords=scoring_result["matched_keywords"],
            missing_keywords=scoring_result["missing_keywords"],
            weak_keywords=scoring_result["weak_keywords"],
            keyword_details=[k.model_dump() for k in scoring_result["keyword_details"]],
            recommendations=[r.model_dump() for r in recommendations],
            summary_critique=critique_summary,
        )

        return AnalysisResponse(
            id=analysis.id,
            user_id=analysis.user_id,
            resume_id=analysis.resume_id,
            resume_version_id=analysis.resume_version_id,
            jd_id=analysis.jd_id,
            overall_score=analysis.overall_score,
            breakdown=ATSScoreBreakdown.model_validate(analysis.breakdown),
            matched_keywords=analysis.matched_keywords,
            missing_keywords=analysis.missing_keywords,
            weak_keywords=analysis.weak_keywords,
            keyword_details=[KeywordMatchDetail.model_validate(kd) for kd in analysis.keyword_details],
            recommendations=[ATSRecommendation.model_validate(rec) for rec in analysis.recommendations],
            summary_critique=analysis.summary_critique,
            created_at=analysis.created_at,
        )

    async def get_analysis(self, user_id: str, analysis_id: str) -> AnalysisResponse:
        analysis = await self.analysis_repo.get_by_user(analysis_id, user_id)
        if not analysis:
            raise NotFoundException("Analysis report not found.")

        return AnalysisResponse(
            id=analysis.id,
            user_id=analysis.user_id,
            resume_id=analysis.resume_id,
            resume_version_id=analysis.resume_version_id,
            jd_id=analysis.jd_id,
            overall_score=analysis.overall_score,
            breakdown=ATSScoreBreakdown.model_validate(analysis.breakdown),
            matched_keywords=analysis.matched_keywords,
            missing_keywords=analysis.missing_keywords,
            weak_keywords=analysis.weak_keywords,
            keyword_details=[KeywordMatchDetail.model_validate(kd) for kd in analysis.keyword_details],
            recommendations=[ATSRecommendation.model_validate(rec) for rec in analysis.recommendations],
            summary_critique=analysis.summary_critique,
            created_at=analysis.created_at,
        )

    async def list_analyses(self, user_id: str, skip: int = 0, limit: int = 100) -> List[AnalysisResponse]:
        analyses = await self.analysis_repo.list_by_user(user_id, skip, limit)
        return [
            AnalysisResponse(
                id=a.id,
                user_id=a.user_id,
                resume_id=a.resume_id,
                resume_version_id=a.resume_version_id,
                jd_id=a.jd_id,
                overall_score=a.overall_score,
                breakdown=ATSScoreBreakdown.model_validate(a.breakdown),
                matched_keywords=a.matched_keywords,
                missing_keywords=a.missing_keywords,
                weak_keywords=a.weak_keywords,
                keyword_details=[KeywordMatchDetail.model_validate(kd) for kd in a.keyword_details],
                recommendations=[ATSRecommendation.model_validate(rec) for rec in a.recommendations],
                summary_critique=a.summary_critique,
                created_at=a.created_at,
            )
            for a in analyses
        ]
