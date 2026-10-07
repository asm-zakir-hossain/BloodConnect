"""Import scraped Prime University student donors into the database.

Reads backend/data/prime_students.csv (columns: name,batch,blood_group,
contact_number,current_location) and creates Donor rows with
university="Prime University". Idempotent: skips rows whose phone number
already exists and deduplicates within the CSV.

Run with: python seed_prime.py
All imported accounts use the password "password123" for local testing.
"""
import csv
from pathlib import Path

from app.database import Base, SessionLocal, engine
from app.models import Donor
from app.security import hash_password

CSV_PATH = Path(__file__).parent / "data" / "prime_students.csv"
DEFAULT_PASSWORD = "password123"


def _location_parts(location: str) -> tuple[str, str]:
    loc = (location or "").lower()
    for division in ("Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal",
                     "Sylhet", "Rangpur", "Mymensingh"):
        if division.lower() in loc:
            return division, division
    return "", ""


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = {
            phone for (phone,) in db.query(Donor.phone).filter(Donor.phone.isnot(None)).all()
        }
        seen = set(existing)
        password_hash = hash_password(DEFAULT_PASSWORD)
        imported = 0

        with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                phone = (row.get("contact_number") or "").strip()
                blood_group = (row.get("blood_group") or "").strip()
                name = (row.get("name") or "").strip()
                if not name or not blood_group or (phone and phone in seen):
                    continue
                if phone:
                    seen.add(phone)
                division, district = _location_parts(row.get("current_location") or "")
                db.add(Donor(
                    name=name,
                    phone=phone or None,
                    password_hash=password_hash,
                    blood_group=blood_group,
                    division=division,
                    district=district,
                    area=(row.get("current_location") or "").strip(),
                    university="Prime University",
                ))
                imported += 1

        db.commit()
        print(f"Imported {imported} Prime University students (password: {DEFAULT_PASSWORD}).")
    finally:
        db.close()


if __name__ == "__main__":
    run()
