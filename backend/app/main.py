from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
from app.routers import auth, donors

Base.metadata.create_all(bind=engine)

with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE donors ADD COLUMN role VARCHAR DEFAULT 'donor'"))
    except Exception:
        pass
with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE donors ADD COLUMN university VARCHAR"))
    except Exception:
        pass

with engine.begin() as conn:
    for stmt in [
        "CREATE INDEX IF NOT EXISTS ix_donors_role ON donors (role)",
        "CREATE INDEX IF NOT EXISTS ix_donors_university ON donors (university)",
        "CREATE INDEX IF NOT EXISTS ix_donors_phone ON donors (phone)",
        "CREATE INDEX IF NOT EXISTS ix_donors_blood_group_division_district ON donors (blood_group, division, district)",
    ]:
        try:
            conn.execute(text(stmt))
        except Exception:
            pass

app = FastAPI(title="BloodConnect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(donors.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
