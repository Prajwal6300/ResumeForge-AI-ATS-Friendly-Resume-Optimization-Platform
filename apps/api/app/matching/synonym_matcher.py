"""
ResumeForge AI - Synonym & Acronym Matching Engine
Maps equivalent technical terms, industry acronyms, and frameworks.
"""

from typing import Dict, List, Optional, Set
from app.matching.normalizer import normalize_token

# Synonym canonical groups
SYNONYM_GROUPS: List[Set[str]] = [
    # Languages & Runtime
    {"js", "javascript", "ecmascript"},
    {"ts", "typescript"},
    {"py", "python", "python3"},
    {"csharp", "c#", ".net c#"},
    {"cpp", "c++"},
    {"golang", "go", "go language"},
    {"ruby", "ruby on rails", "rails"},
    {"rust", "rustlang"},
    # Frontend
    {"react", "react.js", "reactjs"},
    {"next.js", "nextjs", "next"},
    {"vue", "vue.js", "vuejs"},
    {"angular", "angular.js", "angularjs"},
    {"svelte", "sveltekit"},
    {"tailwind", "tailwind css", "tailwindcss"},
    {"redux", "redux toolkit", "rtk"},
    # Backend & Frameworks
    {"node", "node.js", "nodejs"},
    {"fastapi", "fast api"},
    {"django", "django rest framework", "drf"},
    {"flask"},
    {"spring", "spring boot", "springboot"},
    {"express", "express.js", "expressjs"},
    {"graphql", "gql"},
    {"rest", "restful", "rest api", "restful api", "rest apis"},
    # Databases
    {"postgres", "postgresql", "pgsql"},
    {"mongo", "mongodb"},
    {"redis", "redis cache"},
    {"mysql", "mariadb"},
    {"dynamodb", "dynamo"},
    {"sql", "relational database", "rdbms"},
    {"nosql", "non-relational database"},
    # Cloud & DevOps
    {"aws", "amazon web services"},
    {"gcp", "google cloud", "google cloud platform"},
    {"azure", "microsoft azure"},
    {"docker", "containerization", "containers"},
    {"k8s", "kubernetes"},
    {"ci/cd", "continuous integration", "continuous deployment", "continuous delivery", "github actions", "gitlab ci"},
    {"terraform", "iac", "infrastructure as code"},
    # Architecture & Practices
    {"microservices", "microservice architecture"},
    {"serverless", "aws lambda", "cloud functions"},
    {"tdd", "test driven development", "unit testing"},
    {"agile", "scrum", "kanban", "sprints"},
    {"oop", "object oriented programming"},
    # AI & Data
    {"ai", "artificial intelligence"},
    {"ml", "machine learning"},
    {"dl", "deep learning"},
    {"nlp", "natural language processing"},
    {"llm", "large language models", "generative ai", "genai"},
    {"rag", "retrieval augmented generation"},
    # Version Control
    {"git", "github", "gitlab", "bitbucket", "version control"},
]

# Build quick lookup dictionary mapping every variant to its canonical cluster
_LOOKUP: Dict[str, Set[str]] = {}
for group in SYNONYM_GROUPS:
    for item in group:
        norm = normalize_token(item)
        if norm not in _LOOKUP:
            _LOOKUP[norm] = set()
        _LOOKUP[norm].update(group)


def get_synonyms(skill: str) -> Set[str]:
    """Get all known synonyms for a given skill or acronym."""
    norm = normalize_token(skill)
    return _LOOKUP.get(norm, {skill.lower()})


def are_skills_equivalent(skill1: str, skill2: str) -> bool:
    """Check if two skills are exact matches, synonyms, or acronym equivalents."""
    s1 = normalize_token(skill1)
    s2 = normalize_token(skill2)

    if s1 == s2:
        return True

    syns1 = get_synonyms(s1)
    syns2 = get_synonyms(s2)

    return bool(syns1.intersection(syns2))
