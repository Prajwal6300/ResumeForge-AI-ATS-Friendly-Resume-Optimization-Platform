"""
ResumeForge AI - Document Export Schemas
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import Field
from app.schemas.common import CoreModel

ExportFormatType = Literal["pdf", "docx"]
TemplateType = Literal["classic", "professional", "modern", "minimal"]


class ExportRequest(CoreModel):
    resume_id: str
    version_id: Optional[str] = None
    format: ExportFormatType = "pdf"
    template: TemplateType = "classic"


class ExportResponse(CoreModel):
    document_id: str
    resume_id: str
    format: ExportFormatType
    template: TemplateType
    filename: str
    download_url: str
    file_size_bytes: int
    created_at: datetime
