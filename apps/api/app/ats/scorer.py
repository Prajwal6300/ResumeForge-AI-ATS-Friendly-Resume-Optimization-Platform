"""
ResumeForge AI - Deterministic ATS Scoring Engine
Calculates weighted, explainable ATS compatibility scores (0-100).
"""

from typing import Dict, Any, List
from app.core.config import settings
from app.ats.rules import evaluate_structure_rules
from app.matching.matcher import match_resume_to_jd
from app.schemas.analysis import ATSScoreBreakdown, ScoreCategory
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent


def calculate_ats_score(
    resume: StructuredResumeContent,
    jd: JobDescriptionStructured,
) -> Dict[str, Any]:
    """
    Deterministically computes ATS compatibility score across 5 weighted pillars.
    """
    match_result = match_resume_to_jd(resume, jd)
    matched_kws = match_result["matched_keywords"]
    missing_kws = match_result["missing_keywords"]
    weak_kws = match_result["weak_keywords"]

    total_kws = len(matched_kws) + len(missing_kws)
    kw_coverage_pct = (len(matched_kws) / total_kws * 100.0) if total_kws > 0 else 85.0

    # Pillar 1: Keyword Relevance (Weight 40%)
    w1 = settings.ATS_WEIGHT_KEYWORD_RELEVANCE
    s1 = max(10.0, min(100.0, kw_coverage_pct))
    c1 = ScoreCategory(
        score=round(s1, 1),
        weight=w1,
        weighted_score=round(s1 * (w1 / 100.0), 1),
        feedback=f"Found {len(matched_kws)} of {total_kws} target keywords from the job description.",
        strengths=[f"Matched: {', '.join(matched_kws[:5])}"] if matched_kws else [],
        improvements=[f"Missing key terms: {', '.join(missing_kws[:5])}"] if missing_kws else ["All target keywords matched!"],
    )

    # Pillar 2: Technical Skills (Weight 25%)
    w2 = settings.ATS_WEIGHT_TECHNICAL_SKILLS
    req_skills = jd.required_skills
    req_matched = [s for s in req_skills if s in matched_kws]
    req_pct = (len(req_matched) / len(req_skills) * 100.0) if req_skills else 80.0
    s2 = max(15.0, min(100.0, req_pct))
    c2 = ScoreCategory(
        score=round(s2, 1),
        weight=w2,
        weighted_score=round(s2 * (w2 / 100.0), 1),
        feedback=f"Matched {len(req_matched)} of {len(req_skills)} essential technical qualifications.",
        strengths=[f"Demonstrated core skills: {', '.join(req_matched[:4])}"] if req_matched else [],
        improvements=[f"Critical missing skills: {', '.join([s for s in req_skills if s not in matched_kws][:4])}"] if len(req_matched) < len(req_skills) else ["Strong technical alignment."],
    )

    # Pillar 3: Responsibilities Alignment (Weight 20%)
    w3 = settings.ATS_WEIGHT_RESPONSIBILITIES
    resp_pct = match_result.get("responsibility_coverage_ratio", 70.0)
    s3 = max(20.0, min(100.0, resp_pct))
    c3 = ScoreCategory(
        score=round(s3, 1),
        weight=w3,
        weighted_score=round(s3 * (w3 / 100.0), 1),
        feedback="Alignment between past role achievements and target role day-to-day responsibilities.",
        strengths=["Highlights align with core duties described in the job post."],
        improvements=["Frame bullet points to more closely address target day-to-day requirements."],
    )

    # Pillar 4: Experience Relevance (Weight 10%)
    w4 = settings.ATS_WEIGHT_EXPERIENCE_RELEVANCE
    total_exp_items = len(resume.experience)
    s4 = min(100.0, max(30.0, total_exp_items * 25.0 + (30.0 if total_exp_items > 0 else 0.0)))
    c4 = ScoreCategory(
        score=round(s4, 1),
        weight=w4,
        weighted_score=round(s4 * (w4 / 100.0), 1),
        feedback="Chronological career depth and role relevance to target title.",
        strengths=[f"Documented {total_exp_items} professional positions/projects."],
        improvements=["Emphasize most recent and relevant roles at the top."] if total_exp_items > 0 else ["Add work experience or comprehensive project experience."],
    )

    # Pillar 5: Resume Structure & Formatting (Weight 5%)
    w5 = settings.ATS_WEIGHT_RESUME_STRUCTURE
    s5, struct_strengths, struct_improvements = evaluate_structure_rules(resume)
    c5 = ScoreCategory(
        score=round(s5, 1),
        weight=w5,
        weighted_score=round(s5 * (w5 / 100.0), 1),
        feedback="Parsing readability, standard headings, bullet formatting, and contact information.",
        strengths=struct_strengths,
        improvements=struct_improvements,
    )

    overall = c1.weighted_score + c2.weighted_score + c3.weighted_score + c4.weighted_score + c5.weighted_score
    overall_score = round(min(100.0, max(0.0, overall)), 1)

    breakdown = ATSScoreBreakdown(
        keyword_relevance=c1,
        technical_skills=c2,
        responsibilities=c3,
        experience_relevance=c4,
        resume_structure=c5,
    )

    return {
        "overall_score": overall_score,
        "breakdown": breakdown,
        "matched_keywords": matched_kws,
        "missing_keywords": missing_kws,
        "weak_keywords": weak_kws,
        "keyword_details": match_result["keyword_details"],
    }
