"""
ResumeForge AI - Dependency Injection Utilities
"""

from typing import Annotated, AsyncGenerator, Optional
from fastapi import Depends, Header, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import UnauthorizedException
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(bearer_scheme)] = None,
    token_query: Annotated[Optional[str], Query(alias="token")] = None,
) -> User:
    """Validate Bearer JWT token and resolve current authenticated User."""
    raw_token: Optional[str] = None
    if credentials and credentials.credentials:
        raw_token = credentials.credentials
    elif token_query:
        raw_token = token_query

    if not raw_token:
        raise UnauthorizedException("Authentication token required.")

    payload = decode_token(raw_token)
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload.")

    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    if not user:
        raise UnauthorizedException("User not found.")

    if not user.is_active:
        raise UnauthorizedException("User account is inactive.")

    return user


async def get_current_active_superuser(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Require superuser permissions."""
    if not current_user.is_superuser:
        raise UnauthorizedException("Superuser privileges required.")
    return current_user
