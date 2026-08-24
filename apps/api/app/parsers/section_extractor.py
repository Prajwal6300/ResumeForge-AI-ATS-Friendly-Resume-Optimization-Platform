"""
ResumeForge AI - Heuristic Section Extractor
Parses raw resume text into a StructuredResumeContent schema using NLP heuristics,
regex patterns, and ATS layout conventions.
"""

import re
import uuid
from typing import Any, Dict, List, Optional, Tuple
from app.schemas.resume import (
    AchievementItem,
    CertificationItem,
    EducationItem,
    ExperienceItem,
    PersonalInfo,
    ProjectItem,
    SkillCategory,
    StructuredResumeContent,
)

# Standard ATS section header patterns
SECTION_PATTERNS = {
    "summary": [
        r"^(?:professional\s+)?summary\b",
        r"^executive\s+summary\b",
        r"^career\s+objective\b",
        r"^objective\b",
        r"^about\s+me\b",
        r"^professional\s+profile\b",
        r"^profile\b",
    ],
    "skills": [
        r"^technical\s+skills\b",
        r"^skills\s*(?:&|and)\s*technologies\b",
        r"^skills\s*(?:&|and)\s*competencies\b",
        r"^core\s+competencies\b",
        r"^skills\s*(?:&|and)\s*tools\b",
        r"^key\s+skills\b",
        r"^technologies\b",
        r"^tech\s+stack\b",
        r"^skills\b",
    ],
    "experience": [
        r"^work\s+experience\b",
        r"^professional\s+experience\b",
        r"^employment\s+history\b",
        r"^relevant\s+experience\b",
        r"^work\s+history\b",
        r"^career\s+history\b",
        r"^experience\b",
    ],
    "education": [
        r"^education\s*(?:&|and)\s*qualifications\b",
        r"^academic\s+background\b",
        r"^academic\s+history\b",
        r"^education\b",
        r"^academics\b",
    ],
    "projects": [
        r"^featured\s+projects\b",
        r"^technical\s+projects\b",
        r"^key\s+projects\b",
        r"^academic\s+projects\b",
        r"^personal\s+projects\b",
        r"^projects\b",
    ],
    "certifications": [
        r"^certifications\s*(?:&|and)\s*licenses\b",
        r"^professional\s+certifications\b",
        r"^licenses\s*(?:&|and)\s*certifications\b",
        r"^certifications\b",
        r"^certificates\b",
    ],
    "achievements": [
        r"^honors\s*(?:&|and)\s*awards\b",
        r"^awards\s*(?:&|and)\s*achievements\b",
        r"^key\s+achievements\b",
        r"^achievements\b",
        r"^awards\b",
    ],
}


def is_header_line(line: str) -> Optional[str]:
    """Check if a line matches any standard section header."""
    clean = line.strip().lower().rstrip(":-— ")
    if len(clean) > 40:
        return None
    for section_key, patterns in SECTION_PATTERNS.items():
        for pat in patterns:
            if re.match(pat, clean):
                return section_key
    return None


def extract_contact_info(lines: List[str]) -> Tuple[PersonalInfo, int]:
    """Extract contact information and identify where section headers begin."""
    personal = PersonalInfo()
    if not lines:
        return personal, 0

    # Find the index of the first actual section header
    header_end_idx = len(lines)
    for idx, line in enumerate(lines):
        if is_header_line(line) and idx > 0:
            header_end_idx = idx
            break

    # Cap header search to maximum first 6 lines
    search_limit = min(header_end_idx, 6)
    header_lines = lines[:search_limit]

    # Name is typically the first non-empty line
    if header_lines:
        first_line = header_lines[0].strip()
        if len(first_line.split()) <= 5 and not any(c in first_line for c in ["@", "http", "www", "+", "/"]):
            personal.name = first_line

    full_header_text = " \n ".join(header_lines)

    # Email
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", full_header_text)
    if email_match:
        personal.email = email_match.group(0).lower().rstrip(".")

    # Phone: US & international formats
    phone_match = re.search(
        r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
        full_header_text,
    )
    if phone_match:
        personal.phone = phone_match.group(0).strip()

    # LinkedIn
    linkedin_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)", full_header_text, re.IGNORECASE)
    if linkedin_match:
        personal.linkedin = f"https://linkedin.com/in/{linkedin_match.group(1)}"

    # GitHub
    github_match = re.search(r"(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_-]+)", full_header_text, re.IGNORECASE)
    if github_match:
        personal.github = f"https://github.com/{github_match.group(1)}"

    # Portfolio / Website
    site_match = re.search(r"(?:https?://)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|org|net|com|me))\b", full_header_text, re.IGNORECASE)
    if site_match:
        site_str = site_match.group(0)
        if "linkedin" not in site_str and "github" not in site_str and "@" not in site_str:
            personal.website = site_str if site_str.startswith("http") else f"https://{site_str}"

    # Location (City, State / Country)
    loc_match = re.search(r"([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}(?:\s+\d{5})?|[A-Z][a-zA-Z\s.-]+,\s*[A-Z][a-zA-Z\s]+)", full_header_text)
    if loc_match:
        cand_loc = loc_match.group(0).strip()
        if not any(w in cand_loc.lower() for w in ["university", "college", "inc", "llc", "corp"]):
            personal.location = cand_loc

    return personal, search_limit


