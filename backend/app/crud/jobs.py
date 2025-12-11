from typing import List, Optional

from sqlalchemy.orm import Session

from app import schemas
from app.models.job import Job


def create_job(db: Session, job_in: schemas.JobCreate, company_id: int) -> Job:
    """Create a new job posting for a company."""
    db_job = Job(
        title=job_in.title,
        location=job_in.location,
        description=job_in.description,
        job_type=job_in.job_type,
        min_salary=job_in.min_salary,
        max_salary=job_in.max_salary,
        currency=job_in.currency,
        company_id=company_id,
        is_active=True,
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


def get_job_by_id(db: Session, job_id: int) -> Optional[Job]:
    """Fetch a job by ID."""
    return db.query(Job).filter(Job.id == job_id).first()


def get_jobs_by_company(
    db: Session,
    company_id: int,
    active_only: bool = False,  # Default to returning all jobs
) -> List[Job]:
    """
    Fetch jobs for a company.
    If active_only is True, filters for active jobs only.
    """
    # 1. Start the base query with specific columns
    query = db.query(
        Job.id,
        Job.title,
        Job.location,
        Job.min_salary,
        Job.max_salary,
        Job.currency,
        Job.job_type,
        Job.created_at,
        Job.is_active,  # Useful to include this so the frontend knows the status
    ).filter(Job.company_id == company_id)

    # 2. Apply the conditional filter
    if active_only:
        query = query.filter(Job.is_active == True)

    return query.all()


def update_job(
    db: Session, job_id: int, company_id: int, job_in: schemas.JobUpdate
) -> Optional[Job]:
    """Update a job posting (only if it belongs to the company)."""
    db_job = (
        db.query(Job).filter(Job.id == job_id, Job.company_id == company_id).first()
    )

    if not db_job:
        return None

    # Apply only provided fields (support PATCH/partial updates).
    # If the incoming schema is JobCreate this will behave like a full update;
    # if it's JobUpdate (with Optional fields) it'll update only non-None attrs.
    if getattr(job_in, "title", None) is not None:
        db_job.title = job_in.title
    if getattr(job_in, "location", None) is not None:
        db_job.location = job_in.location
    if getattr(job_in, "description", None) is not None:
        db_job.description = job_in.description
    if getattr(job_in, "job_type", None) is not None:
        db_job.job_type = job_in.job_type
    if getattr(job_in, "min_salary", None) is not None:
        db_job.min_salary = job_in.min_salary
    if getattr(job_in, "max_salary", None) is not None:
        db_job.max_salary = job_in.max_salary
    if getattr(job_in, "currency", None) is not None:
        db_job.currency = job_in.currency

    db.commit()
    db.refresh(db_job)
    return db_job


def delete_job(db: Session, job_id: int, company_id: int) -> bool:
    """Delete a job posting (only if it belongs to the company)."""
    db_job = (
        db.query(Job).filter(Job.id == job_id, Job.company_id == company_id).first()
    )

    if not db_job:
        return False

    db.delete(db_job)
    db.commit()
    return True


def toggle_job_active(
    db: Session, job_id: int, company_id: int, is_active: bool
) -> Optional[Job]:
    """Toggle job active status (only if it belongs to the company)."""
    db_job = (
        db.query(Job).filter(Job.id == job_id, Job.company_id == company_id).first()
    )

    if not db_job:
        return None

    db_job.is_active = is_active
    db.commit()
    db.refresh(db_job)
    return db_job
