from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdate, InterestUpdate
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get my profile",
)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's full profile."""
    return UserResponse.model_validate(current_user)


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update my profile",
)
def update_my_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Partially update the authenticated user's profile.
    Only name, bio, profile_image, location_name, lat, lng can be changed here.
    """
    service = UserService(db)
    return service.update_profile(current_user, data)


@router.put(
    "/me/interests",
    response_model=UserResponse,
    summary="Replace my interests",
)
def update_my_interests(
    data: InterestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Replace the authenticated user's interests with the given list of interest IDs.
    Existing selections are cleared and replaced atomically.
    """
    service = UserService(db)
    return service.update_interests(current_user, data)


@router.post(
    "/me/onboarding",
    response_model=UserResponse,
    summary="Complete onboarding",
)
def complete_onboarding(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Mark the user's onboarding as complete.
    Sets is_onboarded = True. Called at the final step of the onboarding wizard.
    """
    service = UserService(db)
    return service.complete_onboarding(current_user)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get public user profile by ID",
)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Fetch a public user profile by ID. No authentication required."""
    service = UserService(db)
    return service.get_user_profile(user_id)
