from datetime import datetime
from pydantic import BaseModel, Field, model_validator
from typing import Optional
from enum import Enum

# Re-use the Enum to ensure API inputs match DB expectations
class JobType(str, Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"

# 1. Base Schema (Shared properties)
class JobBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100, example="Senior React Developer")
    location: str = Field(..., min_length=2, example="Remote")
    description: str = Field(..., min_length=10)
    job_type: JobType = JobType.FULL_TIME
    
    # Salary is optional, but if provided, must be positive
    min_salary: Optional[int] = Field(None, ge=0, example=50000)
    max_salary: Optional[int] = Field(None, ge=0, example=80000)
    currency: str = Field("USD", min_length=3, max_length=3, pattern="^[A-Z]{3}$")

# 2. Create Schema (Input Validation)
class JobCreate(JobBase):
    
    # ✅ LOGIC CHECK: Max salary cannot be less than Min salary
    @model_validator(mode='after')
    def check_salary_range(self):
        min_s = self.min_salary
        max_s = self.max_salary

        if min_s is not None and max_s is not None:
            if max_s < min_s:
                raise ValueError('max_salary must be greater than or equal to min_salary')
        
        return self

# 3. Response Schema (Output to Frontend)
class JobResponse(JobBase):
    id: int
    company_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # specific to Pydantic v2 (was orm_mode = True in v1)