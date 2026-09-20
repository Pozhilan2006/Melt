from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.user_service import UserService
from app.schemas.user import RegisterRequest, LoginRequest, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Create a new user account.

    - Auto-generates a unique username from the display name.
    - Returns a JWT access token immediately so the user is logged in after sign-up.
    - Password is bcrypt-hashed; never stored or returned in plaintext.
    """
    service = UserService(db)
    return service.register_user(data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in with email and password",
)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate with email + password.

    - Returns a JWT access token on success.
    - Returns HTTP 401 with a generic message on failure (anti-enumeration).
    """
    service = UserService(db)
    return service.authenticate_user(data)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user",
)
def get_me(current_user=Depends(get_current_user)):
    """
    Return the profile of the currently authenticated user.
    Requires a valid JWT in the Authorization header.
    """
    return UserResponse.model_validate(current_user)
