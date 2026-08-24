"""
ResumeForge AI - Google Gemini Provider
"""

import json
import re
from typing import Any, Dict, Optional, Type
import httpx
from pydantic import BaseModel
from app.ai.base import AIProviderBase
from app.core.config import settings
from app.core.exceptions import AIProviderException


class GeminiProvider(AIProviderBase):
    """Google Gemini API Provider implementation."""

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise AIProviderException("GEMINI_API_KEY is not configured.")
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL

    @property
    def provider_name(self) -> str:
        return "gemini"

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        body = {
            "system_instruction": {
                "parts": [{"text": system_prompt + "\nYou MUST return only valid, pure JSON without surrounding markdown tags."}]
            },
            "contents": [
                {"role": "user", "parts": [{"text": user_prompt}]}
            ],
            "generationConfig": {
                "temperature": temperature,
                "responseMimeType": "application/json",
            },
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, json=body, headers=headers)
                if resp.status_code != 200:
                    raise AIProviderException(f"Gemini API returned status {resp.status_code}: {resp.text}")
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                text = re.sub(r"^```json\s*", "", text)
                text = re.sub(r"^```\s*", "", text)
                text = re.sub(r"\s*```$", "", text)
                return json.loads(text)
        except Exception as e:
            raise AIProviderException(
                message=f"Gemini generation error: {str(e)}",
                details={"provider": "gemini", "error": str(e)},
            )
