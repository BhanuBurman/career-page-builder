from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, EmailStr
from typing import Optional

# Strict Validation for Branding
class BrandingConfig(BaseModel):
    primary_color: str = Field(default="#000000", pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
    secondary_color: str = Field(default="#ffffff")
    logo_url: Optional[HttpUrl] = None

# Strict Validation for Page Content
class HeroSection(BaseModel):
    title: str = "We are hiring"
    subtitle: str = "Join our team"

class PageContent(BaseModel):
    hero: HeroSection = HeroSection()
    about_text: str = ""

# The Request Model
class CompanyUpdateRequest(BaseModel):
    branding: Optional[BrandingConfig] = None
    content: Optional[PageContent] = None


class CompanyCreate(BaseModel):
    company_name: str = Field(..., min_length=2, example="White Carrot")
    branding: Optional[BrandingConfig] = None
    content: Optional[PageContent] = None


class CompanyResponse(BaseModel):
    id: int
    slug: str
    company_name: str
    recruiter_id: str
    branding_config: dict
    page_content: dict
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }