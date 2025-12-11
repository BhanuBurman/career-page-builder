from sqlalchemy import Column, DateTime, Integer, String, Boolean, ForeignKey, Enum as SqEnum, Text, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB  # Specific import for Postgres JSONB
import enum
from app.database import Base

class JobType(str, enum.Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True) # Indexed for search
    location = Column(String, nullable=False)
    
    description = Column(Text, nullable=False)
    min_salary = Column(Integer, nullable=True)  # e.g. 50000
    max_salary = Column(Integer, nullable=True)  # e.g. 80000
    currency = Column(String, default="USD", nullable=False)

    job_type = Column(SqEnum(JobType), default=JobType.FULL_TIME)
    is_active = Column(Boolean, default=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company", back_populates="jobs")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )