"""
ResumeForge AI - Common Pydantic Base Schemas
"""

from datetime import datetime
from typing import Any, Dict, Generic, List, Optional, TypeVar
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class CoreModel(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class APIResponse(CoreModel, Generic[T]):
    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None
