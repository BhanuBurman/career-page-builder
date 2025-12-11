from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.dependencies import get_db
from app.external_services.email import send_welcome_email

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=schemas.User, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user (demo: hashes password, sends welcome notification)."""
    existing = crud.get_user_by_email(db, email=user.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    created_user = crud.create_user(db, user)
    send_welcome_email(created_user.email, created_user.full_name)
    return created_user


@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """Fetch a user by id."""
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return db_user

