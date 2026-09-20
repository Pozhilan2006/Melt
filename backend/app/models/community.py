import uuid
import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class CommunityMember(Base):
    __tablename__ = "community_members"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    community_id = Column(String(36), ForeignKey("communities.id", ondelete="CASCADE"), primary_key=True)
    role = Column(String(20), default="MEMBER", nullable=False)  # MEMBER, ORGANIZER, ADMIN
    joined_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "community_id", name="uq_community_member"),)


class Community(Base):
    __tablename__ = "communities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(120), nullable=False, index=True)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    location = Column(String(150), nullable=False, default="Hyderabad")
    visibility = Column(String(20), default="PUBLIC", nullable=False)  # PUBLIC, PRIVATE
    activity_status = Column(String(50), default="VERY ACTIVE", nullable=False)  # VERY ACTIVE, ACTIVE, NEW, LOOKING FOR MEMBERS
    banner_bg = Column(String(50), default="bg-neo-yellow")
    anime_mascot = Column(String(10), default="⚽🔥")
    is_verified = Column(Boolean, default=True)

    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    lead_user = relationship("User", foreign_keys=[created_by])
    members = relationship("User", secondary="community_members", backref="communities")
