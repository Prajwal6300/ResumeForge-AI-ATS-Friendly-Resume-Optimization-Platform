"""
ResumeForge AI - Keyword & Skill Extractor
Identifies technical skills, soft skills, domain keywords, and responsibilities from text.
"""

import re
from typing import Dict, List, Set, Tuple
from app.matching.normalizer import normalize_token, tokenize_text, get_ngrams
from app.schemas.job_description import JobDescriptionStructured

# Known skill vocabulary for high-precision extraction
COMMON_TECH_SKILLS = [
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang", "rust",
    "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "sql", "html", "css", "bash", "shell",
    # Frontend
    "react", "react.js", "next.js", "vue", "vue.js", "angular", "svelte", "tailwind", "tailwind css",
    "bootstrap", "redux", "redux toolkit", "mobx", "webpack", "vite", "sass", "less", "html5", "css3",
    # Backend
    "node.js", "nodejs", "express", "fastapi", "django", "flask", "spring", "spring boot",
    "asp.net", "rails", "ruby on rails", "graphql", "rest", "restful", "grpc", "microservices",
    # Databases & Caches
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "sqlite",
    "dynamodb", "cassandra", "mariadb", "oracle", "prisma", "sqlalchemy",
    # Cloud & DevOps
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
    "terraform", "ansible", "jenkins", "ci/cd", "github actions", "gitlab ci", "helm", "linux", "nginx",
    # AI / ML / Data
    "machine learning", "deep learning", "nlp", "llm", "pandas", "numpy", "pytorch", "tensorflow",
    "scikit-learn", "data science", "langchain", "huggingface", "computer vision",
    # Architecture & Tools
    "git", "github", "gitlab", "jira", "confluence", "postman", "figma", "jest", "pytest",
    "vitest", "cypress", "playwright", "tdd", "agile", "scrum",
]

COMMON_SOFT_SKILLS = [
    "leadership", "communication", "collaboration", "teamwork", "problem solving",
    "critical thinking", "adaptability", "time management", "mentorship", "project management",
    "analytical skills", "troubleshooting", "attention to detail", "decision making",
    "stakeholder management", "cross-functional",
]


def extract_keywords_from_text(text: str) -> Dict[str, List[str]]:
    """Extract categorized keywords from arbitrary raw text."""
    lower_text = f" {text.lower()} "
    words = tokenize_text(text)
    bigrams = get_ngrams(words, 2)
    trigrams = get_ngrams(words, 3)
    all_phrases = set(words + bigrams + trigrams)

    matched_tech: Set[str] = set()
    for skill in COMMON_TECH_SKILLS:
        skill_clean = skill.lower()
        # Word boundary search
        pattern = r"\b" + re.escape(skill_clean) + r"\b"
        if re.search(pattern, lower_text):
            matched_tech.add(skill.title() if len(skill) > 3 and not skill.endswith(".js") else skill)

    matched_soft: Set[str] = set()
    for soft in COMMON_SOFT_SKILLS:
        pattern = r"\b" + re.escape(soft) + r"\b"
        if re.search(pattern, lower_text):
            matched_soft.add(soft.title())

    # Extract capitalized technical acronyms (e.g. AWS, CI/CD, REST, SQL, API)
    raw_acronyms = set(re.findall(r"\b[A-Z]{2,6}(?:/[A-Z]{2,6})?\b", text))
    for acr in raw_acronyms:
        if acr.lower() not in {"the", "and", "for", "with", "from", "that", "this", "have"}:
            matched_tech.add(acr)

    return {
        "technical_skills": sorted(list(matched_tech)),
        "soft_skills": sorted(list(matched_soft)),
        "all_keywords": sorted(list(matched_tech.union(matched_soft))),
    }


def parse_job_description_text(raw_text: str, title: str = "Job Position", company: str = "") -> JobDescriptionStructured:
    """Extract structured fields from raw Job Description text."""
    extracted = extract_keywords_from_text(raw_text)
    
    # Extract responsibilities lines (lines starting with - or containing action verbs)
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
    responsibilities: List[str] = []
    qualifications: List[str] = []

    current_mode = "general"
    for line in lines:
        lower_line = line.lower()
        if any(h in lower_line for h in ["responsibilities", "what you will do", "duties", "role overview"]):
            current_mode = "responsibilities"
            continue
        elif any(h in lower_line for h in ["requirements", "qualifications", "what you need", "what you bring", "must have"]):
            current_mode = "qualifications"
            continue

        if line.startswith(("-", "*", "•")):
            clean_item = re.sub(r"^[-\*•\d.]+\s*", "", line).strip()
            if clean_item and len(clean_item) > 10:
                if current_mode == "responsibilities":
                    responsibilities.append(clean_item)
                elif current_mode == "qualifications":
                    qualifications.append(clean_item)
                else:
                    responsibilities.append(clean_item)

    # Detect experience level
    exp_level = "Mid-Level"
    if any(w in raw_text.lower() for w in ["senior", "lead", "staff", "principal"]):
        exp_level = "Senior"
    elif any(w in raw_text.lower() for w in ["junior", "entry", "intern", "associate", "graduate"]):
        exp_level = "Entry-Level"

    # Detect years of experience
    yoe_match = re.search(r"(\d+\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?))", raw_text, re.IGNORECASE)
    years_exp = yoe_match.group(1) if yoe_match else "2+ years"

    # Separate required vs preferred skills
    tech = extracted["technical_skills"]
    half = max(1, len(tech) * 3 // 4)
    req_skills = tech[:half]
    pref_skills = tech[half:]

    return JobDescriptionStructured(
        job_title=title,
        company=company,
        experience_level=exp_level,
        years_of_experience=years_exp,
        required_skills=req_skills,
        preferred_skills=pref_skills,
        responsibilities=responsibilities[:8],
        qualifications=qualifications[:8],
        technologies=tech,
        soft_skills=extracted["soft_skills"],
        keywords=extracted["all_keywords"],
        domain_keywords=[],
    )
