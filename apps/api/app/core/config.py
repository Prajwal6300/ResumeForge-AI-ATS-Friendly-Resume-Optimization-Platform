"""
ResumeForge AI - Core Application Configuration
Managed with Pydantic Settings.
"""

from typing import List, Optional
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # General
    APP_NAME: str = "ResumeForge AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Security & Auth
    SECRET_KEY: str = "resumeforge-super-secret-key-development-minimum-32-chars"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./resumeforge.db"
    SYNC_DATABASE_URL: str = "sqlite:///./resumeforge.db"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    # File Storage
    STORAGE_BACKEND: str = "local"  # "local" | "s3"
    LOCAL_UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx"]

    # S3 (optional)
    S3_BUCKET: str = "resumeforge-storage"
    S3_REGION: str = "us-east-1"
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_ENDPOINT_URL: Optional[str] = None

    # AI Providers
    DEFAULT_AI_PROVIDER: str = "mock"  # "openai" | "anthropic" | "gemini" | "ollama" | "mock"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"

    # ATS Scoring Engine Weights (must sum to 100)
    ATS_WEIGHT_KEYWORD_RELEVANCE: float = 40.0
    ATS_WEIGHT_TECHNICAL_SKILLS: float = 25.0
    ATS_WEIGHT_RESPONSIBILITIES: float = 20.0
    ATS_WEIGHT_EXPERIENCE_RELEVANCE: float = 10.0
    ATS_WEIGHT_RESUME_STRUCTURE: float = 5.0

    @field_validator("ATS_WEIGHT_RESUME_STRUCTURE")
    @classmethod
    def validate_weights_sum(cls, v: float, info) -> float:
        data = info.data
        k = data.get("ATS_WEIGHT_KEYWORD_RELEVANCE", 40.0)
        t = data.get("ATS_WEIGHT_TECHNICAL_SKILLS", 25.0)
        r = data.get("ATS_WEIGHT_RESPONSIBILITIES", 20.0)
        e = data.get("ATS_WEIGHT_EXPERIENCE_RELEVANCE", 10.0)
        total = k + t + r + e + v
        if abs(total - 100.0) > 0.01:
            raise ValueError(f"ATS weights must sum to 100%, currently sum to {total}%")
        return v


settings = Settings()
