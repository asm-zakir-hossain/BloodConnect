from datetime import date, timedelta

from app.models import Donor
from app.schemas import DonorPrivate, DonorPublic

DONATION_COOLDOWN_DAYS = 90


def compute_availability(last_donation_date: date | None) -> tuple[bool, date | None]:
    """Mirrors the 90-day cooldown rule used on the dashboard (PRD 5.4)."""
    if last_donation_date is None:
        return True, None

    next_eligible = last_donation_date + timedelta(days=DONATION_COOLDOWN_DAYS)
    if date.today() >= next_eligible:
        return True, None
    return False, next_eligible


def donor_to_public(donor: Donor, *, reveal_phone: bool) -> DonorPublic:
    is_available, next_eligible_date = compute_availability(donor.last_donation_date)
    show_phone = reveal_phone or donor.phone_visibility == "public"
    return DonorPublic(
        id=donor.id,
        name=donor.name,
        phone=donor.phone if show_phone else None,
        blood_group=donor.blood_group,
        division=donor.division,
        district=donor.district,
        area=donor.area,
        last_donation_date=donor.last_donation_date,
        total_donations=donor.total_donations,
        is_available=is_available,
        next_eligible_date=next_eligible_date,
        phone_visibility=donor.phone_visibility,
        is_verified=donor.is_verified,
    )


def donor_to_private(donor: Donor) -> DonorPrivate:
    is_available, next_eligible_date = compute_availability(donor.last_donation_date)
    return DonorPrivate(
        id=donor.id,
        name=donor.name,
        email=donor.email,
        phone=donor.phone,
        blood_group=donor.blood_group,
        division=donor.division,
        district=donor.district,
        area=donor.area,
        last_donation_date=donor.last_donation_date,
        total_donations=donor.total_donations,
        is_available=is_available,
        next_eligible_date=next_eligible_date,
        phone_visibility=donor.phone_visibility,
        is_verified=donor.is_verified,
    )
