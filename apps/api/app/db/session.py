"""
ResumeForge AI - Database Session Management
Supports Async SQLAlchemy with PostgreSQL (production) and SQLite (dev/test).
Handles Supabase pgbouncer pooler quirks (statement_cache_size=0).
"""

import logging
import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.db.base import Base

logger = logging.getLogger(__name__)

# Determine connect args based on DB engine
connect_args = {}
if "sqlite" in settings.DATABASE_URL:
    connect_args = {"check_same_thread": False}

# Pgbouncer pooler quirk: in transaction mode, prepared statement cache must be 0
# to avoid "Prepared statement does not exist" errors.
# Detect this from the DATABASE_URL if it contains a pooler endpoint.
_db_url_lower = settings.DATABASE_URL.lower()
if "pooler" in _db_url_lower or "supabase" in _db_url_lower:
    connect_args["statement_cache_size"] = 0
    logger.info(
        "Detected pgbouncer pooler in DATABASE_URL; setting statement_cache_size=0"
    )

# Async Engine for main API operations
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
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
sync_connect_args = {}
if "sqlite" in settings.sync_database_url_resolved:
    sync_connect_args = {"check_same_thread": False}

sync_engine = create_engine(
    settings.sync_database_url_resolved,
    echo=settings.DEBUG,
    connect_args=sync_connect_args,
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