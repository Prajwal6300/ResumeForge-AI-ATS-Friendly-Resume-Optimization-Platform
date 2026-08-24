"""
ResumeForge AI - AI Orchestration Engine
Selects active AI provider, injects anti-fabrication safety prompts,
enforces Pydantic schema validation, and handles provider fallbacks.
"""

from typing import Any, Dict, Optional, Type, TypeVar
from pydantic import BaseModel, ValidationError
from app.ai.base import AIProviderBase
from app.ai.prompts.anti_fabrication import SYSTEM_ANTI_FABRICATION_DIRECTIVE
from app.ai.providers.anthropic import AnthropicProvider
from app.ai.providers.gemini import GeminiProvider
from app.ai.providers.mock import MockAIProvider
from app.ai.providers.ollama import OllamaProvider
from app.ai.providers.openai import OpenAIProvider
from app.core.config import settings
from app.core.exceptions import AIProviderException
from app.core.logging import logger

T = TypeVar("T", bound=BaseModel)


class AIOrchestrator:
    """Central manager for AI generation tasks."""

    def __init__(self):
        self.providers: Dict[str, AIProviderBase] = {}
        self._initialize_providers()

    def _initialize_providers(self):
        """Register all supported AI providers."""
        # Always register mock provider
        self.providers["mock"] = MockAIProvider()

        if settings.OPENAI_API_KEY:
            try:
                self.providers["openai"] = OpenAIProvider()
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI provider: {e}")

        if settings.ANTHROPIC_API_KEY:
            try:
                self.providers["anthropic"] = AnthropicProvider()
            except Exception as e:
                logger.warning(f"Could not initialize Anthropic provider: {e}")

        if settings.GEMINI_API_KEY:
            try:
                self.providers["gemini"] = GeminiProvider()
            except Exception as e:
                logger.warning(f"Could not initialize Gemini provider: {e}")

        # Local Ollama
        self.providers["ollama"] = OllamaProvider()

    def get_provider(self, provider_name: Optional[str] = None) -> AIProviderBase:
        name = (provider_name or settings.DEFAULT_AI_PROVIDER).lower()
        if name in self.providers:
            return self.providers[name]
        logger.info(f"Requested provider '{name}' not available or configured. Using mock fallback provider.")
        return self.providers["mock"]

    async def execute_structured_task(
        self,
        task_prompt: str,
        system_instructions: Optional[str] = None,
        schema: Optional[Type[T]] = None,
        provider_name: Optional[str] = None,
        temperature: float = 0.2,
    ) -> Any:
        """
        Execute an AI task with anti-fabrication instructions and Pydantic validation.
        """
        provider = self.get_provider(provider_name)
        full_system_prompt = SYSTEM_ANTI_FABRICATION_DIRECTIVE
        if system_instructions:
            full_system_prompt += f"\n\nSPECIFIC TASK DIRECTIVES:\n{system_instructions}"

        logger.info(f"Executing AI task with provider: {provider.provider_name}")

        try:
            raw_result = await provider.generate_json(
                system_prompt=full_system_prompt,
                user_prompt=task_prompt,
                schema=schema,
                temperature=temperature,
            )
        except Exception as e:
            # Fallback to mock provider on failure
            logger.warning(f"AI provider '{provider.provider_name}' failed: {e}. Falling back to mock provider.")
            mock_prov = self.providers["mock"]
            raw_result = await mock_prov.generate_json(
                system_prompt=full_system_prompt,
                user_prompt=task_prompt,
                schema=schema,
                temperature=temperature,
            )

        if schema:
            try:
                validated = schema.model_validate(raw_result)
                return validated
            except ValidationError as ve:
                logger.error(f"Schema validation error on AI output: {ve}. Output was: {raw_result}")
                # Re-validate with lenient default if possible
                raise AIProviderException(
                    message="AI output did not match expected structured schema",
                    details={"validation_errors": ve.errors()},
                )

        return raw_result


ai_orchestrator = AIOrchestrator()
