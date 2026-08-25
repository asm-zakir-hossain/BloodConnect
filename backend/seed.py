"""Seed the database with the same sample donors the frontend used to mock.

Run with: python seed.py
All seeded accounts use the password "password123" for local testing.
"""
from datetime import date

from app.database import Base, SessionLocal, engine
from app.models import Donor
from app.security import hash_password

SEED_DONORS = [
    dict(name="Tanvir Ahmed", phone="01711002233", blood_group="O+", division="Dhaka",
         district="Dhaka", area="Mirpur 10", last_donation_date=date(2026, 2, 15), total_donations=4),
    dict(name="Rahim Chowdhury", phone="01812345678", blood_group="A+", division="Dhaka",
         district="Dhaka", area="Dhanmondi", last_donation_date=date(2026, 7, 10), total_donations=2),
    dict(name="Nusrat Jahan", phone="01999887766", blood_group="B+", division="Chattogram",
         district="Chattogram", area="Agrabad", last_donation_date=date(2025, 11, 20), total_donations=6,
         phone_visibility="logged_in_only"),
    dict(name="Sabbir Hossain", phone="01555443322", blood_group="O-", division="Dhaka",
         district="Gazipur", area="Tongi", last_donation_date=date(2026, 1, 5), total_donations=8),
    dict(name="Farhana Islam", phone="01677889900", blood_group="AB+", division="Sylhet",
         district="Sylhet", area="Zindabazar", last_donation_date=date(2026, 6, 25), total_donations=1),
    dict(name="Mahmud Hasan", phone="01300112233", blood_group="O+", division="Rajshahi",
         district="Rajshahi", area="Kazla", last_donation_date=date(2025, 8, 14), total_donations=5),
    dict(name="Anika Rahman", phone="01400556677", blood_group="B-", division="Dhaka",
         district="Dhaka", area="Uttara Sector 7", last_donation_date=date(2026, 3, 1), total_donations=3),
    dict(name="Kazi Arif", phone="01899112244", blood_group="A-", division="Khulna",
         district="Khulna", area="Boyra", last_donation_date=date(2026, 7, 28), total_donations=9,
         phone_visibility="logged_in_only"),
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Donor).count() > 0:
            print("Donors table already has data — skipping seed.")
            return

        for entry in SEED_DONORS:
            donor = Donor(password_hash=hash_password("password123"), **entry)
            db.add(donor)
        db.commit()
        print(f"Seeded {len(SEED_DONORS)} donors (password: password123).")
    finally:
        db.close()


if __name__ == "__main__":
    run()
