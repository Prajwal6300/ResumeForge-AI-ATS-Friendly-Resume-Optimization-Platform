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
    SYNC_DATABASE_URL: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, v: Optional[str]) -> str:
        if not v:
            return "sqlite+aiosqlite:///./resumeforge.db"
        url = str(v).strip()
        # Normalize postgres:// and postgresql:// to postgresql+asyncpg:// for async SQLAlchemy engine
        if url.startswith("postgres://"):
            url = "postgresql+asyncpg://" + url[len("postgres://"):]
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = "postgresql+asyncpg://" + url[len("postgresql://"):]
        return url

    @property
    def sync_database_url_resolved(self) -> str:
        """Resolve synchronous database connection string for Alembic and sync tools."""
        if self.SYNC_DATABASE_URL and self.SYNC_DATABASE_URL.strip():
            url = self.SYNC_DATABASE_URL.strip()
            if url.startswith("postgres://"):
                url = "postgresql+psycopg://" + url[len("postgres://"):]
            elif url.startswith("postgresql+asyncpg://"):
                url = "postgresql+psycopg://" + url[len("postgresql+asyncpg://"):]
            return url
        # Derive from DATABASE_URL
        if "sqlite" in self.DATABASE_URL:
            return "sqlite:///./resumeforge.db"
        elif "postgresql+asyncpg://" in self.DATABASE_URL:
            return self.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql+psycopg://")
        elif "postgresql://" in self.DATABASE_URL:
            return self.DATABASE_URL
        return "sqlite:///./resumeforge.db"

    # CORS
    ALLOWED_ORIGINS: str = "https://resume-forge-ai-ats-friendly-resume.vercel.app,http://localhost:3000,http://127.0.0.1:3000"
    CORS_ORIGINS: Optional[str] = None

    @property
    def cors_origins(self) -> List[str]:
        raw = self.CORS_ORIGINS or self.ALLOWED_ORIGINS or ""
        if not raw.strip():
            return ["https://resume-forge-ai-ats-friendly-resume.vercel.app"]
        origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
        return origins

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
