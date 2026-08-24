"""
ResumeForge AI - Exporter Unit Tests
"""

from app.exporters.docx import generate_docx_resume
from app.exporters.pdf import generate_pdf_resume
from app.exporters.renderer import render_resume_to_html
from app.parsers.pdf_parser import PDFParser
from app.parsers.section_extractor import parse_resume_sections


def test_html_renderer(sample_resume_text: str):
    resume = parse_resume_sections(sample_resume_text)
    html = render_resume_to_html(resume, template_name="classic")
    assert "<!DOCTYPE html>" in html
    assert "Alex Mercer" in html
    assert "CloudTech Solutions" in html
    assert "Technical Skills" in html


def test_pdf_export_and_text_selectability(sample_resume_text: str):
    resume = parse_resume_sections(sample_resume_text)
    pdf_bytes = generate_pdf_resume(resume, template_name="classic")
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF")

    # Verify text is selectable/extractable from generated PDF
    extracted = PDFParser.extract_text(pdf_bytes)
    assert "Alex Mercer" in extracted
    assert "CloudTech Solutions" in extracted


def test_docx_export(sample_resume_text: str):
    resume = parse_resume_sections(sample_resume_text)
    docx_bytes = generate_docx_resume(resume, template_name="professional")
    assert len(docx_bytes) > 500
    assert docx_bytes.startswith(b"PK")  # ZIP header for docx
