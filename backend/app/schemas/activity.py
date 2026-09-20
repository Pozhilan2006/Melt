from typing import Optional, List
from pydantic import BaseModel
import datetime
from app.schemas.user import UserResponse


class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    venue_name: str
    area: str
    city: str = "Hyderabad"
    distance_km: float = 1.8
    lat: Optional[float] = 17.535
    lng: Optional[float] = 78.484
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime] = None
    capacity: int = 14
    entry_fee: Optional[str] = "Free"
    banner_bg: Optional[str] = "bg-neo-yellow"
    anime_sticker: Optional[str] = "⚽⚡"


class ActivityCreate(ActivityBase):
    community_id: Optional[str] = None


class ActivityResponse(ActivityBase):
    id: str
    status: str
    community_id: Optional[str] = None
    organizer_id: Optional[str] = None
    organizer: Optional[UserResponse] = None
    participants: List[UserResponse] = []
    created_at: datetime.datetime

    class Config:
        from_attributes = True
