"""
ResumeForge AI - ATS Accuracy & Edge Case Tests
Validates determinism, explainability, deduplication of keywords, and conservative matching.
"""

from app.ats.scorer import calculate_ats_score
from app.matching.keyword_extractor import parse_job_description_text
from app.matching.matcher import match_resume_to_jd
from app.matching.synonym_matcher import are_skills_equivalent
from app.parsers.section_extractor import parse_resume_sections
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent


def test_duplicate_keywords_do_not_inflate_score():
    resume_text = """
    Jane Developer
    jane@example.com
    
    Technical Skills
    Languages: Python, Python, Python, python, FastApi, Fastapi
    
    Work Experience
    Software Engineer | Tech Corp
    2022 - Present
    - Wrote Python and Python code with FastAPI.
    """
    resume = parse_resume_sections(resume_text)

    # JD with repeated occurrences of Python
    jd_text = """
    Python Developer
    Required: Python, Python, FastAPI, Docker, Kubernetes.
    Responsibilities: Develop Python services, scale Python backends.
    """
    jd = parse_job_description_text(jd_text, title="Python Developer")

    res1 = calculate_ats_score(resume, jd)
    res2 = calculate_ats_score(resume, jd)

    # Must be 100% deterministic
    assert res1["overall_score"] == res2["overall_score"]

    # Target keywords must be deduplicated
    matched_kws = res1["matched_keywords"]
    assert len(matched_kws) == len(set(matched_kws))
    assert "Docker" in res1["missing_keywords"] or "docker" in [m.lower() for m in res1["missing_keywords"]]
    assert "Kubernetes" in res1["missing_keywords"] or "kubernetes" in [m.lower() for m in res1["missing_keywords"]]


def test_conservative_synonym_matching():
    # True positives
    assert are_skills_equivalent("react", "react.js") is True
    assert are_skills_equivalent("AWS", "Amazon Web Services") is True
    assert are_skills_equivalent("PostgreSQL", "postgres") is True
    assert are_skills_equivalent("K8s", "Kubernetes") is True

    # False positive prevention
    assert are_skills_equivalent("Python", "Java") is False
    assert are_skills_equivalent("React", "Angular") is False
    assert are_skills_equivalent("Docker", "AWS") is False
    assert are_skills_equivalent("Redis", "MongoDB") is False
    assert are_skills_equivalent("HTML", "C++") is False


def test_empty_resume_scoring_resilience():
    empty_resume = StructuredResumeContent()
    jd = parse_job_description_text("Backend Engineer: Python, Docker, AWS", title="Backend Engineer")

    result = calculate_ats_score(empty_resume, jd)
    assert 0.0 <= result["overall_score"] <= 100.0
    assert len(result["matched_keywords"]) == 0
    assert len(result["missing_keywords"]) >= 2
