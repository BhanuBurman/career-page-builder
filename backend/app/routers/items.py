from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.dependencies import get_db

router = APIRouter(prefix="/items", tags=["items"])


@router.post("", response_model=schemas.Item, status_code=201)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    """Create a new item for a given owner."""
    return crud.create_item(db, item)


@router.get("", response_model=list[schemas.Item])
def list_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List items with simple pagination."""
    return crud.get_items(db, skip=skip, limit=limit)

