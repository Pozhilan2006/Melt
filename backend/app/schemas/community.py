from typing import Optional, List, Literal
from pydantic import BaseModel, Field, field_validator
import datetime
from app.schemas.user import UserResponse


class CommunityBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    tagline: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    category: str = Field(min_length=2, max_length=50)
    location: str = Field(default="Hyderabad", min_length=2, max_length=150)
    visibility: Literal["PUBLIC", "PRIVATE"] = "PUBLIC"
    banner_bg: Optional[str] = "bg-neo-yellow"
    anime_mascot: Optional[str] = "⚽🔥"

    @field_validator("name", "category", "location")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty.")
        return value


class CommunityCreate(CommunityBase):
    pass


class CommunityResponse(CommunityBase):
    id: str
    activity_status: str
    is_verified: bool
    created_by: Optional[str]
    created_at: datetime.datetime
    lead_user: Optional[UserResponse] = None
    member_count: int = 0
    members: List["CommunityMemberResponse"] = []
    membership: Optional["MembershipResponse"] = None

    class Config:
        from_attributes = True


class MembershipResponse(BaseModel):
    is_member: bool
    role: Optional[Literal["MEMBER", "ORGANIZER", "ADMIN"]] = None


class CommunityMemberResponse(BaseModel):
    id: str
    name: str
    username: str
    profile_image: Optional[str] = None
    role: Literal["MEMBER", "ORGANIZER", "ADMIN"]
    joined_at: datetime.datetime


class CommunityCreateResponse(CommunityResponse):
    pass
