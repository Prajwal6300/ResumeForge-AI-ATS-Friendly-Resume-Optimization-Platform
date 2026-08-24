"""
ResumeForge AI - Auth API Endpoints
"""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import AuthResponse, Token, UserCreate, UserLogin
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Register a new user account."""
    auth_service = AuthService(db)
    return await auth_service.register(user_in)


@router.post("/login", response_model=AuthResponse)
async def login(
    user_in: UserLogin,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Authenticate with email and password."""
    auth_service = AuthService(db)
    return await auth_service.login(user_in)


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_in: Token,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Obtain a new access token using a valid refresh token."""
    auth_service = AuthService(db)
    return await auth_service.refresh_token(token_in.refresh_token or token_in.access_token)


@router.post("/logout")
async def logout():
    """Client-side token invalidation."""
    return {"message": "Logged out successfully."}
