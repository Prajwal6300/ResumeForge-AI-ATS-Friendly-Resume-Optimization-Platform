"""
ResumeForge AI - User Schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import EmailStr, Field
from app.schemas.common import CoreModel


class UserBase(CoreModel):
    email: EmailStr
    full_name: str = Field(default="", max_length=255)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(CoreModel):
    email: EmailStr
    password: str


class UserUpdate(CoreModel):
    full_name: Optional[str] = Field(None, max_length=255)
    password: Optional[str] = Field(None, min_length=6, max_length=128)


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime


class Token(CoreModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = 86400  # seconds


class AuthResponse(CoreModel):
    user: UserResponse
    tokens: Token
