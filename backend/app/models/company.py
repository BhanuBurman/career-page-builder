from logging import NullHandler
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB  # Specific import for Postgres JSONB
from sqlalchemy.orm import relationship
from app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)

    recruiter_id = Column(String, nullable=False)
    
    # The 'slug' is your tenant identifier (e.g., 'google'). 
    # Indexing it is crucial because 100% of public traffic queries by this field.
    slug = Column(String, unique=True, index=True, nullable=False)
    

    # Why JSONB? 
    # Branding allows us to store arbitrary CSS variables (colors, fonts)
    # without schema migrations.
    # Default: { "primary_color": "#000000", "logo_url": "..." }
    branding_config = Column(JSONB, default=dict)

    # Page content stores the order and text of the sections.
    # Default: { "hero": { "title": "Join Us", "image": "..." }, "about": "..." }
    page_content = Column(JSONB, default=dict)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationship to Jobs
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")
