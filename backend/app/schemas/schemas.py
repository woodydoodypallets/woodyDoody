from datetime import datetime
from typing import Optional, Any, Dict

from pydantic import BaseModel, EmailStr, Field

from app.models.models import UserRole, QuoteStatus, PalletType, ContentSection


# ---------- Admin auth ----------

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# ---------- Quotes (public submission, admin-managed afterward) ----------

class QuoteCreate(BaseModel):
    # Required
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone_number: str = Field(min_length=1, max_length=30)
    pallet_size: str = Field(min_length=1, max_length=100)
    quantity: int = Field(gt=0)

    # Optional
    address: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state_province_region: Optional[str] = None
    postal_zip_code: Optional[str] = None
    country: Optional[str] = "USA"
    decking_dimensions: Optional[str] = None
    pallet_type: Optional[PalletType] = None
    method_of_delivery: Optional[str] = None
    message: Optional[str] = None


class QuoteOut(BaseModel):
    id: int
    quote_request_id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str
    pallet_size: str
    quantity: int
    address: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state_province_region: Optional[str] = None
    postal_zip_code: Optional[str] = None
    country: Optional[str] = None
    decking_dimensions: Optional[str] = None
    pallet_type: Optional[PalletType] = None
    method_of_delivery: Optional[str] = None
    message: Optional[str] = None
    status: QuoteStatus
    admin_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuoteStatusUpdate(BaseModel):
    status: Optional[QuoteStatus] = None
    admin_note: Optional[str] = None


class AdminStats(BaseModel):
    total_quotes: int
    new_quotes: int
    in_progress_quotes: int
    completed_quotes: int


# ---------- Configurable content (CMS) ----------

class ContentItemCreate(BaseModel):
    section: ContentSection
    title: str = Field(min_length=1, max_length=200)
    subtitle: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None
    order_index: int = 0
    is_active: bool = True


class ContentItemUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class ContentItemOut(BaseModel):
    id: int
    section: ContentSection
    title: str
    subtitle: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None
    order_index: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SiteSettingOut(BaseModel):
    key: str
    value: Optional[str] = None

    class Config:
        from_attributes = True


class SiteSettingsBulkUpdate(BaseModel):
    settings: Dict[str, str]
