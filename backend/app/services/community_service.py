from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.community_repository import CommunityRepository
from app.schemas.community import CommunityCreate, CommunityResponse


class CommunityService:
    def __init__(self, db: Session):
        self.community_repo = CommunityRepository(db)

    def list_communities(self, category: Optional[str] = None) -> List[CommunityResponse]:
        communities = self.community_repo.list_all(category=category)
        return [CommunityResponse.model_validate(c) for c in communities]

    def get_community(self, community_id: str) -> CommunityResponse:
        comm = self.community_repo.get_by_id(community_id)
        if not comm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Community tribe not found."
            )
        return CommunityResponse.model_validate(comm)

    def create_community(
        self, community_data: CommunityCreate, creator_id: Optional[str] = None
    ) -> CommunityResponse:
        comm = self.community_repo.create(community_data, creator_id=creator_id)
        return CommunityResponse.model_validate(comm)
