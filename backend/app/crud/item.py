from sqlalchemy.orm import Session

from app import schemas
from app.models.item import Item


def create_item(db: Session, item: schemas.item.ItemCreate) -> Item:
    db_item = Item(
        title=item.title,
        description=item.description,
        owner_id=item.owner_id,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip: int = 0, limit: int = 100) -> list[Item]:
    return (
        db.query(Item)
        .order_by(Item.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

