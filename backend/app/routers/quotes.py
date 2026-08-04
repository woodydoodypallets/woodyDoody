from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Quote
from app.schemas.schemas import QuoteCreate, QuoteOut

router = APIRouter(prefix="/api/quotes", tags=["quotes"])


@router.post("", response_model=QuoteOut, status_code=201)
def submit_quote(payload: QuoteCreate, db: Session = Depends(get_db)):
    """Public endpoint — anyone can request a quote, no account needed.
    Returns the created quote including its quote_request_id, which the
    customer can reference in follow-up correspondence."""
    quote = Quote(**payload.model_dump())
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote
