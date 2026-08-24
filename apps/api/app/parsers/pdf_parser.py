"""
ResumeForge AI - PDF Document Parser
Extracts high-fidelity plain text and structural data from PDF resumes and job descriptions.
"""

import io
from typing import Dict, Any, Optional
from app.core.exceptions import DocumentParsingException
from app.parsers.text_cleaner import clean_text


class PDFParser:
    """Parses PDF documents using pdfplumber and pypdf fallback."""

    @staticmethod
    def extract_text(pdf_bytes: bytes) -> str:
        """Extract full plain text from PDF bytes."""
        if not pdf_bytes:
            raise DocumentParsingException("Empty PDF file provided.")

        extracted_text = ""

        # Primary extraction using pdfplumber
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                page_texts = []
                for page in pdf.pages:
                    text = page.extract_text(layout=False) or ""
                    # If page contains tables, extract text from tables as well
                    tables = page.extract_tables()
                    table_text = []
                    for table in tables:
                        for row in table:
                            row_str = " | ".join([cell for cell in row if cell])
                            if row_str:
                                table_text.append(row_str)
                    
                    combined = text + ("\n" + "\n".join(table_text) if table_text else "")
                    if combined.strip():
                        page_texts.append(combined)
                
                extracted_text = "\n\n".join(page_texts)
        except Exception as e:
            # Fallback to pypdf
            extracted_text = ""

        # Fallback to pypdf if pdfplumber extracted nothing or failed
        if not extracted_text.strip():
            try:
                import pypdf
                reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
                page_texts = []
                for page in reader.pages:
                    t = page.extract_text()
                    if t and t.strip():
                        page_texts.append(t.strip())
                extracted_text = "\n\n".join(page_texts)
            except Exception as e:
                raise DocumentParsingException(
                    message=f"Failed to parse PDF document: {str(e)}",
                    details={"parser_error": str(e)},
                )

        cleaned = clean_text(extracted_text)
        if not cleaned:
            raise DocumentParsingException(
                message="Could not extract readable text from PDF. The document may be scanned or image-only.",
                details={"reason": "empty_extracted_text"},
            )

        return cleaned
