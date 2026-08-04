# AK Pallet Blocks — Full Stack Website

A working full-stack project: Next.js frontend, FastAPI backend, PostgreSQL database.
Customer registration, login, quote requests, and an admin panel to review both are
fully wired end-to-end.

## Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python), JWT auth (access + refresh tokens)
- **Database:** PostgreSQL, via SQLAlchemy models
- **Deployment:** Docker Compose (db + backend + frontend)

## Quick start (Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- Postgres: localhost:5432 (user: `pallet_user`, password: `pallet_pass`, db: `pallet_company`)

An admin account is seeded automatically on first boot from the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` env vars in `docker-compose.yml` (defaults to
`admin@akpalletblocks.com` / `ChangeMe123!`). **Change these before deploying anywhere
public**, and change `JWT_SECRET_KEY` / `JWT_REFRESH_SECRET_KEY` too.

Log in at `/login` with the admin credentials to reach `/admin`. Any account
registered through `/register` gets the `customer` role and lands on `/dashboard`.

## Running without Docker (local dev)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# make sure Postgres is running locally and DATABASE_URL points to it
export DATABASE_URL=postgresql://pallet_user:pallet_pass@localhost:5432/pallet_company
export ADMIN_EMAIL=admin@akpalletblocks.com
export ADMIN_PASSWORD=ChangeMe123!
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## How the pieces connect

1. A visitor registers at `/register` → `POST /api/auth/register` → row created in
   the `users` table (role = `customer`, password hashed with bcrypt).
2. They log in at `/login` → `POST /api/auth/login` → JWT access + refresh tokens
   stored in the browser and sent as `Authorization: Bearer` on every request.
3. `/quote` submits `POST /api/quotes`, tied to the logged-in customer's ID.
4. `/dashboard` calls `GET /api/quotes` to show that customer's own quote history
   and live status.
5. An admin logs in with the seeded admin account and lands on `/admin`, which
   pulls `GET /api/admin/stats`, `/api/admin/customers`, and `/api/admin/quotes`
   — all protected by a `require_admin` dependency that rejects non-admin tokens.
6. From `/admin/quotes`, the admin can filter by status and approve/reject with
   one click (`PATCH /api/admin/quotes/{id}`); from `/admin/customers`, they can
   search and enable/disable accounts.

## What's included vs. what to add next

**Included (functional):** registration, login/JWT auth, quote submission,
customer dashboard, admin stats/customers/quotes with actions, Postgres schema,
Docker Compose, CORS, password hashing.

**Not yet included** (tell me which to build next):
- Email notifications (Mailchimp/SMTP) on quote submission and status change
- File/image uploads for products and blog (S3/Cloudinary)
- Blog and Contact-form-submissions admin management
- Invoice generation/download
- Refresh-token rotation on the frontend (currently only login sets tokens)
- Production Nginx + SSL config
- Full remaining marketing pages (About, Industries detail, Coverage map, Careers, Blog)
  wired to an admin-editable CMS instead of hardcoded content

## Folder structure

```
pallet-company/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── core/          # security, JWT, auth dependencies
│       ├── models/        # SQLAlchemy models (User, Quote)
│       ├── schemas/       # Pydantic request/response schemas
│       └── routers/       # auth, quotes, admin
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── lib/api.ts         # typed API client
    └── app/
        ├── page.tsx           # homepage
        ├── register/          # customer registration
        ├── login/             # login (routes admin vs customer)
        ├── dashboard/         # customer quote history
        ├── quote/             # quote request form
        └── admin/
            ├── page.tsx           # stats overview
            ├── customers/         # searchable customer table
            └── quotes/            # quote queue with approve/reject
```
