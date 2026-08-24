"""
ResumeForge AI - User Profile Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def get_profile(self, user_id: str) -> UserResponse:
        user = await self.user_repo.get(user_id)
        if not user:
            raise NotFoundException("User not found.")
        return UserResponse.model_validate(user)

    async def update_profile(self, user_id: str, update_data: UserUpdate) -> UserResponse:
        user = await self.user_repo.get(user_id)
        if not user:
            raise NotFoundException("User not found.")

        update_kwargs = {}
        if update_data.full_name is not None:
            update_kwargs["full_name"] = update_data.full_name
        if update_data.password is not None:
            update_kwargs["hashed_password"] = get_password_hash(update_data.password)

        updated = await self.user_repo.update(user_id, **update_kwargs)
        return UserResponse.model_validate(updated)
