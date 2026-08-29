"""
ResumeForge AI - Storage Factory
"""

from app.core.config import settings
from app.storage.base import BaseStorageService
from app.storage.local import LocalStorageService

_storage_instance: BaseStorageService = None


def get_storage_service() -> BaseStorageService:
    """Get the configured file storage service singleton."""
    global _storage_instance
    if _storage_instance is None:
        if settings.STORAGE_BACKEND == "s3" and settings.S3_ACCESS_KEY:
            from app.storage.s3 import S3StorageService
            _storage_instance = S3StorageService()
        else:
            _storage_instance = LocalStorageService(settings.LOCAL_UPLOAD_DIR)
    return _storage_instance
