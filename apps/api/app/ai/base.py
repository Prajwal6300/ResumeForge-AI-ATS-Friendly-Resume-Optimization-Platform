"""
ResumeForge AI - AI Provider Abstract Base Class
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel


class AIProviderBase(ABC):
    """Abstract interface for all AI providers."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the AI provider."""
        pass

    @abstractmethod
    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        """
        Generate structured JSON output validated against optional Pydantic schema.
        """
        pass
