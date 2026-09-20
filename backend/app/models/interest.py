import uuid
import datetime
from sqlalchemy import Column, String, DateTime
from app.core.database import Base


class Interest(Base):
    __tablename__ = "interests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    emoji = Column(String(10), nullable=True, default="⚡")
    badge_bg = Column(String(50), nullable=True, default="bg-neo-yellow")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
