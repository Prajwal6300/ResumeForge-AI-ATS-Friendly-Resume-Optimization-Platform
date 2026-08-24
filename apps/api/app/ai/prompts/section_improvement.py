"""
ResumeForge AI - Section and Bullet Improvement Prompts
"""

from app.ai.prompts.anti_fabrication import wrap_untrusted_content

SECTION_IMPROVEMENT_PROMPT = """
You are tasked with improving a specific section of a user's resume to make it more ATS-friendly, impactful, and aligned with the target job description WITHOUT fabricating any experiences or skills.

Output JSON format:
{
  "section": "Section name",
  "item_id": "item-id or null",
  "original_text": "Original section text",
  "improved_text": "Enhanced, polished text using strong action verbs and clean phrasing",
  "changes_made": [
    "Replaced passive phrasing with active verbs",
    "Restructured into concise ATS bullet points"
  ],
  "reasoning": "Explanation of how this change improves ATS parseability and recruiter impact",
  "keywords_integrated": ["keyword1", "keyword2"],
  "anti_fabrication_notice": "Verified: No false qualifications or unevidenced experiences were created."
}
"""

BULLET_REWRITING_PROMPT = """
You are tasked with rewriting a single resume bullet point to maximize recruiter impact, quantifiable value, and ATS keyword strength.

Output JSON format:
{
  "original_bullet": "Original text",
  "suggested_bullet": "High-impact rewritten bullet starting with strong past-tense action verb",
  "alternative_options": [
    "Option 2: Focused more on metric/quantifiable outcome",
    "Option 3: Focused more on concise technical execution"
  ],
  "impact_score_delta": "+20%",
  "rationale": "Why this version is stronger for ATS and hiring managers",
  "matched_skills": ["Skill1", "Skill2"]
}
"""


def build_section_improvement_prompt(
    section: str,
    content: str,
    jd_text: str = "",
    instruction: str = "",
) -> str:
    prompt = f"{SECTION_IMPROVEMENT_PROMPT}\nTarget Section: {section}\n"
    if instruction:
        prompt += f"Specific User Request: {instruction}\n"
    if jd_text:
        prompt += f"Target Job Description:\n{wrap_untrusted_content('JOB_DESCRIPTION', jd_text)}\n"
    prompt += f"Current Section Content to Improve:\n{wrap_untrusted_content('SECTION_CONTENT', content)}\n"
    return prompt


def build_bullet_rewrite_prompt(
    bullet: str,
    jd_text: str = "",
    goal: str = "impact",
) -> str:
    prompt = f"{BULLET_REWRITING_PROMPT}\nOptimization Goal: {goal}\n"
    if jd_text:
        prompt += f"Target Job Description Context:\n{wrap_untrusted_content('JOB_DESCRIPTION', jd_text)}\n"
    prompt += f"Bullet Point to Rewrite:\n{wrap_untrusted_content('BULLET_POINT', bullet)}\n"
    return prompt