def extract_skills_section(lines: List[str]) -> List[SkillCategory]:
    """Extract categorized or list-based skills."""
    categories: List[SkillCategory] = []
    flat_items: List[str] = []

    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue

        colon_split = line_str.split(":", 1)
        if len(colon_split) == 2 and len(colon_split[0].split()) <= 4:
            cat_name = colon_split[0].replace("-", "").strip()
            skills_raw = colon_split[1]
            items = [s.strip() for s in re.split(r"[,|•·/]+", skills_raw) if s.strip()]
            if items:
                categories.append(SkillCategory(category=cat_name, items=items))
        else:
            clean_item = re.sub(r"^[-\*•]\s*", "", line_str)
            items = [s.strip() for s in re.split(r"[,|•·]+", clean_item) if s.strip()]
            if items:
                flat_items.extend(items)

    if flat_items:
        # Deduplicate
        seen = set()
        deduped = []
        for it in flat_items:
            if it.lower() not in seen:
                seen.add(it.lower())
                deduped.append(it)
        categories.append(SkillCategory(category="Technical Skills", items=deduped))

    return categories if categories else [SkillCategory(category="Technical Skills", items=[])]


def extract_experience_section(lines: List[str]) -> List[ExperienceItem]:
    """Extract work history experiences and bullet highlights."""
    experiences: List[ExperienceItem] = []
    current_exp: Optional[ExperienceItem] = None

    date_pattern = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{4})\s*(?:-|–|—|to)\s*(?:Present|Current|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4})"

    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue

        is_bullet = line_str.startswith(("-", "*", "•")) or bool(re.match(r"^\d+\.\s", line_str))
        date_match = re.search(date_pattern, line_str, re.IGNORECASE)

        if is_bullet:
            bullet_clean = re.sub(r"^[-\*•\d.]+\s*", "", line_str).strip()
            if bullet_clean:
                if not current_exp:
                    current_exp = ExperienceItem(
                        id=str(uuid.uuid4()),
                        company="Experience",
                        position="Software Engineer",
                        start_date="",
                        highlights=[],
                    )
                current_exp.highlights.append(bullet_clean)
        elif date_match:
            date_str = date_match.group(0)
            is_curr = "present" in date_str.lower() or "current" in date_str.lower()
            rest_line = line_str.replace(date_str, "").strip(" -|·,")

            if current_exp and not current_exp.start_date:
                # Attach date to existing header item
                current_exp.start_date = date_str
                current_exp.end_date = "Present" if is_curr else ""
                current_exp.is_current = is_curr
                if rest_line:
                    if not current_exp.company or current_exp.company == "Experience":
                        current_exp.company = rest_line
            else:
                if current_exp and (current_exp.highlights or current_exp.position != "Role"):
                    experiences.append(current_exp)

                parts = [p.strip() for p in re.split(r"[|,–—]+", rest_line) if p.strip()]
                position = parts[0] if parts else "Software Engineer"
                company = parts[1] if len(parts) > 1 else ""

                current_exp = ExperienceItem(
                    id=str(uuid.uuid4()),
                    company=company or "Company",
                    position=position,
                    start_date=date_str,
                    end_date="Present" if is_curr else "",
                    is_current=is_curr,
                    highlights=[],
                )
        else:
            # Heading line (e.g. "Senior Software Engineer | CloudTech Solutions")
            parts = [p.strip() for p in re.split(r"[|,]+", line_str) if p.strip()]
            pos = parts[0] if parts else line_str
            comp = parts[1] if len(parts) > 1 else ""

            if current_exp and (current_exp.highlights or current_exp.start_date):
                experiences.append(current_exp)
                current_exp = ExperienceItem(
                    id=str(uuid.uuid4()),
                    company=comp or "Company",
                    position=pos,
                    start_date="",
                    highlights=[],
                )
            elif current_exp:
                current_exp.position = pos
                if comp:
                    current_exp.company = comp
            else:
                current_exp = ExperienceItem(
                    id=str(uuid.uuid4()),
                    company=comp or "Company",
                    position=pos,
                    start_date="",
                    highlights=[],
                )

    if current_exp:
        experiences.append(current_exp)

    return experiences


