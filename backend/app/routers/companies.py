from typing import List
from app.models.company import Company
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.crud.company import (
    create_company,
    get_all_companies_by_recruiter,
    update_company,
    get_company_by_slug_public,
    get_company_by_recruiter,
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


@router.get(
    "/{company_slug}/careers",
    response_model=schemas.CompanyPublicResponse,
    status_code=status.HTTP_200_OK,
)
def get_company_public_endpoint(
    company_slug: str,
    db: Session = Depends(get_db),
):
    """Fetch company data by slug for public access (career page view)."""
    company = get_company_by_slug_public(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )
    return company


@router.get(
    "/{company_slug}/preview",
    response_model=schemas.CompanyDetailResponse,
    status_code=status.HTTP_200_OK,
)
def get_company_recruiter_endpoint(
    company_slug: str,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Fetch full company data for recruiter (requires authentication)."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    company = get_company_by_recruiter(db, company_slug, recruiter_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found or you do not have access to it",
        )
    return company

@router.get(
    "/all",
    response_model=List[schemas.CompanyBasicResponse],
    status_code=status.HTTP_200_OK,
)
def get_company_recruiter_endpoint(
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
) -> List[schemas.CompanyBasicResponse]:
    """Fetch full company data for recruiter (requires authentication)."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    companies = get_all_companies_by_recruiter(db, recruiter_id)
    return companies
