"""
ResumeForge AI - Full Resume Optimization Prompt
"""

import json
from app.ai.prompts.anti_fabrication import wrap_untrusted_content
from app.schemas.job_description import JobDescriptionStructured
from app.schemas.resume import StructuredResumeContent

FULL_RESUME_OPTIMIZATION_PROMPT = """
You are tasked with generating an ATS-Optimized Version of a user's resume tailored to the target Job Description.

STRICT MANDATORY RULES:
1. DO NOT INVENT ANY COMPANIES, YEARS OF EXPERIENCE, ROLES, CERTIFICATIONS, OR DEGREES.
2. DO NOT ADD SKILLS THAT THE USER HAS NEVER MENTIONED.
3. Optimize existing bullet points for maximum impact (Action Verb + Context + Result).
4. Tailor the professional summary to align with the target role and user's authentic skills.
5. Reorder technical skills to prominently highlight matching technologies.
6. Return the full structured resume JSON matching the StructuredResumeContent schema.
"""


def build_full_optimization_prompt(
    resume: StructuredResumeContent,
    jd: JobDescriptionStructured,
) -> str:
    prompt = FULL_RESUME_OPTIMIZATION_PROMPT + "\n\n"
    prompt += "Target Job Description:\n"
    prompt += wrap_untrusted_content("JOB_DESCRIPTION", json.dumps(jd.model_dump(), indent=2)) + "\n\n"
    prompt += "Candidate's Authentic Current Resume Data:\n"
    prompt += wrap_untrusted_content("CANDIDATE_RESUME", json.dumps(resume.model_dump(), indent=2)) + "\n"
    return prompt
