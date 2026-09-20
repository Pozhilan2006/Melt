from typing import Optional
from pydantic import BaseModel
import datetime


class InterestBase(BaseModel):
    name: str
    category: str
    emoji: Optional[str] = "⚡"
    badge_bg: Optional[str] = "bg-neo-yellow"


class InterestCreate(InterestBase):
    pass


class InterestResponse(InterestBase):
    id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
