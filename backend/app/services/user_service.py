import re
import random
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.user import RegisterRequest, LoginRequest, UserUpdate, InterestUpdate, UserResponse, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User


def _generate_username(name: str, repo: UserRepository) -> str:
    """
    Derive a unique username from the user's display name.
    e.g. "Pozhilan Kumar" -> "pozhilankumar_4821"
    Retries with new suffixes until unique.
    """
    base = re.sub(r"[^a-z0-9]", "", name.lower().replace(" ", ""))
    if not base:
        base = "user"
    for _ in range(10):
        candidate = f"{base}_{random.randint(1000, 9999)}"
        if not repo.get_by_username(candidate):
            return candidate
    # Fallback: use a longer random suffix
    return f"{base}_{random.randint(10000, 99999)}"


class UserService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    # ── Auth ──────────────────────────────────────────────────────────────────

    def register_user(self, data: RegisterRequest) -> TokenResponse:
        """Create a new account and return a JWT."""
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists.",
            )

        username = _generate_username(data.name, self.user_repo)
        hashed_pwd = get_password_hash(data.password)
        db_user = self.user_repo.create(
            name=data.name,
            email=data.email,
            username=username,
            hashed_password=hashed_pwd,
        )

        token = create_access_token(subject=db_user.id)
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(db_user),
        )

    def authenticate_user(self, data: LoginRequest) -> TokenResponse:
        """Verify credentials and return a JWT. Deliberately vague error to avoid enumeration."""
        invalid_credentials_exc = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

        db_user = self.user_repo.get_by_email(data.email)
        if not db_user:
            raise invalid_credentials_exc
        if not verify_password(data.password, db_user.password_hash):
            raise invalid_credentials_exc
        if not db_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated.",
            )

        token = create_access_token(subject=db_user.id)
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(db_user),
        )

    # ── Profile ───────────────────────────────────────────────────────────────

    def get_user_profile(self, user_id: str) -> UserResponse:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        return UserResponse.model_validate(user)

    def update_profile(self, user: User, data: UserUpdate) -> UserResponse:
        updated = self.user_repo.update(user, data)
        return UserResponse.model_validate(updated)

    def update_interests(self, user: User, data: InterestUpdate) -> UserResponse:
        updated = self.user_repo.set_interests(user, data.interest_ids)
        return UserResponse.model_validate(updated)

    def complete_onboarding(self, user: User) -> UserResponse:
        updated = self.user_repo.mark_onboarded(user)
        return UserResponse.model_validate(updated)
