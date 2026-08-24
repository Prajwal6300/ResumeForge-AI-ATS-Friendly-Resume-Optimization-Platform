"""
ResumeForge AI - Anthropic Claude Provider
"""

import json
import re
from typing import Any, Dict, Optional, Type
import httpx
from pydantic import BaseModel
from app.ai.base import AIProviderBase
from app.core.config import settings
from app.core.exceptions import AIProviderException


class AnthropicProvider(AIProviderBase):
    """Anthropic Claude API Provider implementation."""

    def __init__(self):
        if not settings.ANTHROPIC_API_KEY:
            raise AIProviderException("ANTHROPIC_API_KEY is not configured.")
        self.api_key = settings.ANTHROPIC_API_KEY
        self.model = settings.ANTHROPIC_MODEL

    @property
    def provider_name(self) -> str:
        return "anthropic"

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        body = {
            "model": self.model,
            "max_tokens": 4096,
            "temperature": temperature,
            "system": system_prompt + "\nYou MUST return only valid, parsable JSON without markdown backticks or commentary.",
            "messages": [
                {"role": "user", "content": user_prompt},
            ],
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post("https://api.anthropic.com/v1/messages", json=body, headers=headers)
                if resp.status_code != 200:
                    raise AIProviderException(f"Anthropic API returned status {resp.status_code}: {resp.text}")
                data = resp.json()
                text = data["content"][0]["text"].strip()
                # Clean any potential markdown wrapping
                text = re.sub(r"^```json\s*", "", text)
                text = re.sub(r"^```\s*", "", text)
                text = re.sub(r"\s*```$", "", text)
                return json.loads(text)
        except Exception as e:
            raise AIProviderException(
                message=f"Anthropic generation error: {str(e)}",
                details={"provider": "anthropic", "error": str(e)},
            )
