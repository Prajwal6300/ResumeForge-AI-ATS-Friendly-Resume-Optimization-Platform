"""
ResumeForge AI - Structured Logging Configuration
"""

import json
import logging
import sys
import time
from typing import Any, Dict
from app.core.config import settings


class JSONFormatter(logging.Formatter):
    """Format logs as structured JSON in production, or clear text in development."""
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id
        if hasattr(record, "duration_ms"):
            log_data["duration_ms"] = record.duration_ms
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        if settings.ENVIRONMENT == "production":
            return json.dumps(log_data)
        
        # Friendly format for development
        req = f" [req:{record.request_id}]" if hasattr(record, "request_id") else ""
        dur = f" ({record.duration_ms:.2f}ms)" if hasattr(record, "duration_ms") else ""
        return f"[{log_data['timestamp']}] {record.levelname:<5} {record.name}{req}{dur}: {record.getMessage()}"


def setup_logging() -> logging.Logger:
    """Initialize structured root logger."""
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO if not settings.DEBUG else logging.DEBUG)

    # Remove existing handlers to avoid duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter(datefmt="%Y-%m-%d %H:%M:%S"))
    root_logger.addHandler(handler)

    # Suppress verbose third party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("aiosqlite").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)

    return root_logger


logger = setup_logging()
