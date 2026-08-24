"""
ResumeForge AI - User Profile API Endpoints
"""

from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Retrieve current authenticated user profile."""
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    update_in: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Update profile attributes or change password."""
    user_service = UserService(db)
    return await user_service.update_profile(current_user.id, update_in)
