from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.community import Community, CommunityMember
from app.models.user import User
from app.repositories.community_repository import CommunityRepository
from app.schemas.community import (
    CommunityCreate,
    CommunityResponse,
    CommunityMemberResponse,
    MembershipResponse,
)
from app.schemas.user import UserResponse


class CommunityService:
    def __init__(self, db: Session):
        self.db = db
        self.community_repo = CommunityRepository(db)

    def _member_response(self, membership: CommunityMember) -> CommunityMemberResponse:
        user = self.db.query(User).filter(User.id == membership.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found.")
        return CommunityMemberResponse(
            id=user.id,
            name=user.name,
            username=user.username,
            profile_image=user.profile_image,
            role=membership.role,
            joined_at=membership.joined_at,
        )

    def _response(
        self,
        community: Community,
        current_user: Optional[User] = None,
        include_members: bool = True,
    ) -> CommunityResponse:
        membership = None
        if current_user:
            membership = self.community_repo.get_membership(community.id, current_user.id)

        members = []
        if include_members:
            members = [
                self._member_response(item)
                for item in self.community_repo.list_members(community.id)
            ]

        return CommunityResponse(
            id=community.id,
            name=community.name,
            tagline=community.tagline,
            description=community.description,
            category=community.category,
            location=community.location,
            visibility=community.visibility,
            banner_bg=community.banner_bg,
            anime_mascot=community.anime_mascot,
            activity_status=community.activity_status,
            is_verified=community.is_verified,
            created_by=community.created_by,
            created_at=community.created_at,
            lead_user=UserResponse.model_validate(community.lead_user)
            if community.lead_user
            else None,
            member_count=self.community_repo.count_members(community.id),
            members=members,
            membership=(
                MembershipResponse(
                    is_member=membership is not None,
                    role=membership.role if membership else None,
                )
                if current_user
                else None
            ),
        )

    def list_communities(
        self,
        current_user: Optional[User] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        visibility: Optional[str] = "PUBLIC",
    ) -> List[CommunityResponse]:
        communities = self.community_repo.list_all(
            category=category,
            search=search,
            visibility=visibility,
        )
        return [
            self._response(community, current_user, include_members=False)
            for community in communities
        ]

    def get_community(
        self, community_id: str, current_user: Optional[User] = None
    ) -> CommunityResponse:
        community = self.community_repo.get_by_id(community_id)
        if not community:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Community tribe not found.",
            )

        membership = (
            self.community_repo.get_membership(community.id, current_user.id)
            if current_user
            else None
        )
        if community.visibility == "PRIVATE" and not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This private community is not available to you.",
            )
        return self._response(community, current_user)

    def create_community(
        self, community_data: CommunityCreate, creator: User
    ) -> CommunityResponse:
        community = self.community_repo.create(community_data, creator_id=creator.id)
        return self._response(community, creator)

    def join_community(self, community_id: str, user: User) -> CommunityResponse:
        community = self.community_repo.get_by_id(community_id)
        if not community:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Community tribe not found.",
            )
        if community.visibility != "PUBLIC":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Private communities cannot be joined publicly.",
            )
        if self.community_repo.get_membership(community_id, user.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You are already a member of this community.",
            )
        self.community_repo.add_member(community_id, user.id)
        return self._response(community, user)

    def leave_community(self, community_id: str, user: User) -> CommunityResponse:
        community = self.community_repo.get_by_id(community_id)
        if not community:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Community tribe not found.",
            )
        membership = self.community_repo.get_membership(community_id, user.id)
        if not membership:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You are not a member of this community.",
            )
        if membership.role == "ADMIN" and self.community_repo.count_admins(community_id) <= 1:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="The final admin cannot leave this community.",
            )
        self.community_repo.remove_member(membership)
        return self._response(community, user)

    def list_members(
        self, community_id: str, current_user: Optional[User] = None
    ) -> List[CommunityMemberResponse]:
        community = self.community_repo.get_by_id(community_id)
        if not community:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Community tribe not found.",
            )
        membership = (
            self.community_repo.get_membership(community_id, current_user.id)
            if current_user
            else None
        )
        if community.visibility == "PRIVATE" and not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This private community is not available to you.",
            )
        return [
            self._member_response(item)
            for item in self.community_repo.list_members(community_id)
        ]
