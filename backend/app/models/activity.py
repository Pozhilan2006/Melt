import uuid
import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, UniqueConstraint, Float, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base, is_sqlite

if not is_sqlite:
    from geoalchemy2 import Geography
else:
    Geography = None


class ActivityParticipant(Base):
    __tablename__ = "activity_participants"

    activity_id = Column(String(36), ForeignKey("activities.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    status = Column(String(20), default="JOINED", nullable=False)  # JOINED, INVITED, LEFT
    joined_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    __table_args__ = (UniqueConstraint("activity_id", "user_id", name="uq_activity_participant"),)


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    
    community_id = Column(String(36), ForeignKey("communities.id", ondelete="SET NULL"), nullable=True)
    organizer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Location details
    venue_name = Column(String(150), nullable=False)
    area = Column(String(100), nullable=False)
    city = Column(String(100), default="Hyderabad", nullable=False)
    distance_km = Column(Float, default=1.8)
    lat = Column(Float, nullable=True, default=17.535)
    lng = Column(Float, nullable=True, default=78.484)
    if not is_sqlite:
        geom = Column(Geography(geometry_type="POINT", srid=4326), nullable=True)

    # Date & Time
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)

    # Capacity & Status (DRAFT, PUBLISHED, OPEN, FULL, STARTED, COMPLETED, CANCELLED)
    capacity = Column(Integer, default=14, nullable=False)
    status = Column(String(20), default="OPEN", nullable=False)
    entry_fee = Column(String(50), default="Free")
    banner_bg = Column(String(50), default="bg-neo-yellow")
    anime_sticker = Column(String(10), default="⚽⚡")

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    organizer = relationship("User", foreign_keys=[organizer_id])
    community = relationship("Community", backref="activities")
    participants = relationship("User", secondary="activity_participants", backref="participated_activities")
