"""
ResumeForge AI - Main FastAPI Application Server
"""

import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.staticfiles import StaticFiles
from pathlib import Path

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
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    logger.info("Initializing ResumeForge AI API Server...")
    # Initialize DB tables
    try:
        await init_db()
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")

    # Ensure uploads directory exists
    uploads_dir = Path(settings.LOCAL_UPLOAD_DIR).resolve()
    uploads_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"Local storage directory verified at: {uploads_dir}")

    yield

    logger.info("Shutting down ResumeForge AI API Server...")


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="ResumeForge AI - AI-Powered ATS Resume Optimization & Job Matching Platform API",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # 1. Request ID and Performance Logging Middleware
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

    # 2. CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Response-Time-MS"],
    )

    # 3. Register Custom Exception Handlers
    application.add_exception_handler(AppException, app_exception_handler)
    application.add_exception_handler(RequestValidationError, validation_exception_handler)
    application.add_exception_handler(StarletteHTTPException, http_exception_handler)
    application.add_exception_handler(Exception, generic_exception_handler)

    # 4. Mount Static Uploads (for development local storage)
    uploads_path = Path(settings.LOCAL_UPLOAD_DIR).resolve()
    uploads_path.mkdir(parents=True, exist_ok=True)
    if settings.ENVIRONMENT != "production":
        application.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

    # 5. Health Check Endpoints
    @application.get("/health", tags=["Health"])
    @application.get("/api/health", tags=["Health"])
    @application.get("/api/v1/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }

    # 6. Mount API v1 Router
    application.include_router(api_v1_router, prefix="/api")

    return application


app = create_app()
