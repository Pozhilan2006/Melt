from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.activity_service import ActivityService
from app.schemas.activity import ActivityCreate, ActivityResponse

router = APIRouter(prefix="/activities", tags=["Activities"])


@router.get("", response_model=List[ActivityResponse], summary="List real-world activities")
def list_activities(
    category: Optional[str] = Query(None, description="Filter by interest category"),
    status: Optional[str] = Query(None, description="Filter by status (OPEN, FULL, UPCOMING, LIVE_NOW)"),
    db: Session = Depends(get_db)
):
    """Retrieve list of real-world activities."""
    service = ActivityService(db)
    return service.list_activities(category=category, status=status)


@router.get("/{activity_id}", response_model=ActivityResponse, summary="Get activity details by ID")
def get_activity(activity_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed activity overview and participant roster."""
    service = ActivityService(db)
    return service.get_activity(activity_id)


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED, summary="Create a new activity")
def create_activity(
    activity_data: ActivityCreate,
    organizer_id: Optional[str] = Query(None, description="Optional organizer user ID"),
    db: Session = Depends(get_db)
):
    """Host a new real-world activity."""
    service = ActivityService(db)
    return service.create_activity(activity_data, organizer_id=organizer_id)
