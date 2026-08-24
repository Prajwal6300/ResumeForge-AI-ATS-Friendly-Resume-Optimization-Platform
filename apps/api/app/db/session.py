"""
ResumeForge AI - Database Session Management
Supports Async SQLAlchemy with PostgreSQL (production) and SQLite (dev/test).
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.db.base import Base

# Determine connect args based on DB engine
connect_args = {}
if "sqlite" in settings.DATABASE_URL:
    connect_args = {"check_same_thread": False}

# Async Engine for main API operations
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Sync Engine (for Alembic, seed scripts, background sync tasks)
sync_engine = create_engine(
    settings.SYNC_DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    class_=Session,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency injection for FastAPI endpoints to get an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables if they do not exist."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
