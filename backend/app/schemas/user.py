from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
import datetime
from app.schemas.interest import InterestResponse


# ── Registration & Login ──────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    """Payload for creating a new account. Username is auto-generated."""
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty.")
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters.")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        return v


class LoginRequest(BaseModel):
    """Payload for authenticating an existing account."""
    email: EmailStr
    password: str


# ── User Profile Schemas ──────────────────────────────────────────────────────

class UserBase(BaseModel):
    name: str
    username: str
    email: EmailStr
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    location_name: Optional[str] = "Kompally, Hyderabad"
    lat: Optional[float] = 17.535
    lng: Optional[float] = 78.484


class UserCreate(UserBase):
    """Internal schema used by the repository layer (includes hashed_pwd separately)."""
    password: str


class UserUpdate(BaseModel):
    """Fields the user is allowed to change via PATCH /users/me."""
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    bio: Optional[str] = Field(default=None, max_length=500)
    profile_image: Optional[str] = Field(default=None, max_length=255)
    location_name: Optional[str] = Field(default=None, max_length=150)
    lat: Optional[float] = Field(default=None, ge=-90, le=90)
    lng: Optional[float] = Field(default=None, ge=-180, le=180)

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) < 2:
                raise ValueError("Name must be at least 2 characters.")
        return v


class InterestUpdate(BaseModel):
    """Replace the user's interests wholesale."""
    interest_ids: List[str]


# ── Response Schemas (never expose password_hash) ─────────────────────────────

class UserResponse(BaseModel):
    id: str
    name: str
    username: str
    email: EmailStr
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    location_name: Optional[str] = None
    badge: str
    hype_level: int
    karma: int
    is_onboarded: bool
    is_active: bool
    created_at: datetime.datetime
    interests: List[InterestResponse] = []

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
