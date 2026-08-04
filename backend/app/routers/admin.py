from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Quote, QuoteStatus
from app.schemas.schemas import QuoteOut, QuoteStatusUpdate, AdminStats
from app.core.deps import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
def get_stats(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    total = db.query(Quote).count()
    new = db.query(Quote).filter(Quote.status == QuoteStatus.new).count()
    in_progress = db.query(Quote).filter(Quote.status == QuoteStatus.in_progress).count()
    completed = db.query(Quote).filter(Quote.status == QuoteStatus.completed).count()
    return AdminStats(
        total_quotes=total,
        new_quotes=new,
        in_progress_quotes=in_progress,
        completed_quotes=completed,
    )


@router.get("/quotes", response_model=List[QuoteOut])
def list_quotes(
    status_filter: Optional[QuoteStatus] = Query(None, alias="status"),
    search: Optional[str] = Query(None, description="Search by name, email, phone, or quote request ID"),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = db.query(Quote)
    if status_filter:
        query = query.filter(Quote.status == status_filter)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (Quote.first_name.ilike(like))
            | (Quote.last_name.ilike(like))
            | (Quote.email.ilike(like))
            | (Quote.phone_number.ilike(like))
            | (Quote.quote_request_id.ilike(like))
        )
    return query.order_by(Quote.created_at.desc()).all()


@router.get("/quotes/{quote_id}", response_model=QuoteOut)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


@router.patch("/quotes/{quote_id}", response_model=QuoteOut)
def update_quote(
    quote_id: int,
    payload: QuoteStatusUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if payload.status is not None:
        quote.status = payload.status
    if payload.admin_note is not None:
        quote.admin_note = payload.admin_note
    db.commit()
    db.refresh(quote)
    return quote


@router.delete("/quotes/{quote_id}", status_code=204)
def delete_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    db.delete(quote)
    db.commit()
