"""
ResumeForge AI - Main FastAPI Application Server
Production-ready with PostgreSQL, health checks, CORS, and env validation.
"""

import os
import sys
import time
import uuid
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.api.v1 import api_v1_router
from app.core.config import settings
from app.core.exceptions import (
    AppException,
    app_exception_handler,
    generic_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.core.logging import logger
from app.db.session import init_db, async_engine

# ---------------------------------------------------------------------------
# Validation of required environment variables at startup
# ---------------------------------------------------------------------------
def _validate_env_vars() -> None:
    """Warn / error on missing critical env vars in production."""
    required_in_prod = ["SECRET_KEY", "DATABASE_URL", "CORS_ORIGINS"]
    if getattr(settings, "ENVIRONMENT", "development") == "production":
        missing = [v for v in required_in_prod if not getattr(settings, v, None)]
        if missing:
            logger.error(f"Missing required environment variables in production: {missing}")
            sys.exit(1)  # Hard stop so the container does not serve with bad config


# ---------------------------------------------------------------------------
# Lifespan / Startup logic
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    # Validate environment before starting
    _validate_env_vars()

    logger.info("Initializing ResumeForge AI API Server...")

    # Initialize DB tables / run migrations
    try:
        await init_db()
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        raise

    # Ensure uploads directory exists (only for local storage; S3 backend uses object storage)
    if settings.STORAGE_BACKEND == "local":
        uploads_dir = Path(settings.LOCAL_UPLOAD_DIR).resolve()
        uploads_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Local storage directory verified at: {uploads_dir}")

    yield

    logger.info("Shutting down ResumeForge AI API Server...")


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    _validate_env_vars()

    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="ResumeForge AI - AI-Powered ATS Resume Optimization & Job Matching Platform API",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # ───── 1. Request ID and Performance Logging Middleware ────────────────
    @application.middleware("http")
    async def request_middleware(request: Request, call_next):
        req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = req_id
        start_time = time.time()

        response = await call_next(request)

        duration_ms = (time.time() - start_time) * 1000.0
        response.headers["X-Request-ID"] = req_id
        response.headers["X-Response-Time-MS"] = f"{duration_ms:.2f}"

        logger.info(
            f"{request.method} {request.url.path} -> {response.status_code}",
            extra={"request_id": req_id, "duration_ms": duration_ms},
        )
        return response

    # ───── 2. CORS Middleware ─────────────────────────────────────────────
    # CORS_ORIGINS is a comma-separated string; cors_origins returns a list
    cors_origins_list: list[str] = list(settings.cors_origins)
    # Reject "*" if credentials are allowed (FastAPI enforces this)
    if "*" in cors_origins_list and settings.CORS_ORIGINS_ALLOW_CREDENTIALS:
        cors_origins_list.remove("*")
        logger.warning("CORS wildcard '*' removed because credentials are enabled.")

    application.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Response-Time-MS"],
    )

    # ───── 3. Register Custom Exception Handlers ───────────────────────────
    application.add_exception_handler(AppException, app_exception_handler)
    application.add_exception_handler(RequestValidationError, validation_exception_handler)
    application.add_exception_handler(StarletteHTTPException, http_exception_handler)
    application.add_exception_handler(Exception, generic_exception_handler)

    # ───── 4. Mount Static Uploads ────────────────────────────────────────
    if settings.STORAGE_BACKEND == "local":
        uploads_path = Path(settings.LOCAL_UPLOAD_DIR).resolve()
        uploads_path.mkdir(parents=True, exist_ok=True)
        if settings.ENVIRONMENT != "production":
            application.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

    # ───── 5. Health Check Endpoints ──────────────────────────────────────
    @application.get("/health", tags=["Health"])
    @application.get("/api/health", tags=["Health"])
    @application.get("/api/v1/health", tags=["Health"])
    async def health_check():
        """Return status and verify DB connectivity."""
        db_status = "unhealthy"
        try:
            # Use the async engine to run a lightweight query
            async with async_engine.begin() as conn:
                await conn.execute(text("SELECT 1"))
            db_status = "healthy"
        except Exception as e:
            logger.error(f"Health check DB query failed: {e}")
            db_status = "unhealthy"

        return {
            "status": db_status,
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }

    # ───── 6. Mount API v1 Router ─────────────────────────────────────────
    application.include_router(api_v1_router, prefix="/api")

    return application


app = create_app()