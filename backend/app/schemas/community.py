from typing import Optional, List
from pydantic import BaseModel
import datetime
from app.schemas.user import UserResponse


class CommunityBase(BaseModel):
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: str
    location: str = "Hyderabad"
    visibility: str = "PUBLIC"
    banner_bg: Optional[str] = "bg-neo-yellow"
    anime_mascot: Optional[str] = "⚽🔥"


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
    members: List[UserResponse] = []

    class Config:
        from_attributes = True
