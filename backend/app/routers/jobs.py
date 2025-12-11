from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas
from app.crud.jobs import (
    create_job,
    get_job_by_id,
    get_jobs_by_company,
    update_job,
    delete_job,
    toggle_job_active,
)
from app.crud.company import get_company_by_slug
from app.dependencies import get_db
from app.utils.authentication import verify_token

router = APIRouter()


@router.post(
    "/{company_slug}/jobs",
    response_model=schemas.JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job_endpoint(
    company_slug: str,
    payload: schemas.JobCreate,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Create a new job posting for a company (recruiter only)."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    # Verify company exists and belongs to recruiter
    company = get_company_by_slug(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if company.recruiter_id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create jobs for this company",
        )

    job = create_job(db, payload, company_id=company.id)
    return job


@router.get(
    "/{company_slug}/jobs",
    response_model=List[schemas.JobSummaryResponse],
    status_code=status.HTTP_200_OK,
)
def get_jobs_public_endpoint(
    company_slug: str,
    db: Session = Depends(get_db),
):
    """Fetch all active jobs for a company (public view, no auth required)."""
    company = get_company_by_slug(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    jobs = get_jobs_by_company(db, company.id, active_only=False)
    return jobs


@router.get(
    "/{company_slug}/jobs/{job_id}",
    response_model=schemas.JobResponse,
    status_code=status.HTTP_200_OK,
)
def get_job_detail_endpoint(
    company_slug: str,
    job_id: int,
    db: Session = Depends(get_db),
):
    """Fetch detailed job information by job ID (public view, no auth required)."""
    company = get_company_by_slug(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    job = get_job_by_id(db, job_id)
    if not job or job.company_id != company.id or not job.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    return job


@router.patch(
    "/{company_slug}/jobs/{job_id}",
    response_model=schemas.JobResponse,
    status_code=status.HTTP_200_OK,
)
def update_job_endpoint(
    company_slug: str,
    job_id: int,
    payload: schemas.JobUpdate,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Update a job posting (recruiter only)."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    # Verify company exists and belongs to recruiter
    company = get_company_by_slug(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if company.recruiter_id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update jobs for this company",
        )

    job = update_job(db, job_id, company.id, payload)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this company",
        )

    return job


@router.delete(
    "/{company_slug}/jobs/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job_endpoint(
    company_slug: str,
    job_id: int,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Delete a job posting (recruiter only)."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    # Verify company exists and belongs to recruiter
    company = get_company_by_slug(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if company.recruiter_id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete jobs for this company",
        )

    success = delete_job(db, job_id, company.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this company",
        )


@router.patch(
    "/{company_slug}/jobs/{job_id}/toggle",
    response_model=schemas.JobResponse,
    status_code=status.HTTP_200_OK,
)
def toggle_job_status_endpoint(
    company_slug: str,
    job_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    token_payload=Depends(verify_token),
):
    """Toggle job active/inactive status (recruiter only)."""
    recruiter_id = token_payload.get("sub")
    if not recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user id in token",
        )

    # Verify company exists and belongs to recruiter
    company = get_company_by_slug(db, company_slug)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if company.recruiter_id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to toggle jobs for this company",
        )

    job = toggle_job_active(db, job_id, company.id, is_active)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this company",
        )

    return job
