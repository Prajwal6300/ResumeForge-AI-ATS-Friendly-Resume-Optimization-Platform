"""
ResumeForge AI - Ollama Local Provider
"""

import json
from typing import Any, Dict, Optional, Type
import httpx
from pydantic import BaseModel
from app.ai.base import AIProviderBase
from app.core.config import settings
from app.core.exceptions import AIProviderException


class OllamaProvider(AIProviderBase):
    """Local Ollama Provider implementation."""

    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        self.model = settings.OLLAMA_MODEL

    @property
    def provider_name(self) -> str:
        return "ollama"

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/api/generate"
        body = {
            "model": self.model,
            "system": system_prompt,
            "prompt": user_prompt,
            "format": "json",
            "stream": False,
            "options": {"temperature": temperature},
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                resp = await client.post(url, json=body)
                if resp.status_code != 200:
                    raise AIProviderException(f"Ollama server returned {resp.status_code}: {resp.text}")
                data = resp.json()
                raw_response = data.get("response", "{}")
                return json.loads(raw_response)
        except Exception as e:
            raise AIProviderException(
                message=f"Ollama generation error: {str(e)}",
                details={"provider": "ollama", "error": str(e)},
            )
