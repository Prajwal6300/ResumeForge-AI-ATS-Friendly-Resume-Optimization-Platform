"""
ResumeForge AI - Local File Storage Implementation
"""

import os
import re
import uuid
from pathlib import Path
from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.storage.base import BaseStorageService


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal and illicit characters."""
    # Keep only alphanumeric, dots, dashes, and underscores
    clean = re.sub(r"[^a-zA-Z0-9._-]", "_", filename)
    clean = clean.lstrip(".").strip()
    if not clean:
        clean = f"file_{uuid.uuid4().hex[:8]}"
    return clean


class LocalStorageService(BaseStorageService):
    """Stores files on the local filesystem."""

    def __init__(self, base_dir: str = settings.LOCAL_UPLOAD_DIR):
        self.base_dir = Path(base_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "application/octet-stream",
        subdir: str = "",
    ) -> str:
        safe_name = sanitize_filename(filename)
        unique_prefix = uuid.uuid4().hex[:12]
        final_name = f"{unique_prefix}_{safe_name}"

        target_dir = self.base_dir
        if subdir:
            safe_subdir = sanitize_filename(subdir)
            target_dir = target_dir / safe_subdir
            target_dir.mkdir(parents=True, exist_ok=True)

        target_path = (target_dir / final_name).resolve()

        # Security check: ensure target is inside base_dir
        if not str(target_path).startswith(str(self.base_dir)):
            raise BadRequestException("Invalid file destination path")

        # Async write to disk
        with open(target_path, "wb") as f:
            f.write(file_bytes)

        # Return relative path from base_dir with forward slashes
        rel_path = target_path.relative_to(self.base_dir).as_posix()
        return f"/uploads/{rel_path}"

    async def get_file(self, file_path: str) -> bytes:
        # Strip leading "/uploads/" if present
        clean_path = file_path.replace("/uploads/", "").lstrip("/")
        full_path = (self.base_dir / clean_path).resolve()

        if not str(full_path).startswith(str(self.base_dir)) or not full_path.exists():
            raise BadRequestException("Requested file not found on server")

        with open(full_path, "rb") as f:
            return f.read()

    async def delete_file(self, file_path: str) -> bool:
        clean_path = file_path.replace("/uploads/", "").lstrip("/")
        full_path = (self.base_dir / clean_path).resolve()

        if str(full_path).startswith(str(self.base_dir)) and full_path.exists():
            try:
                full_path.unlink()
                return True
            except OSError:
                return False
        return False
