import os, sys
sys.path.insert(0, r'F:\ResumeForge AI – ATS-Friendly Resume Optimization Platform\apps\api')

from app.matching.synonym_matcher import are_skills_equivalent, get_synonyms
from app.matching.normalizer import normalize_token
from app.matching.matcher import match_resume_to_jd
from app.parsers.section_extractor import parse_resume_sections
from app.matching.keyword_extractor import parse_job_description_text
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent

print("=" * 60)
print("MATCHING ENGINE AUDIT")
print("=" * 60)

# Test 1: Exact match
print("\n1. EXACT MATCH")
result = are_skills_equivalent("Python", "Python")
print("   Python -> Python: {}".format("PASS" if result else "FAIL"))

# Test 2: Case normalization
print("\n2. CASE NORMALIZATION")
result = are_skills_equivalent("python", "Python")
print("   python -> Python: {}".format("PASS" if result else "FAIL"))

# Test 3: Technology normalization (Postgres -> PostgreSQL)
print("\n3. TECHNOLOGY NORMALIZATION")
result = are_skills_equivalent("Postgres", "PostgreSQL")
print("   Postgres -> PostgreSQL: {}".format("PASS" if result else "FAIL"))

# Test 4: Acronym
print("\n4. ACRONYM")
result = are_skills_equivalent("AWS", "Amazon Web Services")
print("   AWS -> Amazon Web Services: {}".format("PASS" if result else "FAIL"))

# Test 5: Non-equivalent
print("\n5. NON-EQUIVALENT")
result = are_skills_equivalent("Python", "Java")
print("   Python -> Java: {}".format("PASS" if not result else "FAIL (should be False)"))

result = are_skills_equivalent("Docker", "Kubernetes")
print("   Docker -> Kubernetes: {}".format("PASS" if not result else "FAIL (should be False)"))

# Test 6: Synonym groups
print("\n6. SYNONYM GROUPS")
test_cases = [
    ("React", "React.js"),
    ("K8s", "Kubernetes"),
    ("TS", "TypeScript"),
    ("Node.js", "Node"),
    ("fastapi", "FastAPI"),
    ("Postgres", "PostgreSQL"),
]
for s1, s2 in test_cases:
    r = are_skills_equivalent(s1, s2)
    status = "PASS" if r else "FAIL"
    print("   {} <-> {}: {}".format(s1, s2, status))

# Test 7: Matcher against realistic resume + JD
print("\n7. MATCHER TEST")
resume_text = """John Doe
john@example.com | (555) 123-4567

Professional Summary
Senior Full-Stack Engineer with 7+ years of experience in Python and React.

Technical Skills
Python, JavaScript, React, PostgreSQL

Work Experience
Senior Software Engineer | TechCorp
Jan 2022 - Present
- Built microservices with Python and FastAPI
- Developed responsive UIs with React and TypeScript

Education
BS in Computer Science
"""
resume = parse_resume_sections(resume_text)

jd_text = """Senior Full-Stack Engineer
We need Python and React experience.
Requirements: Python, React, PostgreSQL
"""
jd = parse_job_description_text(jd_text, title="Senior Full-Stack Engineer")

match_result = match_resume_to_jd(resume, jd)
print("   Matched keywords: {}".format(match_result["matched_keywords"]))
print("   Missing keywords: {}".format(match_result2["missing_keywords"] if 'match_result2' in dir() else []))

# Verify Python is matched
python_matched = "python" in [k.lower() for k in match_result["matched_keywords"]]
print("   [OK] Python correctly matched: {}".format(python_matched))

# Verify PostgreSQL is matched
pg_matched = any("postgres" in k.lower() for k in match_result["matched_keywords"])
print("   [OK] PostgreSQL correctly matched: {}".format(pg_matched))

# Verify React is matched
react_matched = "react" in [k.lower() for k in match_result["matched_keywords"]]
print("   [OK] React correctly matched: {}".format(react_matched))

# Test 8: Missing skills
print("\n8. MISSING SKILLS DETECTION")
jd_text2 = """Senior Full-Stack Engineer
Requirements: Python, React, Docker, AWS, Kubernetes
"""
jd2 = parse_job_description_text(jd_text2, title="Senior Full-Stack Engineer")

match_result2 = match_resume_to_jd(resume, jd2)
print("   JD requires: Python, React, Docker, AWS, Kubernetes")
print("   Matched: {}".format(match_result2["matched_keywords"]))
print("   Missing: {}".format(match_result2["missing_keywords"]))

docker_missing = "docker" in [k.lower() for k in match_result2["missing_keywords"]]
aws_missing = "aws" in [k.lower() for k in match_result2["missing_keywords"]]
print("   [OK] Docker detected as missing: {}".format(docker_missing))
print("   [OK] AWS detected as missing: {}".format(aws_missing))

print("\n" + "=" * 60)
print("MATCHING ENGINE AUDIT COMPLETE")
print("=" * 60)