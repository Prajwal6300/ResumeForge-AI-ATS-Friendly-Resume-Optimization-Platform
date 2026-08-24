"""
ResumeForge AI - Template HTML/CSS Renderer
Renders structured resume data into ATS-optimized semantic HTML.
"""

from typing import Dict, Any
from app.schemas.resume import StructuredResumeContent


def render_resume_to_html(
    resume: StructuredResumeContent,
    template_name: str = "classic",
) -> str:
    """Render StructuredResumeContent to clean, ATS-friendly HTML."""
    tpl = template_name.lower()
    
    # Base font styles
    font_family = "'Times New Roman', Times, serif" if tpl == "classic" else "Arial, Helvetica, sans-serif"
    primary_color = "#111827"
    accent_color = "#1e3a8a" if tpl == "professional" else ("#0f766e" if tpl == "modern" else "#111827")
    
    # Skills HTML
    skills_html = ""
    for cat in resume.skills:
        if cat.items:
            items_str = ", ".join(cat.items)
            skills_html += f"""
            <div style="margin-bottom: 6px;">
                <strong>{cat.category}:</strong> {items_str}
            </div>
            """

    # Experience HTML
    experience_html = ""
    for exp in resume.experience:
        bullets = "".join([f"<li style='margin-bottom: 4px;'>{h}</li>" for h in exp.highlights])
        date_str = f"{exp.start_date} – {exp.end_date or ('Present' if exp.is_current else '')}"
        loc_str = f" | {exp.location}" if exp.location else ""
        experience_html += f"""
        <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: bold;">
                <span style="font-size: 15px; color: {primary_color};">{exp.position}</span>
                <span style="font-size: 13px; color: #4b5563;">{date_str}</span>
            </div>
            <div style="font-size: 14px; font-style: italic; color: #374151; margin-bottom: 4px;">
                {exp.company}{loc_str}
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #1f2937; line-height: 1.5;">
                {bullets}
            </ul>
        </div>
        """

    # Projects HTML
    projects_html = ""
    for proj in resume.projects:
        bullets = "".join([f"<li style='margin-bottom: 4px;'>{h}</li>" for h in proj.highlights])
        tech_str = f" (<em>{', '.join(proj.technologies)}</em>)" if proj.technologies else ""
        projects_html += f"""
        <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 14.5px; color: {primary_color};">
                {proj.title}{tech_str}
            </div>
            {f"<div style='font-size: 13.5px; color: #374151; margin-bottom: 3px;'>{proj.description}</div>" if proj.description else ""}
            <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #1f2937; line-height: 1.5;">
                {bullets}
            </ul>
        </div>
        """

    # Education HTML
    education_html = ""
    for edu in resume.education:
        date_str = f"{edu.start_date or ''} – {edu.end_date or ''}".strip(" – ")
        honors_str = f" | {', '.join(edu.honors)}" if edu.honors else ""
        gpa_str = f" (GPA: {edu.gpa})" if edu.gpa else ""
        education_html += f"""
        <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: bold;">
                <span style="font-size: 14.5px; color: {primary_color};">{edu.degree}{gpa_str}</span>
                <span style="font-size: 13px; color: #4b5563;">{date_str}</span>
            </div>
            <div style="font-size: 13.5px; color: #374151;">
                {edu.institution}{honors_str}
            </div>
        </div>
        """

    # Certifications HTML
    certs_html = ""
    if resume.certifications:
        items = []
        for c in resume.certifications:
            issuer = f" ({c.issuer})" if c.issuer else ""
            date = f" - {c.issue_date}" if c.issue_date else ""
            items.append(f"<li style='margin-bottom: 3px;'>{c.name}{issuer}{date}</li>")
        certs_html = f"""
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid {accent_color}; color: {accent_color}; padding-bottom: 3px; margin-bottom: 8px;">Certifications</h2>
            <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #1f2937;">
                {"".join(items)}
            </ul>
        </div>
        """

    # Contact Line
    contact_parts = []
    if resume.personal.email:
        contact_parts.append(f"<a href='mailto:{resume.personal.email}' style='color: inherit; text-decoration: none;'>{resume.personal.email}</a>")
    if resume.personal.phone:
        contact_parts.append(resume.personal.phone)
    if resume.personal.location:
        contact_parts.append(resume.personal.location)
    if resume.personal.linkedin:
        contact_parts.append(f"<a href='{resume.personal.linkedin}' style='color: inherit;'>LinkedIn</a>")
    if resume.personal.github:
        contact_parts.append(f"<a href='{resume.personal.github}' style='color: inherit;'>GitHub</a>")
    if resume.personal.website:
        contact_parts.append(f"<a href='{resume.personal.website}' style='color: inherit;'>Portfolio</a>")

    contact_line = " &bull; ".join(contact_parts)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{resume.personal.name or 'Resume'} - ResumeForge AI</title>
    <style>
        @page {{
            size: letter;
            margin: 0.5in;
        }}
        body {{
            font-family: {font_family};
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 13.5px;
            line-height: 1.45;
        }}
        h1 {{
            margin: 0 0 4px 0;
            font-size: 26px;
            text-align: center;
            color: {primary_color};
            letter-spacing: -0.02em;
        }}
        .title-sub {{
            text-align: center;
            font-size: 15px;
            font-weight: 500;
            color: {accent_color};
            margin-bottom: 4px;
        }}
        .contact-header {{
            text-align: center;
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 18px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
        }}
        .section-title {{
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: bold;
            border-bottom: 1.5px solid {accent_color};
            color: {accent_color};
            padding-bottom: 3px;
            margin-top: 14px;
            margin-bottom: 8px;
        }}
    </style>
</head>
<body>
    <header>
        <h1>{resume.personal.name or 'Your Name'}</h1>
        {f"<div class='title-sub'>{resume.personal.title}</div>" if resume.personal.title else ""}
        <div class="contact-header">{contact_line}</div>
    </header>

    {f'''
    <section>
        <div class="section-title">Professional Summary</div>
        <p style="margin: 0 0 12px 0; font-size: 13.5px; line-height: 1.5; color: #1f2937;">{resume.summary}</p>
    </section>
    ''' if resume.summary else ''}

    {f'''
    <section>
        <div class="section-title">Technical Skills</div>
        <div style="font-size: 13.5px; color: #1f2937; margin-bottom: 12px;">{skills_html}</div>
    </section>
    ''' if skills_html else ''}

    {f'''
    <section>
        <div class="section-title">Work Experience</div>
        {experience_html}
    </section>
    ''' if experience_html else ''}

    {f'''
    <section>
        <div class="section-title">Key Projects</div>
        {projects_html}
    </section>
    ''' if projects_html else ''}

    {f'''
    <section>
        <div class="section-title">Education</div>
        {education_html}
    </section>
    ''' if education_html else ''}

    {certs_html}
</body>
</html>
"""
    return html
