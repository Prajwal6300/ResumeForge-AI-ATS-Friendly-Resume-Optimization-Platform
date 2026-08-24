"""
ResumeForge AI - Resume & Job Description Matching Engine
Performs deep comparison between candidate resume and target JD.
"""

import re
from typing import Any, Dict, List, Set, Tuple
from app.matching.normalizer import normalize_token, tokenize_text
from app.matching.synonym_matcher import are_skills_equivalent, get_synonyms
from app.schemas.analysis import KeywordMatchDetail
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent


def collect_resume_text_corpus(resume: StructuredResumeContent) -> str:
    """Combine all resume sections into a comprehensive search corpus."""
    chunks: List[str] = []
    
    # Personal
    if resume.personal.title:
        chunks.append(resume.personal.title)
    
    # Summary
    if resume.summary:
        chunks.append(resume.summary)
        
    # Skills
    for cat in resume.skills:
        chunks.extend(cat.items)
        
    # Experience
    for exp in resume.experience:
        chunks.append(exp.position)
        chunks.append(exp.company)
        chunks.extend(exp.highlights)
        
    # Projects
    for proj in resume.projects:
        chunks.append(proj.title)
        if proj.description:
            chunks.append(proj.description)
        chunks.extend(proj.technologies)
        chunks.extend(proj.highlights)
        
    # Education
    for edu in resume.education:
        chunks.append(edu.degree)
        if edu.field_of_study:
            chunks.append(edu.field_of_study)
        chunks.extend(edu.honors)
        
    # Certifications
    for cert in resume.certifications:
        chunks.append(cert.name)
        chunks.append(cert.issuer)
        
    # Achievements
    for ach in resume.achievements:
        chunks.append(ach.title)
        chunks.append(ach.description)

    return " ".join(chunks)


def extract_resume_skill_set(resume: StructuredResumeContent) -> Set[str]:
    """Extract all explicit and implicit skills from the resume."""
    skills: Set[str] = set()
    for cat in resume.skills:
        for item in cat.items:
            skills.add(item.strip())
    for proj in resume.projects:
        for tech in proj.technologies:
            skills.add(tech.strip())
    return skills


def match_resume_to_jd(
    resume: StructuredResumeContent,
    jd: JobDescriptionStructured,
) -> Dict[str, Any]:
    """
    Compare structured resume against structured JD.
    Returns matched keywords, missing keywords, weak keywords, and detailed metrics.
    """
    resume_corpus = collect_resume_text_corpus(resume)
    resume_lower = f" {resume_corpus.lower()} "
    resume_skills = extract_resume_skill_set(resume)

    matched_keywords: List[str] = []
    missing_keywords: List[str] = []
    weak_keywords: List[str] = []
    keyword_details: List[KeywordMatchDetail] = []

    # Combined JD target keywords
    target_skills = list(dict.fromkeys(jd.required_skills + jd.preferred_skills + jd.technologies + jd.keywords))

    matched_count = 0
    total_targets = len(target_skills) if target_skills else 1

    for kw in target_skills:
        kw_clean = kw.strip()
        if not kw_clean:
            continue

        is_required = kw_clean in jd.required_skills
        importance = "required" if is_required else "preferred"

        # Check 1: Direct skill list equality or synonym match
        direct_match = any(are_skills_equivalent(kw_clean, r_skill) for r_skill in resume_skills)

        # Check 2: Word boundary regex in full resume corpus
        regex_match = bool(re.search(r"\b" + re.escape(kw_clean.lower()) + r"\b", resume_lower))

        # Check 3: Check synonyms in resume corpus
        syn_match = False
        synonyms = get_synonyms(kw_clean)
        for syn in synonyms:
            if re.search(r"\b" + re.escape(syn.lower()) + r"\b", resume_lower):
                syn_match = True
                break

        found = direct_match or regex_match or syn_match

        if found:
            matched_keywords.append(kw_clean)
            matched_count += 1
            # Check if weak (mentioned only once with no surrounding context or only in raw text)
            occurrences = len(re.findall(r"\b" + re.escape(kw_clean.lower()) + r"\b", resume_lower))
            if occurrences == 1 and not direct_match:
                weak_keywords.append(kw_clean)
        else:
            missing_keywords.append(kw_clean)

        keyword_details.append(
            KeywordMatchDetail(
                keyword=kw_clean,
                category="technical" if kw_clean in jd.technologies or kw_clean in jd.required_skills else "general",
                importance=importance,
                found_in_resume=found,
                frequency_in_jd=1,
            )
        )

    # Responsibility overlap check
    resp_match_count = 0
    total_resps = len(jd.responsibilities) if jd.responsibilities else 1
    for resp in jd.responsibilities:
        resp_words = tokenize_text(resp)
        sig_words = [w for w in resp_words if len(w) > 4]
        if sig_words:
            matched_words = sum(1 for w in sig_words if w in resume_lower)
            if matched_words / len(sig_words) >= 0.4:
                resp_match_count += 1

    keyword_ratio = (matched_count / total_targets) * 100.0 if total_targets > 0 else 80.0
    resp_ratio = (resp_match_count / total_resps) * 100.0 if total_resps > 0 else 75.0

    return {
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "weak_keywords": weak_keywords,
        "keyword_details": keyword_details,
        "keyword_coverage_ratio": min(100.0, max(0.0, keyword_ratio)),
        "responsibility_coverage_ratio": min(100.0, max(0.0, resp_ratio)),
    }
