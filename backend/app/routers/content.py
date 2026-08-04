from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import ContentItem, ContentSection, SiteSetting, Quote
from app.schemas.schemas import ContentItemOut, SiteSettingOut

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("", response_model=List[ContentItemOut])
def list_content(
    section: ContentSection = Query(..., description="Which content section to fetch"),
    db: Session = Depends(get_db),
):
    """Public — returns only active items for a section, in display order.
    This is what the live site's pages fetch to render Services, Industries,
    FAQ, Products, Gallery, Testimonials, Nav, and Footer content."""
    return (
        db.query(ContentItem)
        .filter(ContentItem.section == section, ContentItem.is_active == True)  # noqa: E712
        .order_by(ContentItem.order_index.asc(), ContentItem.id.asc())
        .all()
    )


@router.get("/settings", response_model=List[SiteSettingOut])
def list_settings(db: Session = Depends(get_db)):
    """Public — all site settings (homepage hero copy, contact info, etc.)
    as a flat list of key/value pairs."""
    return db.query(SiteSetting).all()


@router.get("/stats")
def public_stats(db: Session = Depends(get_db)):
    """Public — genuine, real numbers only. This company is newly launched,
    so the homepage does not display fabricated 'years in business' or
    'clients served' figures. Instead it shows the actual count of quote
    requests received to date, which grows as real business comes in."""
    quote_count = db.query(Quote).count()
    return {"quote_count": quote_count}
