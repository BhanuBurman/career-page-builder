from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Literal

# --- Sub-Models ---


class BrandingConfig(BaseModel):
    primary_color: str = Field(
        default="#000000", pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    )
    secondary_color: str = Field(default="#ffffff")
    logo_url: Optional[str] = (
        None  # Changed to str to be more forgiving with inputs, or keep HttpUrl if strict
    )


class HeaderSection(BaseModel):
    title: str = "We are hiring"
    subtitle: str = "Join our team to build the future."


class AboutSubSection(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    # alignment determines if text is on the left or right
    alignment: Literal["left", "right"] = "left"


class PageContent(BaseModel):
    header: HeaderSection = HeaderSection()
    # Now a list of sections instead of a single text block
    about_sections: List[AboutSubSection] = Field(default_factory=list)


# --- Request Models ---


class CompanyCreate(BaseModel):
    company_name: str = Field(..., min_length=2)
    branding: Optional[BrandingConfig] = None
    page_content: Optional[PageContent] = None  # ← CHANGE: "content" to "page_content"


class CompanyUpdate(BaseModel):
    branding: Optional[BrandingConfig] = None
    page_content: Optional[PageContent] = None  # ← CHANGE: "content" to "page_content"


# --- Response Models ---


class CompanyResponse(BaseModel):
    id: int
    slug: str
    company_name: str
    recruiter_id: str
    branding_config: BrandingConfig
    page_content: PageContent
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CompanyPublicResponse(BaseModel):
    """Public-facing response (stripped sensitive data)."""

    id: int
    slug: str
    company_name: str
    branding_config: BrandingConfig
    page_content: PageContent
    created_at: datetime

    model_config = {"from_attributes": True}


class CompanyDetailResponse(BaseModel):
    """Full detail for the recruiter editor."""

    id: int
    slug: str
    company_name: str
    recruiter_id: str
    branding_config: BrandingConfig
    page_content: PageContent
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CompanyBasicResponse(BaseModel):
    """List view response."""

    id: int
    slug: str
    company_name: str
    recruiter_id: str
    branding_config: BrandingConfig
    created_at: datetime

    model_config = {"from_attributes": True}
