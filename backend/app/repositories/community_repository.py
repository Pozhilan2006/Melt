from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.community import Community, CommunityMember
from app.schemas.community import CommunityCreate


class CommunityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, community_id: str) -> Optional[Community]:
        return self.db.query(Community).filter(Community.id == community_id).first()

    def list_all(self, category: Optional[str] = None, limit: int = 20) -> List[Community]:
        query = self.db.query(Community)
        if category and category != "ALL":
            query = query.filter(Community.category == category)
        return query.limit(limit).all()

    def create(self, community_data: CommunityCreate, creator_id: Optional[str] = None) -> Community:
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
        self.db.commit()
        self.db.refresh(db_community)

        # Automatically add creator as ADMIN member if provided
        if creator_id:
            membership = CommunityMember(
                user_id=creator_id,
                community_id=db_community.id,
                role="ADMIN"
            )
            self.db.add(membership)
            self.db.commit()

        return db_community
