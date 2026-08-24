"""
ResumeForge AI - OpenAI Provider
"""

import json
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel
from app.ai.base import AIProviderBase
from app.core.config import settings
from app.core.exceptions import AIProviderException


class OpenAIProvider(AIProviderBase):
    """OpenAI API Provider implementation."""

    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise AIProviderException("OPENAI_API_KEY is not configured.")
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = settings.OPENAI_MODEL
        except Exception as e:
            raise AIProviderException(f"Failed to initialize OpenAI client: {str(e)}")

    @property
    def provider_name(self) -> str:
        return "openai"

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                temperature=temperature,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
            content = response.choices[0].message.content or "{}"
            parsed = json.loads(content)
            return parsed
        except Exception as e:
            raise AIProviderException(
                message=f"OpenAI completion error: {str(e)}",
                details={"provider": "openai", "error": str(e)},
            )
