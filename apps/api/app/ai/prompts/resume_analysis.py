"""
ResumeForge AI - Resume and JD Analysis Prompts
"""

from app.ai.prompts.anti_fabrication import SYSTEM_ANTI_FABRICATION_DIRECTIVE, wrap_untrusted_content

RESUME_EXTRACTION_PROMPT = """
Analyze the following raw resume text and parse it into structured JSON adhering strictly to the candidate's actual text.

JSON Schema format required:
{
  "personal": {
    "name": "Full Name",
    "email": "Email address",
    "phone": "Phone number or null",
    "location": "City, State/Country or null",
    "linkedin": "LinkedIn profile URL or null",
    "github": "GitHub URL or null",
    "website": "Portfolio URL or null",
    "title": "Professional Title or null"
  },
  "summary": "Professional summary or objective text",
  "skills": [
    {
      "category": "Category Name (e.g. Languages, Frameworks, Cloud)",
      "items": ["Skill1", "Skill2"]
    }
  ],
  "experience": [
    {
      "id": "uuid-or-unique-string",
      "company": "Company Name",
      "position": "Job Title",
      "location": "Location or null",
      "start_date": "Start date",
      "end_date": "End date or Present",
      "is_current": false,
      "highlights": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "education": [
    {
      "id": "uuid-or-unique-string",
      "institution": "University / College",
      "degree": "Degree and Major",
      "field_of_study": "Field or null",
      "location": "Location or null",
      "start_date": "Date or null",
      "end_date": "Date or null",
      "gpa": "GPA or null",
      "honors": ["Honor or award"]
    }
  ],
  "projects": [
    {
      "id": "uuid-or-unique-string",
      "title": "Project Title",
      "role": "Role or null",
      "url": "Project URL or null",
      "description": "Brief description",
      "technologies": ["Tech1", "Tech2"],
      "highlights": ["Key achievement 1"]
    }
  ],
  "certifications": [
    {
      "id": "uuid-or-unique-string",
      "name": "Certification Name",
      "issuer": "Issuing Body",
      "issue_date": "Date or null",
      "expiration_date": "Date or null",
      "credential_id": "ID or null",
      "url": "URL or null"
    }
  ],
  "achievements": [
    {
      "id": "uuid-or-unique-string",
      "title": "Award Title",
      "date": "Date or null",
      "description": "Description of achievement"
    }
  ]
}

Input Document:
"""

JD_EXTRACTION_PROMPT = """
Analyze the following Job Description text and extract structured technical criteria, responsibilities, and requirements.

JSON Schema format required:
{
  "job_title": "Target Role Title",
  "company": "Hiring Company Name or null",
  "location": "Location / Remote status or null",
  "experience_level": "Entry-Level | Mid-Level | Senior | Lead | Principal",
  "years_of_experience": "Years requirement (e.g. 3+ years)",
  "required_skills": ["Mandatory Skill 1", "Mandatory Skill 2"],
  "preferred_skills": ["Nice to have Skill 1", "Nice to have Skill 2"],
  "responsibilities": ["Primary responsibility 1", "Primary responsibility 2"],
  "qualifications": ["Qualification requirement 1", "Qualification requirement 2"],
  "technologies": ["Tool / Language / Framework 1", "Tool / Language / Framework 2"],
  "soft_skills": ["Communication", "Leadership"],
  "keywords": ["Domain Keyword 1", "Domain Keyword 2"],
  "domain_keywords": ["Industry specific term 1"]
}

Input Job Description:
"""


def build_resume_parse_prompt(raw_text: str) -> str:
    return RESUME_EXTRACTION_PROMPT + "\n" + wrap_untrusted_content("DOCUMENT_CONTENT", raw_text)


def build_jd_parse_prompt(raw_text: str) -> str:
    return JD_EXTRACTION_PROMPT + "\n" + wrap_untrusted_content("DOCUMENT_CONTENT", raw_text)
