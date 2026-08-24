"""
ResumeForge AI - ATS Actionable Recommendations Generator
Produces explainable, prioritized recommendations with strict Anti-Fabrication notices.
"""

import uuid
from typing import List
from app.schemas.analysis import ATSRecommendation, ATSScoreBreakdown
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent


def generate_recommendations(
    resume: StructuredResumeContent,
    jd: JobDescriptionStructured,
    breakdown: ATSScoreBreakdown,
    missing_keywords: List[str],
    weak_keywords: List[str],
) -> List[ATSRecommendation]:
    """
    Generate prioritized ATS improvement recommendations based on scoring gaps.
    """
    recommendations: List[ATSRecommendation] = []

    # 1. Missing Critical Keywords (High Priority)
    if missing_keywords:
        top_missing = missing_keywords[:6]
        recommendations.append(
            ATSRecommendation(
                id=str(uuid.uuid4()),
                category="keyword",
                priority="high",
                title=f"Incorporate Missing Target Keywords ({len(missing_keywords)} detected)",
                description=f"The job description specifically mentions {', '.join(top_missing)}, which are not found in your resume.",
                actionable_step=f"If you have hands-on experience with {', '.join(top_missing[:3])}, add them to your Technical Skills section or project bullet points.",
                disclaimer="CRITICAL: Add these only if you genuinely have experience with them. Never fabricate skills.",
            )
        )

    # 2. Weak Keyword Placement (Medium Priority)
    if weak_keywords:
        top_weak = weak_keywords[:4]
        recommendations.append(
            ATSRecommendation(
                id=str(uuid.uuid4()),
                category="keyword",
                priority="medium",
                title="Reinforce Weakly Matched Skills",
                description=f"Skills like {', '.join(top_weak)} appear only in passing or lack demonstrated context.",
                actionable_step="Showcase these skills inside active project or work experience bullet points demonstrating how you applied them.",
                disclaimer="Only elaborate on projects you actually performed.",
            )
        )

    # 3. Measurable Impact & Metrics (High / Medium Priority)
    total_metrics = 0
    for exp in resume.experience:
        for h in exp.highlights:
            import re
            if re.search(r"\b(?:\d+%|\$\d+|\d+x|\d+\+?)\b", h):
                total_metrics += 1

    if total_metrics < 2:
        recommendations.append(
            ATSRecommendation(
                id=str(uuid.uuid4()),
                category="impact",
                priority="high",
                title="Quantify Project Outcomes and Business Impact",
                description="ATS and hiring managers strongly favor bullet points with quantifiable metrics (%, $, scale, users, speedup).",
                actionable_step="Use the XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. For example: 'Reduced API response times by 35% through query caching'.",
                disclaimer="Use realistic, accurate metrics from your past work.",
            )
        )

    # 4. Summary Alignment (Medium Priority)
    if not resume.summary or len(resume.summary.split()) < 15:
        recommendations.append(
            ATSRecommendation(
                id=str(uuid.uuid4()),
                category="structure",
                priority="medium",
                title="Add a Tailored Professional Summary",
                description="A concise 2-3 line summary at the top helps both ATS parsers and recruiters quickly identify your core domain fit.",
                actionable_step=f"Craft a summary targeting the '{jd.job_title}' role, highlighting your top strengths in {', '.join(jd.required_skills[:3]) if jd.required_skills else 'your domain'}.",
                disclaimer="Ensure all statements reflect your authentic background.",
            )
        )

    # 5. ATS Formatting & Structure
    if breakdown.resume_structure.score < 85.0:
        recommendations.append(
            ATSRecommendation(
                id=str(uuid.uuid4()),
                category="formatting",
                priority="low",
                title="Improve Section Hierarchy and ATS Readability",
                description="Ensure standard section headers ('Technical Skills', 'Work Experience', 'Education') are used consistently.",
                actionable_step="Use standard single-column ATS templates with clean bullet points and clear date formats.",
                disclaimer=None,
            )
        )

    return recommendations
