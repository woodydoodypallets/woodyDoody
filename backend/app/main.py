import os
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.database import Base, engine, SessionLocal
from app.models.models import User, UserRole, ContentItem, ContentSection, SiteSetting
from app.core.security import hash_password
from app.routers import auth, quotes, admin, content, admin_content

# Create the FastAPI app and register middleware/routers immediately, before
# touching the database at all. This matters for deployment platforms like
# Railway where services can start in any order — the API process should be
# able to come up and (once startup finishes) serve requests even if
# Postgres took a few extra seconds to accept connections.
app = FastAPI(title="Woody Doody Pallets API", version="1.0.0")

# CORS origins must match the browser's Origin header EXACTLY (scheme +
# host + port, no trailing slash). A stray trailing slash or space after a
# comma in the CORS_ORIGINS env var causes a silent mismatch — the request
# just fails with a generic "Failed to fetch" in the browser, no useful
# error anywhere. Strip both defensively so a slightly-off env var value
# (very easy to introduce when copy-pasting a Railway domain) still works.
origins = [o.strip().rstrip("/") for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print(f"[startup] CORS allow_origins = {origins}")

app.include_router(auth.router)
app.include_router(quotes.router)
app.include_router(admin.router)
app.include_router(content.router)
app.include_router(admin_content.router)


@app.on_event("startup")
def init_database_with_retry():
    """Create tables, retrying with backoff instead of crashing the whole
    process if Postgres isn't accepting connections yet (common on first
    deploy when services start roughly in parallel). Previously this was a
    single unretried call at module import time — any transient connection
    failure crashed the process before uvicorn even bound to a port."""
    max_attempts = int(os.getenv("DB_INIT_MAX_ATTEMPTS", "30"))
    delay_seconds = float(os.getenv("DB_INIT_RETRY_DELAY", "2"))
    for attempt in range(1, max_attempts + 1):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except OperationalError as exc:
            if attempt == max_attempts:
                raise
            print(f"[startup] Database not ready (attempt {attempt}/{max_attempts}): {exc}. Retrying in {delay_seconds}s...")
            time.sleep(delay_seconds)


@app.on_event("startup")
def seed_admin():
    """Ensure the admin account matches ADMIN_EMAIL / ADMIN_PASSWORD on every
    startup — not just create-once. If those env vars change (e.g. updated
    on Railway after an earlier deploy already created the account), the
    existing user's password and role are synced to match rather than
    silently left stale. Without this, changing ADMIN_PASSWORD and
    redeploying would have no effect once an admin row already existed."""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        return
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == admin_email).first()
        if not existing:
            db.add(User(
                full_name="Site Administrator",
                email=admin_email,
                hashed_password=hash_password(admin_password),
                role=UserRole.admin,
            ))
            db.commit()
        else:
            existing.hashed_password = hash_password(admin_password)
            existing.role = UserRole.admin
            existing.is_active = True
            db.commit()
        print(f"[startup] Admin account synced: {admin_email}")
    finally:
        db.close()


