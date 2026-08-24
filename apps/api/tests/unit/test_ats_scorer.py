"""
ResumeForge AI - ATS Scorer & Recommendations Unit Tests
"""

from app.ats.recommendations import generate_recommendations
from app.ats.rules import evaluate_structure_rules
from app.ats.scorer import calculate_ats_score
from app.matching.keyword_extractor import parse_job_description_text
from app.parsers.section_extractor import parse_resume_sections


def test_ats_structure_rules(sample_resume_text: str):
    resume = parse_resume_sections(sample_resume_text)
    score, strengths, improvements = evaluate_structure_rules(resume)
    assert 70.0 <= score <= 100.0
    assert len(strengths) >= 2


def test_deterministic_ats_scoring(sample_resume_text: str, sample_jd_text: str):
    resume = parse_resume_sections(sample_resume_text)
    jd = parse_job_description_text(sample_jd_text)

    result = calculate_ats_score(resume, jd)
    assert 0.0 <= result["overall_score"] <= 100.0
    assert result["breakdown"].keyword_relevance.weight == 40.0
    assert result["breakdown"].technical_skills.weight == 25.0
    assert result["breakdown"].responsibilities.weight == 20.0
    assert result["breakdown"].experience_relevance.weight == 10.0
    assert result["breakdown"].resume_structure.weight == 5.0

    # Ensure recommendations are produced with anti-fabrication disclaimer
    recs = generate_recommendations(
        resume=resume,
        jd=jd,
        breakdown=result["breakdown"],
        missing_keywords=result["missing_keywords"],
        weak_keywords=result["weak_keywords"],
    )
    assert len(recs) >= 1
    # Check disclaimer exists
    assert any("genuinely" in (r.disclaimer or "").lower() for r in recs)
