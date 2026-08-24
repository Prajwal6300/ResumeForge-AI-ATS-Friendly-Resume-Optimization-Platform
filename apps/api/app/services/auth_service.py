"""
ResumeForge AI - Authentication & Authorization Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import BadRequestException, ConflictException, UnauthorizedException
from app.core.security import create_access_token, create_refresh_token, decode_token, get_password_hash, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.user import AuthResponse, Token, UserCreate, UserLogin, UserResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, user_in: UserCreate) -> AuthResponse:
        existing = await self.user_repo.get_by_email(user_in.email)
        if existing:
            raise ConflictException("An account with this email address already exists.")

        hashed_pw = get_password_hash(user_in.password)
        user = await self.user_repo.create(
            email=user_in.email.lower().strip(),
            hashed_password=hashed_pw,
            full_name=user_in.full_name.strip(),
            is_active=True,
            is_superuser=False,
        )

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return AuthResponse(
            user=UserResponse.model_validate(user),
            tokens=Token(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
            ),
        )

    async def login(self, user_in: UserLogin) -> AuthResponse:
        user = await self.user_repo.get_by_email(user_in.email)
        if not user:
            raise UnauthorizedException("Invalid email or password.")

        if not verify_password(user_in.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password.")

        if not user.is_active:
            raise UnauthorizedException("User account is inactive. Please contact support.")

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return AuthResponse(
            user=UserResponse.model_validate(user),
            tokens=Token(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
            ),
        )

    async def refresh_token(self, refresh_token: str) -> Token:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token type.")

        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Malformed token claims.")

        user = await self.user_repo.get(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive.")

        new_access_token = create_access_token(subject=user.id)
        new_refresh_token = create_refresh_token(subject=user.id)

        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
        )
