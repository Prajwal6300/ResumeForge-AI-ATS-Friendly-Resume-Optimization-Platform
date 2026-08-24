"""
ResumeForge AI - PDF Document Generator
Generates clean, ATS-compliant PDF resumes with selectable text using ReportLab.
"""

import io
from typing import List
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from app.schemas.resume import StructuredResumeContent


def generate_pdf_resume(
    resume: StructuredResumeContent,
    template_name: str = "classic",
) -> bytes:
    """Generate ATS-friendly PDF bytes from structured resume content."""
    buffer = io.BytesIO()
    
    # 0.5 inch margins = 36 pt
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Color definitions based on template
    tpl = template_name.lower()
    if tpl == "professional":
        primary_color = colors.HexColor("#1e3a8a")
        accent_color = colors.HexColor("#1e40af")
    elif tpl == "modern":
        primary_color = colors.HexColor("#0f766e")
        accent_color = colors.HexColor("#0d9488")
    else:  # classic or minimal
        primary_color = colors.HexColor("#111827")
        accent_color = colors.HexColor("#374151")

    # Typography styles
    name_style = ParagraphStyle(
        "ResumeName",
        parent=styles["Heading1"],
        fontSize=20,
        leading=24,
        alignment=1,  # Centered
        textColor=primary_color,
        fontName="Helvetica-Bold",
        spaceAfter=2,
    )

    subtitle_style = ParagraphStyle(
        "ResumeSubtitle",
        parent=styles["Normal"],
        fontSize=11,
        leading=14,
        alignment=1,
        textColor=accent_color,
        fontName="Helvetica-Bold",
        spaceAfter=4,
    )

    contact_style = ParagraphStyle(
        "ResumeContact",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=12,
        alignment=1,
        textColor=colors.HexColor("#4b5563"),
        spaceAfter=8,
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=11,
        leading=14,
        textColor=accent_color,
        fontName="Helvetica-Bold",
        spaceBefore=8,
        spaceAfter=3,
    )

    body_style = ParagraphStyle(
        "ResumeBody",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=4,
    )

    bullet_style = ParagraphStyle(
        "ResumeBullet",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1f2937"),
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2,
    )

    item_title_style = ParagraphStyle(
        "ItemTitle",
        parent=styles["Normal"],
        fontSize=10,
        leading=13,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#111827"),
    )

    item_sub_style = ParagraphStyle(
        "ItemSub",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        fontName="Helvetica-Oblique",
        textColor=colors.HexColor("#4b5563"),
    )

    story = []

    # 1. Header (Name, Title, Contact)
    story.append(Paragraph(resume.personal.name or "Your Name", name_style))
    if resume.personal.title:
        story.append(Paragraph(resume.personal.title, subtitle_style))

    contact_parts = []
    if resume.personal.email:
        contact_parts.append(resume.personal.email)
    if resume.personal.phone:
        contact_parts.append(resume.personal.phone)
    if resume.personal.location:
        contact_parts.append(resume.personal.location)
    if resume.personal.linkedin:
        contact_parts.append("LinkedIn")
    if resume.personal.github:
        contact_parts.append("GitHub")
    if resume.personal.website:
        contact_parts.append("Portfolio")

    story.append(Paragraph(" &bull; ".join(contact_parts), contact_style))
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#e5e7eb"), spaceAfter=6))

    # 2. Professional Summary
    if resume.summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
        story.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceAfter=4))
        story.append(Paragraph(resume.summary, body_style))
        story.append(Spacer(1, 4))

    # 3. Technical Skills
    if resume.skills:
        story.append(Paragraph("TECHNICAL SKILLS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceAfter=4))
        for cat in resume.skills:
            if cat.items:
                skills_line = f"<b>{cat.category}:</b> {', '.join(cat.items)}"
                story.append(Paragraph(skills_line, body_style))
        story.append(Spacer(1, 4))

    # 4. Work Experience
    if resume.experience:
        story.append(Paragraph("WORK EXPERIENCE", heading_style))
        story.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceAfter=4))
        for exp in resume.experience:
            date_str = f"{exp.start_date} – {exp.end_date or ('Present' if exp.is_current else '')}"
            loc_str = f" | {exp.location}" if exp.location else ""
            
            # Position & Date
            table_data = [
                [
                    Paragraph(exp.position, item_title_style),
                    Paragraph(f"<div align='right'>{date_str}</div>", item_sub_style),
                ]
            ]
            t = Table(table_data, colWidths=[380, 160])
            t.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]))
            story.append(t)
            story.append(Paragraph(f"{exp.company}{loc_str}", item_sub_style))
            story.append(Spacer(1, 2))

            for h in exp.highlights:
                story.append(Paragraph(f"&bull; {h}", bullet_style))
            story.append(Spacer(1, 4))

    # 5. Key Projects
    if resume.projects:
        story.append(Paragraph("KEY PROJECTS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceAfter=4))
        for proj in resume.projects:
            tech_str = f" (<i>{', '.join(proj.technologies)}</i>)" if proj.technologies else ""
            story.append(Paragraph(f"<b>{proj.title}</b>{tech_str}", item_title_style))
            if proj.description:
                story.append(Paragraph(proj.description, body_style))
            for h in proj.highlights:
                story.append(Paragraph(f"&bull; {h}", bullet_style))
            story.append(Spacer(1, 4))

    # 6. Education
    if resume.education:
        story.append(Paragraph("EDUCATION", heading_style))
        story.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceAfter=4))
        for edu in resume.education:
            date_str = f"{edu.start_date or ''} – {edu.end_date or ''}".strip(" – ")
            gpa_str = f" (GPA: {edu.gpa})" if edu.gpa else ""
            table_data = [
                [
                    Paragraph(f"{edu.degree}{gpa_str}", item_title_style),
                    Paragraph(f"<div align='right'>{date_str}</div>", item_sub_style),
                ]
            ]
            t = Table(table_data, colWidths=[380, 160])
            t.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]))
            story.append(t)
            honors_str = f" | {', '.join(edu.honors)}" if edu.honors else ""
            story.append(Paragraph(f"{edu.institution}{honors_str}", item_sub_style))
            story.append(Spacer(1, 4))

    # 7. Certifications
    if resume.certifications:
        story.append(Paragraph("CERTIFICATIONS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1, color=accent_color, spaceAfter=4))
        for c in resume.certifications:
            issuer = f" ({c.issuer})" if c.issuer else ""
            story.append(Paragraph(f"&bull; {c.name}{issuer}", bullet_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()
