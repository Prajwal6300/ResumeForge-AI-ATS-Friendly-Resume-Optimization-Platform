"""
ResumeForge AI - ATS Structural and Formatting Rules
Evaluates whether a resume adheres to ATS parsing standards.
"""

import re
from typing import Dict, List, Tuple
from app.schemas.resume import StructuredResumeContent


ACTION_VERBS = {
    "led", "developed", "designed", "engineered", "built", "spearheaded", "implemented",
    "optimized", "architected", "deployed", "scaled", "automated", "created", "reduced",
    "increased", "improved", "managed", "orchestrated", "refactored", "integrated",
    "executed", "delivered", "mentored", "launched", "collaborated", "streamlined",
}


def evaluate_structure_rules(resume: StructuredResumeContent) -> Tuple[float, List[str], List[str]]:
    """
    Evaluates resume structure and returns:
    (score_0_to_100, list_of_strengths, list_of_improvements)
    """
    score = 100.0
    strengths: List[str] = []
    improvements: List[str] = []

    # 1. Contact Information Check (20 pts)
    contact_score = 0
    if resume.personal.name:
        contact_score += 5
    if resume.personal.email:
        contact_score += 5
    if resume.personal.phone:
        contact_score += 5
    if resume.personal.location or resume.personal.linkedin:
        contact_score += 5

    if contact_score == 20:
        strengths.append("Complete contact details provided (Name, Email, Phone, Location/Links).")
    else:
        score -= (20 - contact_score)
        improvements.append("Ensure contact section has full name, professional email, phone number, and location.")

    # 2. Core Section Presence (30 pts)
    has_summary = bool(resume.summary and len(resume.summary) > 20)
    has_skills = bool(resume.skills and any(cat.items for cat in resume.skills))
    has_experience = bool(resume.experience)
    has_education = bool(resume.education)

    if has_summary:
        strengths.append("Contains a clear professional summary section.")
    else:
        score -= 5
        improvements.append("Add a targeted 2-3 sentence professional summary at the top.")

    if has_skills:
        strengths.append("Contains an organized skills section for quick ATS parsing.")
    else:
        score -= 10
        improvements.append("Include a dedicated Technical Skills section.")

    if has_experience:
        strengths.append("Features structured work history with chronologically listed roles.")
    else:
        score -= 10
        improvements.append("Add detailed work experience with dates and company names.")

    if has_education:
        strengths.append("Education history clearly documented.")
    else:
        score -= 5
        improvements.append("Include your degree and educational institution.")

    # 3. Bullet Point Quality & Metrics (30 pts)
    all_bullets: List[str] = []
    for exp in resume.experience:
        all_bullets.extend(exp.highlights)
    for proj in resume.projects:
        all_bullets.extend(proj.highlights)

    if not all_bullets:
        score -= 20
        improvements.append("Add bullet points highlighting specific achievements under experience and projects.")
    else:
        # Check action verbs
        action_verb_count = 0
        metric_count = 0
        for b in all_bullets:
            words = b.lower().split()
            if words and words[0] in ACTION_VERBS:
                action_verb_count += 1
            # Check for numbers, %, $, scale
            if re.search(r"\b(?:\d+%|\$\d+|\d+x|\d+\+?)\b", b):
                metric_count += 1

        if action_verb_count / len(all_bullets) >= 0.5:
            strengths.append("Strong use of action verbs (e.g. Architected, Optimized, Spearheaded).")
        else:
            score -= 10
            improvements.append("Start bullet points with strong past-tense action verbs.")

        if metric_count > 0:
            strengths.append(f"Quantifiable impact present ({metric_count} metrics found).")
        else:
            score -= 10
            improvements.append("Add measurable outcomes and numbers (e.g., 'improved latency by 35%').")

    # 4. Length & Formatting Sanity (20 pts)
    total_words = len(" ".join(all_bullets + [resume.summary]).split())
    if 250 <= total_words <= 1200:
        strengths.append("Optimal resume length for standard ATS parsing.")
    elif total_words < 250:
        score -= 10
        improvements.append("Resume content is brief; consider expanding on key project responsibilities.")
    elif total_words > 1500:
        score -= 10
        improvements.append("Resume may be too long; condense to 1-2 pages for best ATS reading.")

    final_score = max(20.0, min(100.0, score))
    return final_score, strengths, improvements
