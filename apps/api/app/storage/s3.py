"""
ResumeForge AI - S3-Compatible Object Storage Implementation
"""

import io
from typing import Optional
from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.storage.base import BaseStorageService
from app.storage.local import sanitize_filename


class S3StorageService(BaseStorageService):
    """Stores files on AWS S3 or Cloudflare R2 / MinIO."""

    def __init__(self):
        try:
            import boto3
            from botocore.config import Config
            self.s3_client = boto3.client(
                "s3",
                region_name=settings.S3_REGION,
                aws_access_key_id=settings.S3_ACCESS_KEY,
                aws_secret_access_key=settings.S3_SECRET_KEY,
                endpoint_url=settings.S3_ENDPOINT_URL,
                config=Config(signature_version="s3v4"),
            )
            self.bucket_name = settings.S3_BUCKET
        except Exception as e:
            raise BadRequestException(f"Failed to initialize S3 storage client: {str(e)}")

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "application/octet-stream",
        subdir: str = "",
    ) -> str:
        safe_name = sanitize_filename(filename)
        key = f"{subdir}/{safe_name}" if subdir else safe_name
        
        self.s3_client.upload_fileobj(
            io.BytesIO(file_bytes),
            self.bucket_name,
            key,
            ExtraArgs={"ContentType": content_type},
        )
        return f"s3://{self.bucket_name}/{key}"

    async def get_file(self, file_path: str) -> bytes:
        key = file_path.replace(f"s3://{self.bucket_name}/", "")
        out = io.BytesIO()
        self.s3_client.download_fileobj(self.bucket_name, key, out)
        return out.getvalue()

    async def delete_file(self, file_path: str) -> bool:
        key = file_path.replace(f"s3://{self.bucket_name}/", "")
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except Exception:
            return False
