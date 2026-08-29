"""
ResumeForge AI - Storage Interface
"""

from abc import ABC, abstractmethod
from typing import BinaryIO, Union


class BaseStorageService(ABC):
    """Abstract interface for file storage backends."""

    @abstractmethod
    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "application/octet-stream",
        subdir: str = "",
    ) -> str:
        """Save file bytes and return relative or absolute file URI."""
        pass

    @abstractmethod
    async def get_file(self, file_path: str) -> bytes:
        """Read and return file bytes."""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete stored file."""
        pass
