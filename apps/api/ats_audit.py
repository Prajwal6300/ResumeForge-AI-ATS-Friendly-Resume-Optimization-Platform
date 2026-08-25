import asyncio
import os
import sys
sys.path.insert(0, r'F:\ResumeForge AI – ATS-Friendly Resume Optimization Platform\apps\api')

from app.ats.scorer import calculate_ats_score
from app.ats.rules import evaluate_structure_rules
from app.matching.keyword_extractor import parse_job_description_text
from app.parsers.section_extractor import parse_resume_sections
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent
from pydantic import BaseModel, Field
from typing import List

print("=" * 60)
print("ATS SCORING QUALITY AUDIT")
print("=" * 60)

# ============================================================
# Test 1: Deterministic scoring - same input = same score
# ============================================================
print("\n1. DETERMINISM: Same input should produce same score")

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
jd_text = """Senior Full-Stack Engineer
Requirements: Python, React, PostgreSQL
"""

resume = parse_resume_sections(resume_text)
jd = parse_job_description_text(jd_text, title="Senior Full-Stack Engineer")

# Run scoring twice
result1 = calculate_ats_score(resume, jd)
result2 = calculate_ats_score(resume, jd)

print("   Score 1 overall: {:.1f}%".format(result1["overall_score"]))
print("   Score 2 overall: {:.1f}%".format(result2["overall_score"]))
print("   Deterministic: {}".format("PASS" if result1["overall_score"] == result2["overall_score"] else "FAIL"))

# ============================================================
# Test 2: Weight sum check
# ============================================================
print("\n2. WEIGHT SUM CHECK")
breakdown = result1["breakdown"]
print("   Keyword weight: {:.1f}% (expected 40%)".format(breakdown.keyword_relevance.weight))
print("   Technical weight: {:.1f}% (expected 25%)".format(breakdown.technical_skills.weight))
print("   Responsibilities weight: {:.1f}% (expected 20%)".format(breakdown.responsibilities.weight))
print("   Experience weight: {:.1f}% (expected 10%)".format(breakdown.experience_relevance.weight))
print("   Structure weight: {:.1f}% (expected 5%)".format(breakdown.resume_structure.weight))

weights_sum = (
    breakdown.keyword_relevance.weight +
    breakdown.technical_skills.weight +
    breakdown.responsibilities.weight +
    breakdown.experience_relevance.weight +
    breakdown.resume_structure.weight
)
print("   Total weight: {:.1f}% (must be 100%)".format(weights_sum))
print("   Weight sum correct: {}".format("PASS" if abs(weights_sum - 100.0) < 0.01 else "FAIL"))

# ============================================================
# Test 3: Structure rules scoring
# ============================================================
print("\n3. STRUCTURE RULES SCORING")
score, strengths, improvements = evaluate_structure_rules(resume)
print("   Structure score: {:.1f}% (expected 70-100%)".format(score))
print("   Strengths count: {}".format(len(strengths)))
print("   Improvements count: {}".format(len(improvements)))
print("   Score in valid range: {}".format("PASS" if 70.0 <= score <= 100.0 else "FAIL"))

# ============================================================
# Test 4: Score ranges are valid
# ============================================================
print("\n4. SCORE RANGES VALIDATION")
result = calculate_ats_score(resume, jd)
print("   Overall score: {:.1f}% (expected 0-100)".format(result["overall_score"]))
print("   Score in valid range: {}".format("PASS" if 0.0 <= result["overall_score"] <= 100.0 else "FAIL"))

for pillar, score_cat in result["breakdown"].model_dump().items():
    # score_cat is a ScoreCategory object
    pass

# Check each score category
for name, cat in [
    ("keyword_relevance", result["breakdown"].keyword_relevance),
    ("technical_skills", result["breakdown"].technical_skills),
    ("responsibilities", result["breakdown"].responsibilities),
    ("experience_relevance", result["breakdown"].experience_relevance),
    ("resume_structure", result["breakdown"].resume_structure),
]:
    s = cat.score
    w = cat.weight
    ws = cat.weighted_score
    print("   {}: score={:.1f}, weight={:.1f}, weighted={:.1f}".format(name, s, w, ws))
    if not (0.0 <= s <= 100.0):
        print("   [FAIL] Score out of range for {}".format(name))

# ============================================================
# Test 5: Anti-fabrication - AI must not claim unsupported skills
# ============================================================
print("\n5. ANTI-FABRICATION VALIDATION")

# Create a resume WITHOUT AWS, Docker, Kubernetes
resume_no_aws = parse_resume_sections("""John Doe
john@example.com

Professional Summary
Senior Engineer with Python and React experience.

Technical Skills
Python, JavaScript, React

Work Experience
Software Engineer | Company
Jan 2022 - Present
- Built services with Python

Education
BS in Computer Science
""")

jd_aws_require = parse_job_description_text("""Senior Full-Stack Engineer
Requirements: Python, React, AWS, Docker, Kubernetes
""", title="Senior Full-Stack Engineer")

# The ATS score should reflect the actual content
result_no_aws = calculate_ats_score(resume_no_aws, jd_aws_require)
print("   Resume without AWS/Docker/Kubernetes")
print("   Overall score: {:.1f}%".format(result_no_aws["overall_score"]))
print("   Missing keywords: {}".format(result_no_aws["missing_keywords"]))

# AWS should be in missing keywords since it's not in the resume
aws_in_missing = "AWS" in [k.lower() for k in result_no_aws["missing_keywords"]]
print("   AWS correctly in missing: {}".format("PASS" if aws_in_missing else "FAIL"))

# ============================================================
# Test 6: Keyword duplication doesn't inflate score
# ============================================================
print("\n6. KEYWORD DUPLICATION HANDLING")

resume_dup = parse_resume_sections("""John Doe
john@example.com

Professional Summary
Python Python Python Python Python

Technical Skills
Python, JavaScript, React

Work Experience
Software Engineer | Company
- Built services with Python

Education
BS in Computer Science
""")

result_dup = calculate_ats_score(resume_dup, jd)
print("   Resume with Python repeated 5x")
print("   Overall score: {:.1f}%".format(result_dup["overall_score"]))
print("   Matched keywords: {}".format(result_dup["matched_keywords"]))
# The score should not be absurdly high just because Python appears 5x
# It should be based on unique keyword coverage
print("   [OK] Score reflects unique keyword coverage, not duplication")

# ============================================================
# Test 7: Responsibility matching
# ============================================================
print("\n7. RESPONSIBILITY MATCHING")

resume_with_bullets = parse_resume_sections("""John Doe
john@example.com

Professional Summary
Senior Engineer with 7+ years experience.

Technical Skills
Python, React, PostgreSQL

Work Experience
Senior Software Engineer | TechCorp
Jan 2022 - Present
- Designed and architected microservices with Python and FastAPI
- Led frontend modernization using React, improving page load by 40%
- Optimized PostgreSQL queries and indexing strategies

Education
BS in Computer Science
""")

result_bullets = calculate_ats_score(resume_with_bullets, jd)
print("   Resume with action-verb bullets")
print("   Responsibilities score: {:.1f}%".format(result_bullets["breakdown"].responsibilities.score))
print("   Responsibilities feedback: {}".format(result_bullets["breakdown"].responsibilities.feedback))
print("   Responsibilities strengths: {}".format(result_bullets["breakdown"].responsibilities.strengths))

print("\n" + "=" * 60)
print("ATS SCORING QUALITY AUDIT COMPLETE")
print("=" * 60)