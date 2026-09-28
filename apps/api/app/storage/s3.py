"""
ResumeForge AI - S3-Compatible Object Storage Implementation
Works with AWS S3, Cloudflare R2, or Supabase Storage S3 API.
"""

import io
import os
from typing import Optional
from botocore.exceptions import BotoCoreError, ClientError
from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.storage.base import BaseStorageService
from app.storage.local import sanitize_filename


class S3StorageService(BaseStorageService):
    """Stores files on AWS S3 or Cloudflare R2 / MinIO / Supabase Storage S3 API."""

    def __init__(self):
        try:
            import boto3
            from botocore.config import Config

            # Support both traditional AWS naming and Supabase/alternative naming
            access_key = settings.S3_ACCESS_KEY_ID or os.getenv("S3_ACCESS_KEY_ID")
            secret_key = settings.S3_SECRET_ACCESS_KEY or os.getenv("S3_SECRET_ACCESS_KEY")

            if not access_key or not secret_key:
                raise BadRequestException(
                    "S3 credentials not configured. Set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY."
                )

            self.s3_client = boto3.client(
                "s3",
                region_name=settings.S3_REGION,
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                endpoint_url=settings.S3_ENDPOINT_URL,
                config=Config(signature_version="s3v4"),
            )
            self.bucket_name = settings.S3_BUCKET
            if not self.bucket_name:
                raise BadRequestException("S3_BUCKET environment variable is not set.")

        except BadRequestException:
            raise
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

        try:
            self.s3_client.upload_fileobj(
                io.BytesIO(file_bytes),
                self.bucket_name,
                key,
                ExtraArgs={"ContentType": content_type},
            )
            return f"s3://{self.bucket_name}/{key}"
        except (BotoCoreError, ClientError) as e:
            raise BadRequestException(f"S3 upload failed: {str(e)}")

    async def get_file(self, file_path: str) -> bytes:
        key = file_path.replace(f"s3://{self.bucket_name}/", "").lstrip("/")
        try:
            out = io.BytesIO()
            self.s3_client.download_fileobj(self.bucket_name, key, out)
            return out.getvalue()
        except (BotoCoreError, ClientError) as e:
            raise BadRequestException(f"S3 download failed: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        key = file_path.replace(f"s3://{self.bucket_name}/", "").lstrip("/")
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except (BotoCoreError, ClientError):
            return False