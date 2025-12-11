from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.crud.company import (
    create_company,
)
from app.dependencies import get_db
from app.utils.authentication import verify_token

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("", response_model=schemas.CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company_endpoint(
    payload: schemas.CompanyCreate,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Create a company with automatic, unique slug generation."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    company = create_company(db, payload, recruiter_id=recruiter_id)
    return company

