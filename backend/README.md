# BloodConnect API

FastAPI backend for the BloodConnect donor-search app. Matches the endpoints the
Next.js frontend already calls in `lib/api.js`:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/donors/search`
- `GET /api/donors/me`
- `GET /api/donors/{id}`
- `POST /api/donors/me/log-donation`

Data is stored in SQLite via SQLAlchemy, passwords are hashed with bcrypt, and
sessions are JWTs sent as `Authorization: Bearer <token>`.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit JWT_SECRET_KEY for anything beyond local dev
```

## Seed sample donors (optional but recommended)

Populates the same 8 sample donors the frontend used to mock, all with the
password `password123`:

```bash
python seed.py
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

The frontend expects this at `http://localhost:8000` by default
(`NEXT_PUBLIC_API_URL` in the Next.js app can override that).

Interactive API docs: http://localhost:8000/docs
