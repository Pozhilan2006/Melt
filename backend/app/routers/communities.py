from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.community_service import CommunityService
from app.schemas.community import CommunityCreate, CommunityResponse

router = APIRouter(prefix="/communities", tags=["Communities"])


@router.get("", response_model=List[CommunityResponse], summary="List community tribes")
def list_communities(
    category: Optional[str] = Query(None, description="Filter by interest category"),
    db: Session = Depends(get_db)
):
    """Retrieve list of community tribes."""
    service = CommunityService(db)
    return service.list_communities(category=category)


@router.get("/{community_id}", response_model=CommunityResponse, summary="Get community tribe by ID")
def get_community(community_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed community tribe overview."""
    service = CommunityService(db)
    return service.get_community(community_id)


@router.post("", response_model=CommunityResponse, status_code=status.HTTP_201_CREATED, summary="Create a new community tribe")
def create_community(
    community_data: CommunityCreate,
    creator_id: Optional[str] = Query(None, description="Optional creator user ID"),
    db: Session = Depends(get_db)
):
    """Launch a new community tribe."""
    service = CommunityService(db)
    return service.create_community(community_data, creator_id=creator_id)
