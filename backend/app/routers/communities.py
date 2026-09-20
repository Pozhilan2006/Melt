from typing import List, Optional, Literal

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, get_optional_user
from app.models.user import User
from app.schemas.community import (
    CommunityCreate,
    CommunityMemberResponse,
    CommunityResponse,
)
from app.services.community_service import CommunityService

router = APIRouter(prefix="/communities", tags=["Communities"])


@router.get("", response_model=List[CommunityResponse], summary="List community tribes")
def list_communities(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, max_length=120),
    visibility: Optional[Literal["PUBLIC", "PRIVATE"]] = Query("PUBLIC"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    return CommunityService(db).list_communities(
        current_user=current_user,
        category=category,
        search=search,
        visibility=visibility,
    )


@router.get("/{community_id}", response_model=CommunityResponse, summary="Get community tribe by ID")
def get_community(
    community_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    return CommunityService(db).get_community(community_id, current_user)


@router.post("", response_model=CommunityResponse, status_code=status.HTTP_201_CREATED, summary="Create a new community tribe")
def create_community(
    community_data: CommunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CommunityService(db).create_community(community_data, current_user)


@router.post("/{community_id}/join", response_model=CommunityResponse, summary="Join a public community")
def join_community(
    community_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CommunityService(db).join_community(community_id, current_user)


@router.delete("/{community_id}/leave", response_model=CommunityResponse, summary="Leave a community")
def leave_community(
    community_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CommunityService(db).leave_community(community_id, current_user)


@router.get("/{community_id}/members", response_model=List[CommunityMemberResponse], summary="List community members")
def list_members(
    community_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    return CommunityService(db).list_members(community_id, current_user)
