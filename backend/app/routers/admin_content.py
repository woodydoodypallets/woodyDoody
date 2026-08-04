from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, ContentItem, ContentSection, SiteSetting
from app.schemas.schemas import (
    ContentItemCreate, ContentItemUpdate, ContentItemOut,
    SiteSettingOut, SiteSettingsBulkUpdate,
)
from app.core.deps import require_admin

router = APIRouter(prefix="/api/admin/content", tags=["admin-content"])


@router.get("", response_model=List[ContentItemOut])
def list_all_content(
    section: Optional[ContentSection] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Admin — returns items regardless of is_active, so hidden items can
    still be found and re-enabled."""
    query = db.query(ContentItem)
    if section:
        query = query.filter(ContentItem.section == section)
    return query.order_by(ContentItem.section.asc(), ContentItem.order_index.asc(), ContentItem.id.asc()).all()


@router.post("", response_model=ContentItemOut, status_code=201)
def create_content(
    payload: ContentItemCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    item = ContentItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=ContentItemOut)
def update_content(
    item_id: int,
    payload: ContentItemUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    item = db.query(ContentItem).filter(ContentItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_content(
    item_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    item = db.query(ContentItem).filter(ContentItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    db.delete(item)
    db.commit()


# ---------- Site settings (homepage hero copy, contact info, etc.) ----------

@router.get("/settings/all", response_model=List[SiteSettingOut])
def list_settings_admin(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    return db.query(SiteSetting).all()


@router.put("/settings/all", response_model=List[SiteSettingOut])
def update_settings(
    payload: SiteSettingsBulkUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    for key, value in payload.settings.items():
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if setting:
            setting.value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    db.commit()
    return db.query(SiteSetting).all()
