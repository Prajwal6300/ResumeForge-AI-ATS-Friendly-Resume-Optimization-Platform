"""
ResumeForge AI - Core Exceptions and Error Handler
Consistent error response format across the entire API.
"""

from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException


class AppException(Exception):
    """Base exception class for domain errors."""
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details=details,
        )


class BadRequestException(AppException):
    def __init__(self, message: str, code: str = "BAD_REQUEST", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details,
        )


class ForbiddenException(AppException):
    def __init__(self, message: str = "Access forbidden", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN,
            details=details,
        )


class ConflictException(AppException):
    def __init__(self, message: str, code: str = "CONFLICT", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


class ValidationException(AppException):
    def __init__(self, message: str = "Validation failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class DocumentParsingException(AppException):
    def __init__(self, message: str = "Failed to parse document", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="RESUME_PARSE_FAILED",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class AIProviderException(AppException):
    def __init__(self, message: str = "AI service error", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="AI_PROVIDER_ERROR",
            status_code=status.HTTP_502_BAD_GATEWAY,
            details=details,
        )


def format_error_response(
    code: str,
    message: str,
    details: Optional[Any] = None,
    request_id: Optional[str] = None,
) -> Dict[str, Any]:
    return {
        "error": {
            "code": code,
            "message": message,
            "details": details,
            "request_id": request_id,
        }
    }


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response(
            code=exc.code,
            message=exc.message,
            details=exc.details,
            request_id=request_id,
        ),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    formatted_errors = []
    for error in exc.errors():
        loc = ".".join([str(x) for x in error.get("loc", []) if str(x) != "body"])
        formatted_errors.append({
            "field": loc or "root",
            "message": error.get("msg"),
            "type": error.get("type"),
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=format_error_response(
            code="VALIDATION_ERROR",
            message="Request validation failed. Please check your inputs.",
            details={"errors": formatted_errors},
            request_id=request_id,
        ),
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    code = "HTTP_ERROR"
    if exc.status_code == 404:
        code = "NOT_FOUND"
    elif exc.status_code == 401:
        code = "UNAUTHORIZED"
    elif exc.status_code == 403:
        code = "FORBIDDEN"
    elif exc.status_code == 405:
        code = "METHOD_NOT_ALLOWED"

    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response(
            code=code,
            message=str(exc.detail),
            details=None,
            request_id=request_id,
        ),
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=format_error_response(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred. Please try again later.",
            details=None,
            request_id=request_id,
        ),
    )
