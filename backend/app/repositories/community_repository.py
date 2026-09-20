from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.community import Community, CommunityMember
from app.schemas.community import CommunityCreate


class CommunityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, community_id: str) -> Optional[Community]:
        return self.db.query(Community).filter(Community.id == community_id).first()

    def list_all(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        visibility: Optional[str] = "PUBLIC",
        limit: int = 50,
    ) -> List[Community]:
        query = self.db.query(Community)
        if category and category != "ALL":
            query = query.filter(Community.category == category)
        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                Community.name.ilike(pattern) | Community.description.ilike(pattern)
            )
        if visibility:
            query = query.filter(Community.visibility == visibility)
        return query.limit(limit).all()

    def create(self, community_data: CommunityCreate, creator_id: str) -> Community:
        db_community = Community(
            name=community_data.name,
            tagline=community_data.tagline,
            description=community_data.description,
            category=community_data.category,
            location=community_data.location,
            visibility=community_data.visibility,
            banner_bg=community_data.banner_bg or "bg-neo-yellow",
            anime_mascot=community_data.anime_mascot or "⚽🔥",
            created_by=creator_id,
        )
        self.db.add(db_community)
        self.db.flush()
        self.db.refresh(db_community)

        membership = CommunityMember(
            user_id=creator_id,
            community_id=db_community.id,
            role="ADMIN",
        )
        self.db.add(membership)
        self.db.commit()
        self.db.refresh(db_community)

        return db_community

    def get_membership(self, community_id: str, user_id: str) -> Optional[CommunityMember]:
        return (
            self.db.query(CommunityMember)
            .filter(
                CommunityMember.community_id == community_id,
                CommunityMember.user_id == user_id,
            )
            .first()
        )

    def count_members(self, community_id: str) -> int:
        return (
            self.db.query(CommunityMember)
            .filter(CommunityMember.community_id == community_id)
            .count()
        )

    def list_members(self, community_id: str) -> List[CommunityMember]:
        return (
            self.db.query(CommunityMember)
            .filter(CommunityMember.community_id == community_id)
            .order_by(CommunityMember.joined_at.asc())
            .all()
        )

    def add_member(self, community_id: str, user_id: str, role: str = "MEMBER") -> CommunityMember:
        membership = CommunityMember(
            community_id=community_id,
            user_id=user_id,
            role=role,
        )
        self.db.add(membership)
        self.db.commit()
        self.db.refresh(membership)
        return membership

    def remove_member(self, membership: CommunityMember) -> None:
        self.db.delete(membership)
        self.db.commit()

    def count_admins(self, community_id: str) -> int:
        return (
            self.db.query(CommunityMember)
            .filter(
                CommunityMember.community_id == community_id,
                CommunityMember.role == "ADMIN",
            )
            .count()
        )
