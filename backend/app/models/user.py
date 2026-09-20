import uuid
import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, UniqueConstraint, Float, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base, is_sqlite

if not is_sqlite:
    from geoalchemy2 import Geography
else:
    Geography = None


class UserInterest(Base):
    __tablename__ = "user_interests"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    interest_id = Column(String(36), ForeignKey("interests.id", ondelete="CASCADE"), primary_key=True)

    __table_args__ = (UniqueConstraint("user_id", "interest_id", name="uq_user_interest"),)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    bio = Column(Text, nullable=True)
    profile_image = Column(String(255), nullable=True)
    
    # Location fields
    location_name = Column(String(150), nullable=True, default="Kompally, Hyderabad")
    lat = Column(Float, nullable=True, default=17.535)
    lng = Column(Float, nullable=True, default=78.484)
    if not is_sqlite:
        geom = Column(Geography(geometry_type="POINT", srid=4326), nullable=True)

    # Reputation & Badges
    badge = Column(String(50), default="NEW MEMBER")
    hype_level = Column(Integer, default=10)
    karma = Column(Integer, default=100)

    # Account state
    is_active = Column(Boolean, default=True, nullable=False)
    is_onboarded = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    interests = relationship("Interest", secondary="user_interests", backref="users")
