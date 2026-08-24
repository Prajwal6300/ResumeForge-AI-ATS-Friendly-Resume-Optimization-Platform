"""
ResumeForge AI - Matching Engine Unit Tests
"""

from app.matching.keyword_extractor import extract_keywords_from_text, parse_job_description_text
from app.matching.matcher import match_resume_to_jd
from app.matching.synonym_matcher import are_skills_equivalent, get_synonyms
from app.parsers.section_extractor import parse_resume_sections


def test_synonym_and_acronym_matching():
    # React variants
    assert are_skills_equivalent("React", "React.js") is True
    assert are_skills_equivalent("reactjs", "React") is True

    # Cloud & Tech
    assert are_skills_equivalent("AWS", "Amazon Web Services") is True
    assert are_skills_equivalent("K8s", "Kubernetes") is True
    assert are_skills_equivalent("Postgres", "PostgreSQL") is True
    assert are_skills_equivalent("Node.js", "Node") is True
    assert are_skills_equivalent("TS", "TypeScript") is True

    # Non-equivalents
    assert are_skills_equivalent("Python", "Java") is False
    assert are_skills_equivalent("Docker", "Kubernetes") is False


def test_keyword_extractor(sample_jd_text: str):
    res = extract_keywords_from_text(sample_jd_text)
    tech = [t.lower() for t in res["technical_skills"]]
    assert "python" in tech
    assert "fastapi" in tech
    assert "react" in tech
    assert "postgresql" in tech or "postgres" in tech


def test_matcher_against_jd(sample_resume_text: str, sample_jd_text: str):
    resume_struct = parse_resume_sections(sample_resume_text)
    jd_struct = parse_job_description_text(sample_jd_text, title="Senior Full-Stack Engineer")

    match_result = match_resume_to_jd(resume_struct, jd_struct)

    matched = [m.lower() for m in match_result["matched_keywords"]]
    assert "python" in matched
    assert "fastapi" in matched
    assert "react" in matched
    assert "docker" in matched

    # Kafka is in JD ("Knowledge of Kafka is a plus") but not in sample resume
    missing = [m.lower() for m in match_result["missing_keywords"]]
    assert "kafka" in missing or "graphql" in missing
