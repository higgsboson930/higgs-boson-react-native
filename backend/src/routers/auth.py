from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import auth as auth_schemas
from ..services import auth as auth_service

router = APIRouter()

@router.post("/register", response_model=auth_schemas.UserResponse)
async def register(
    user_data: auth_schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        user = await auth_service.create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=auth_schemas.LoginResponse)
async def login(
    credentials: auth_schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user"""
    try:
        result = await auth_service.authenticate_user(db, credentials)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

@router.post("/logout")
async def logout():
    """Logout user"""
    return {"message": "Successfully logged out"}

@router.post("/refresh", response_model=auth_schemas.TokenResponse)
async def refresh_token(
    refresh_data: auth_schemas.RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Refresh access token"""
    try:
        result = await auth_service.refresh_access_token(db, refresh_data.refresh_token)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

@router.get("/me", response_model=auth_schemas.UserResponse)
async def get_current_user(
    current_user = Depends(auth_service.get_current_user)
):
    """Get current user profile"""
    return current_user

@router.put("/profile", response_model=auth_schemas.UserResponse)
async def update_profile(
    profile_data: auth_schemas.UserUpdate,
    current_user = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        updated_user = await auth_service.update_user_profile(db, current_user.id, profile_data)
        return updated_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )