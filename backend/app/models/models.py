import enum
import secrets
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, DateTime, Boolean, Enum, Text, JSON
)

from app.database import Base


class UserRole(str, enum.Enum):
    admin = "admin"


class QuoteStatus(str, enum.Enum):
    new = "New"
    in_progress = "In Progress"
    completed = "Completed"


class PalletType(str, enum.Enum):
    new = "New"
    used = "Used"
    remanufactured = "Remanufactured"


def generate_quote_request_id() -> str:
    """e.g. QR-7F3A9C21 — short, unique, human-readable-enough to quote over the phone."""
    return f"QR-{secrets.token_hex(4).upper()}"


class User(Base):
    """Admin accounts only. There is no public customer registration —
    quote requests are submitted without an account."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.admin, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    quote_request_id = Column(String(20), unique=True, index=True, default=generate_quote_request_id, nullable=False)

    # Required
    email = Column(String(150), nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone_number = Column(String(30), nullable=False)
    pallet_size = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)

    # Optional
    address = Column(String(200), nullable=True)
    address_line_2 = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True)
    state_province_region = Column(String(100), nullable=True)
    postal_zip_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True, default="USA")
    decking_dimensions = Column(String(100), nullable=True)
    pallet_type = Column(Enum(PalletType), nullable=True)
    method_of_delivery = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)

    # Admin-managed
    status = Column(Enum(QuoteStatus), default=QuoteStatus.new, nullable=False)
    admin_note = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ContentSection(str, enum.Enum):
    """Every editable, list-shaped part of the site. One generic model
    (ContentItem below) covers all of them so the admin panel and API
    don't need nine separate bespoke CRUD systems."""
    service = "service"
    industry = "industry"
    faq = "faq"
    product = "product"
    gallery = "gallery"
    testimonial = "testimonial"
    nav_item = "nav_item"
    footer_link = "footer_link"
    office_location = "office_location"


class ContentItem(Base):
    """A single editable item within a section — a service card, an FAQ
    entry, a gallery photo, a testimonial, a nav link, etc. `extra` holds
    section-specific fields as JSON (e.g. a testimonial's star rating and
    role, or a product's spec code) so one table can flexibly serve every
    section without a rigid schema per content type.

    Fields by section (all optional except title):
      service:      title, body (description), image_url, extra:{icon}
      industry:      title, body (description), image_url
      faq:          title (question), body (answer), extra:{group}
      product:      title, subtitle (spec), body (description)
      gallery:      title (caption), image_url
      testimonial:  title (customer name), subtitle (role), body (quote), extra:{rating}
      nav_item:     title (label), link_url
      footer_link:  title (label), link_url, extra:{column}
      office_location: title (office name), body (address), link_url (Google Maps link),
                        extra:{type: "Head Office"|"Branch Office", phone, email}
    """
    __tablename__ = "content_items"

    id = Column(Integer, primary_key=True, index=True)
    section = Column(Enum(ContentSection), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(300), nullable=True)
    body = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    link_url = Column(String(500), nullable=True)
    extra = Column(JSON, nullable=True)
    order_index = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SiteSetting(Base):
    """Single-instance, key/value editable text — homepage hero copy,
    contact details, that kind of thing. Not list-shaped, so it doesn't
    fit ContentItem; this covers 'Homepage Content' and 'Contact
    Information' from the requirements."""
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
