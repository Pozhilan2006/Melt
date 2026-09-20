from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.activity import Activity, ActivityParticipant
from app.schemas.activity import ActivityCreate


class ActivityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, activity_id: str) -> Optional[Activity]:
        return self.db.query(Activity).filter(Activity.id == activity_id).first()

    def list_all(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 30
    ) -> List[Activity]:
        query = self.db.query(Activity)
        if category and category != "ALL":
            query = query.filter(Activity.category == category)
        if status and status != "ALL":
            query = query.filter(Activity.status == status)
        return query.order_by(Activity.start_time.asc()).limit(limit).all()

    def create(self, activity_data: ActivityCreate, organizer_id: Optional[str] = None) -> Activity:
        db_activity = Activity(
            title=activity_data.title,
            description=activity_data.description,
            category=activity_data.category,
            community_id=activity_data.community_id,
            organizer_id=organizer_id,
            venue_name=activity_data.venue_name,
            area=activity_data.area,
            city=activity_data.city,
            distance_km=activity_data.distance_km,
            lat=activity_data.lat or 17.535,
            lng=activity_data.lng or 78.484,
            start_time=activity_data.start_time,
            end_time=activity_data.end_time,
            capacity=activity_data.capacity,
            entry_fee=activity_data.entry_fee or "Free",
            banner_bg=activity_data.banner_bg or "bg-neo-yellow",
            anime_sticker=activity_data.anime_sticker or "⚽⚡",
            status="OPEN"
        )
        self.db.add(db_activity)
        self.db.commit()
        self.db.refresh(db_activity)

        # Automatically add organizer as participant if provided
        if organizer_id:
            participant = ActivityParticipant(
                activity_id=db_activity.id,
                user_id=organizer_id,
                status="JOINED"
            )
            self.db.add(participant)
            self.db.commit()

        return db_activity