@app.on_event("startup")
def seed_content():
    """Populate the CMS tables with the site's current content on first
    boot only (skipped if content already exists, so admin edits are
    never overwritten on restart)."""
    db = SessionLocal()
    try:
        if db.query(ContentItem).count() > 0:
            return

        items = []

        # Products — matches client-provided mockup wording and photography
        products = [
            ("New Pallets", "Standard & Custom Sizes", "Built from new lumber to meet your load and size requirements.", "/images/product-new.jpg"),
            ("Recycled Pallets", "Multiple Grades Available", "Inspected and repaired for dependable, cost-effective reuse.", "/images/product-recycled.jpg"),
            ("Custom Pallets", "Built to Your Specifications", "Designed around your dimensions, weight, quantity, and handling needs.", "/images/product-custom.jpg"),
            ("Export-Ready Pallets", "International Shipping Options", "Prepared to meet applicable shipping and destination requirements.", "/images/product-export.jpg"),
            ("Heat-Treated Pallets", "Stamped Options Available", "Heat-treated pallet options for customers who require compliant international shipping materials.", "/images/product-heat-treated.jpg"),
        ]
        for i, (title, spec, desc, image) in enumerate(products):
            items.append(ContentItem(section=ContentSection.product, title=title, subtitle=spec, body=desc, image_url=image, order_index=i))

        # Services — matches client-provided mockup wording and photography exactly
        services = [
            ("Local Delivery", "Dependable pallet delivery throughout Dallas–Fort Worth and surrounding areas. Tell us your quantity, location, and preferred delivery date, and we'll confirm availability and timing.", "/images/service-local-delivery.jpg"),
            ("New & Recycled Pallets", "Choose from new or recycled pallet options based on your load requirements, budget, and intended use.", "/images/service-new-recycled.jpg"),
            ("Custom Pallet Solutions", "Need a specific size or construction? Share your dimensions, load weight, quantity, and handling requirements so we can recommend an appropriate pallet solution.", "/images/service-custom-solutions.jpg"),
            ("Heat-Treated Options", "Heat-treated and stamped pallet options are available for customers shipping internationally, subject to availability and applicable requirements.", "/images/service-heat-treated.jpg"),
            ("Pallet Pickup & Recycling", "We can discuss pickup, removal, or recycling options for unwanted pallets based on pallet condition, quantity, and location.", "/images/service-pickup-recycling.jpg"),
            ("Recurring Supply", "For businesses that order pallets regularly, we can help coordinate repeat orders and scheduled deliveries to support ongoing operations.", "/images/service-recurring-supply.jpg"),
        ]
        for i, (title, desc, image) in enumerate(services):
            items.append(ContentItem(section=ContentSection.service, title=title, body=desc, image_url=image, order_index=i))

        # Industries
        industries = [
            ("Automotive", "Heavy-duty pallets built for engine, parts, and assembly-line loads."),
            ("Retail", "Consistent, stackable pallets sized for cross-dock speed and store-ready shipments."),
            ("Manufacturing", "Custom-built pallets matched to your line's exact load and footprint."),
            ("Warehousing & distribution", "Reliable pallet supply to keep your storage and fulfillment operations moving."),
            ("Agriculture", "Rugged, weather-tolerant pallets for seasonal volume and outdoor storage."),
            ("Construction & materials", "Load-rated pallets built to handle heavy and bulky materials safely."),
            ("Furniture", "Oversized and reinforced options for bulky, high-value freight."),
            ("Food & beverage", "Sanitary-conscious pallet options for local food and beverage distributors."),
        ]
        for i, (title, desc) in enumerate(industries):
            items.append(ContentItem(section=ContentSection.industry, title=title, body=desc, order_index=i))

        # FAQ — honest, DFW-local, no fabricated certifications or history
        faqs = [
            ("Pallets & products", "What pallet sizes do you carry?", "We carry standard pallet sizes in stock, plus custom sizing available on request."),
            ("Pallets & products", "What's the difference between new and recycled pallets?", "New pallets are built from fresh lumber to your size and load requirements. Recycled pallets are inspected and repaired for dependable, cost-effective reuse."),
            ("Pallets & products", "Do you offer heat-treated pallets for export?", "Yes — heat-treated pallet options are available for customers who require compliant international shipping materials, subject to availability and applicable requirements."),
            ("Ordering & delivery", "How does the quote process work?", "Send us the details on quantity, condition, or delivery location, and requested date. We'll confirm availability and provide clear pricing and an estimated delivery timeline."),
            ("Ordering & delivery", "Do you deliver locally?", "Yes — we provide dependable pallet delivery throughout Dallas–Fort Worth and surrounding areas."),
            ("Ordering & delivery", "Do you offer recurring deliveries?", "Yes — for businesses that order pallets regularly, we can help coordinate repeat orders and scheduled deliveries."),
            ("Programs & account", "Can you pick up unwanted pallets?", "Yes — we can discuss pickup, removal, or recycling options for unwanted pallets based on condition, quantity, and location."),
            ("Programs & account", "Do I need an account to request a quote?", "No — quote requests can be submitted without creating an account."),
        ]
        for i, (group, q, a) in enumerate(faqs):
            items.append(ContentItem(section=ContentSection.faq, title=q, body=a, extra={"group": group}, order_index=i))

        # Testimonials — intentionally none. This is a newly launched business;
        # fabricated customer quotes would be dishonest. Real testimonials can
        # be added here through the admin panel as they come in.

        # Gallery
        gallery = [
            ("Our pallets", "/images/about-stack.jpg"),
            ("Inside the Yard", "/images/inside-yard.jpg"),
        ]
        for i, (caption, image) in enumerate(gallery):
            items.append(ContentItem(section=ContentSection.gallery, title=caption, image_url=image, order_index=i))

        # Nav items
        nav = [
            ("Home", "/#home"),
            ("Products", "/#products"),
            ("Services", "/services"),
            ("About Us", "/about"),
            ("Gallery", "/gallery"),
            ("FAQ", "/faq"),
            ("Contact", "/contact"),
        ]
        for i, (label, href) in enumerate(nav):
            items.append(ContentItem(section=ContentSection.nav_item, title=label, link_url=href, order_index=i))

        # Footer links
        footer_links = [
            ("Products", "/#products", "Company"),
            ("Services", "/services", "Company"),
            ("About Us", "/about", "Company"),
            ("Gallery", "/gallery", "Company"),
            ("FAQ", "/faq", "Company"),
            ("Contact", "/contact", "Company"),
            ("Request a quote", "/quote", "Get started"),
        ]
        for i, (label, href, column) in enumerate(footer_links):
            items.append(ContentItem(section=ContentSection.footer_link, title=label, link_url=href, extra={"column": column}, order_index=i))

        db.add_all(items)

        # Site settings (homepage hero + contact info) — exact wording requested by client
        settings = {
            "hero_headline_line1": "Built to carry.",
            "hero_headline_line2": "Ready to earn your trust.",
            "hero_subtext": "New, recycled, custom, export-ready, and heat-treated pallets—reliably delivered across Dallas–Fort Worth and surrounding areas.",
            "footer_tagline": "New, recycled, custom, and heat-treated pallet solutions for businesses across the Dallas–Fort Worth area.",
        }
        for key, value in settings.items():
            db.add(SiteSetting(key=key, value=value))

        db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    """Root endpoint — used as a simple liveness check by some platforms."""
    return {"status": "ok", "service": "Woody Doody Pallets API"}


@app.get("/health")
def health_root():
    return {"status": "ok"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