def extract_education_section(lines: List[str]) -> List[EducationItem]:
    """Extract education entries."""
    educations: List[EducationItem] = []
    current_edu: Optional[EducationItem] = None

    degree_keywords = ["bachelor", "master", "phd", "b.s.", "m.s.", "b.tech", "m.tech", "b.e.", "associate", "bba", "mba", "diploma", "degree"]

    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue

        is_degree = any(dk in line_str.lower() for dk in degree_keywords)
        is_bullet = line_str.startswith(("-", "*", "•"))

        # Extract GPA
        gpa_match = re.search(r"GPA:?\s*(\d+\.\d+(?:/\d+\.\d+)?)", line_str, re.IGNORECASE)
        gpa_val = gpa_match.group(1) if gpa_match else None

        if is_degree:
            if current_edu and current_edu.degree != "Degree":
                educations.append(current_edu)
            current_edu = EducationItem(
                id=str(uuid.uuid4()),
                institution="",
                degree=line_str,
                gpa=gpa_val,
                honors=[],
            )
        elif any(w in line_str.lower() for w in ["university", "college", "institute", "school"]):
            if current_edu and not current_edu.institution:
                current_edu.institution = line_str
                if gpa_val and not current_edu.gpa:
                    current_edu.gpa = gpa_val
            else:
                if current_edu:
                    educations.append(current_edu)
                current_edu = EducationItem(
                    id=str(uuid.uuid4()),
                    institution=line_str,
                    degree="Degree",
                    gpa=gpa_val,
                    honors=[],
                )
        elif is_bullet and current_edu:
            clean_honor = re.sub(r"^[-\*•]\s*", "", line_str).strip()
            current_edu.honors.append(clean_honor)
        elif current_edu and gpa_val:
            current_edu.gpa = gpa_val

    if current_edu:
        educations.append(current_edu)

    return educations


def extract_projects_section(lines: List[str]) -> List[ProjectItem]:
    """Extract project entries with title, tech tags, and highlights."""
    projects: List[ProjectItem] = []
    current_proj: Optional[ProjectItem] = None

    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue

        is_bullet = line_str.startswith(("-", "*", "•"))
        
        if not is_bullet and ("|" in line_str or len(line_str.split()) <= 6):
            if current_proj:
                projects.append(current_proj)

            parts = [p.strip() for p in re.split(r"[|:]+", line_str) if p.strip()]
            title = parts[0]
            techs: List[str] = []
            if len(parts) > 1:
                techs = [t.strip() for t in re.split(r"[,/]+", parts[1]) if t.strip()]

            current_proj = ProjectItem(
                id=str(uuid.uuid4()),
                title=title,
                technologies=techs,
                highlights=[],
            )
        elif is_bullet:
            bullet_clean = re.sub(r"^[-\*•\d.]+\s*", "", line_str).strip()
            if not current_proj:
                current_proj = ProjectItem(
                    id=str(uuid.uuid4()),
                    title="Project",
                    technologies=[],
                    highlights=[],
                )
            current_proj.highlights.append(bullet_clean)
        elif current_proj:
            if not current_proj.description:
                current_proj.description = line_str
            else:
                current_proj.highlights.append(line_str)

    if current_proj:
        projects.append(current_proj)

    return projects


def parse_resume_sections(raw_text: str) -> StructuredResumeContent:
    """
    Main heuristic parsing orchestrator.
    Segments document lines into sections and constructs StructuredResumeContent.
    """
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
    if not lines:
        return StructuredResumeContent()

    # Step 1: Extract header info
    personal, header_end = extract_contact_info(lines)

    # Step 2: Segment into section buckets
    section_buckets: Dict[str, List[str]] = {
        "summary": [],
        "skills": [],
        "experience": [],
        "education": [],
        "projects": [],
        "certifications": [],
        "achievements": [],
    }

    current_section = "summary"
    for line in lines[header_end:]:
        matched_header = is_header_line(line)
        if matched_header:
            current_section = matched_header
        else:
            if current_section in section_buckets:
                section_buckets[current_section].append(line)

    # Step 3: Parse individual section contents
    summary_text = " ".join(section_buckets["summary"]).strip()
    skills_list = extract_skills_section(section_buckets["skills"])
    experience_list = extract_experience_section(section_buckets["experience"])
    education_list = extract_education_section(section_buckets["education"])
    projects_list = extract_projects_section(section_buckets["projects"])

    # Certifications
    certs: List[CertificationItem] = []
    for line in section_buckets["certifications"]:
        clean_c = re.sub(r"^[-\*•]\s*", "", line).strip()
        if clean_c:
            certs.append(CertificationItem(
                id=str(uuid.uuid4()),
                name=clean_c,
                issuer="",
            ))

    # Achievements
    achs: List[AchievementItem] = []
    for line in section_buckets["achievements"]:
        clean_a = re.sub(r"^[-\*•]\s*", "", line).strip()
        if clean_a:
            achs.append(AchievementItem(
                id=str(uuid.uuid4()),
                title=clean_a,
                description=clean_a,
            ))

    return StructuredResumeContent(
        personal=personal,
        summary=summary_text,
        skills=skills_list,
        experience=experience_list,
        education=education_list,
        projects=projects_list,
        certifications=certs,
        achievements=achs,
    )
