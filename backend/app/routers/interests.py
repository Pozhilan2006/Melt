from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.interest import Interest
from app.schemas.interest import InterestResponse

router = APIRouter(prefix="/interests", tags=["Interests"])


@router.get("", response_model=List[InterestResponse], summary="List available interests")
def list_interests(db: Session = Depends(get_db)):
    """Return all available interest categories."""
    interests = db.query(Interest).all()
    if not interests:
        # Provide default initial interests if DB table is freshly created
        default_interests = [
            Interest(id="1", name="Football", category="Sports", emoji="⚽", badge_bg="bg-neo-yellow"),
            Interest(id="2", name="Gaming & Esports", category="Gaming", emoji="🎮", badge_bg="bg-neo-purple"),
            Interest(id="3", name="Anime & Manga", category="Anime & Pop Culture", emoji="⛩️", badge_bg="bg-neo-pink"),
            Interest(id="4", name="Trekking & Trails", category="Outdoors", emoji="⛰️", badge_bg="bg-neo-green"),
            Interest(id="5", name="Coding & Dev", category="Tech", emoji="💻", badge_bg="bg-neo-cyan"),
            Interest(id="6", name="Jamming & Music", category="Creative", emoji="🎸", badge_bg="bg-neo-orange"),
            Interest(id="7", name="Chai & Conversations", category="Social", emoji="☕", badge_bg="bg-amber-300"),
            Interest(id="8", name="Running & Sprinting", category="Sports", emoji="🏃", badge_bg="bg-neo-yellow"),
            Interest(id="9", name="Badminton", category="Sports", emoji="🏸", badge_bg="bg-neo-pink"),
            Interest(id="10", name="Photography & Walks", category="Creative", emoji="📸", badge_bg="bg-neo-cyan"),
        ]
        for inst in default_interests:
            db.add(inst)
        db.commit()
        interests = db.query(Interest).all()
    return interests
