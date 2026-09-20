from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.interest import Interest
from app.schemas.user import RegisterRequest, UserUpdate


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    # ── Read ──────────────────────────────────────────────────────────────────

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id, User.is_active == True).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()

    # ── Create ────────────────────────────────────────────────────────────────

    def create(self, name: str, email: str, username: str, hashed_password: str) -> User:
        db_user = User(
            name=name,
            username=username,
            email=email,
            password_hash=hashed_password,
            is_onboarded=False,
            is_active=True,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    # ── Update ────────────────────────────────────────────────────────────────

    def update(self, user: User, update_data: UserUpdate) -> User:
        """Apply partial profile changes to an existing user."""
        data = update_data.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(user, field, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def set_interests(self, user: User, interest_ids: List[str]) -> User:
        """Replace the user's interests with the given list of interest IDs."""
        unique_interest_ids = list(dict.fromkeys(interest_ids))
        interests = self.db.query(Interest).filter(Interest.id.in_(unique_interest_ids)).all()
        if len(interests) != len(unique_interest_ids):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="One or more selected interests are invalid.",
            )
        user.interests = interests
        self.db.commit()
        self.db.refresh(user)
        return user

    def mark_onboarded(self, user: User) -> User:
        """Mark that the user has completed onboarding."""
        user.is_onboarded = True
        self.db.commit()
        self.db.refresh(user)
        return user
