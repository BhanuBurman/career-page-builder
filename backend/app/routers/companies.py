from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.crud.company import (
    create_company,
    update_company,
)
from app.dependencies import get_db
from app.utils.authentication import verify_token

router = APIRouter()


@router.post(
    "", response_model=schemas.CompanyResponse, status_code=status.HTTP_201_CREATED
)
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


@router.patch(
    "/{company_slug}/edit",
    response_model=schemas.CompanyResponse,
    status_code=status.HTTP_200_OK,
)
def update_company_endpoint(
    company_slug: str,
    payload: schemas.CompanyUpdate,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Update company branding and content using company slug."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    company = update_company(db, company_slug, payload)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    return company
