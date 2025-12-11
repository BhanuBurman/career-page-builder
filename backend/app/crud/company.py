import re
from typing import Optional

from sqlalchemy.orm import Session

from app import schemas
from app.models.company import Company


def _slugify(name: str) -> str:
    """Convert a company name into a URL-friendly slug."""
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "company"


def _generate_unique_slug(db: Session, base_slug: str) -> str:
    """
    Generate a unique slug by appending an incrementing suffix when needed.

    Example: white-carrot -> white-carrot-1 -> white-carrot-2
    """
    slug = base_slug
    suffix = 1

    while db.query(Company).filter(Company.slug == slug).first():
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    return slug


def get_company_by_slug(db: Session, slug: str) -> Optional[Company]:
    return db.query(Company).filter(Company.slug == slug).first()


def create_company(
    db: Session, company_in: schemas.CompanyCreate, recruiter_id: str
) -> Company:
    base_slug = _slugify(company_in.company_name)
    slug = _generate_unique_slug(db, base_slug)

    db_company = Company(
        company_name=company_in.company_name,
        slug=slug,
        recruiter_id=recruiter_id,
        branding_config=(
            company_in.branding.model_dump(mode="json") if company_in.branding else {}
        ),
        page_content=(
            company_in.content.model_dump(mode="json") if company_in.content else {}
        ),
    )

    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


def update_company(
    db: Session, slug: str, company_in: schemas.CompanyUpdate
) -> Optional[Company]:
    
    db_company = db.query(Company).filter(Company.slug == slug).first()

    if not db_company:
        return None

    # FIX: Check the Pydantic object directly, not a dumped dict
    if company_in.branding:
        # Now we dump only the sub-model
        db_company.branding_config = company_in.branding.model_dump(mode="json")

    if company_in.content:
        db_company.page_content = company_in.content.model_dump(mode="json")

    db.commit()
    db.refresh(db_company)
    return db_company
