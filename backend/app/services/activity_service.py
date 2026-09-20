from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.activity_repository import ActivityRepository
from app.schemas.activity import ActivityCreate, ActivityResponse


class ActivityService:
    def __init__(self, db: Session):
        self.activity_repo = ActivityRepository(db)

    def list_activities(
        self, category: Optional[str] = None, status: Optional[str] = None
    ) -> List[ActivityResponse]:
        activities = self.activity_repo.list_all(category=category, status=status)
        return [ActivityResponse.model_validate(a) for a in activities]

    def get_activity(self, activity_id: str) -> ActivityResponse:
        act = self.activity_repo.get_by_id(activity_id)
        if not act:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found."
            )
        return ActivityResponse.model_validate(act)

    def create_activity(
        self, activity_data: ActivityCreate, organizer_id: Optional[str] = None
    ) -> ActivityResponse:
        act = self.activity_repo.create(activity_data, organizer_id=organizer_id)
        return ActivityResponse.model_validate(act)
