from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import compute_availability, donor_to_private, donor_to_public
from app.database import get_db
from app.deps import get_current_donor, get_optional_donor
from app.models import Donor
from app.schemas import DonorPrivate, DonorPublic, LogDonationRequest

router = APIRouter(prefix="/api/donors", tags=["donors"])


@router.get("/search", response_model=list[DonorPublic])
def search_donors(
    blood_group: str | None = None,
    division: str | None = None,
    district: str | None = None,
    show_unavailable: bool = False,
    db: Session = Depends(get_db),
    viewer: Donor | None = Depends(get_optional_donor),
):
    query = db.query(Donor)
    if blood_group and blood_group != "ALL":
        query = query.filter(Donor.blood_group == blood_group)
    if division:
        query = query.filter(Donor.division == division)
    if district:
        query = query.filter(Donor.district == district)

    results = []
    for donor in query.all():
        is_available, _ = compute_availability(donor.last_donation_date)
        if not show_unavailable and not is_available:
            continue
        results.append(donor_to_public(donor, reveal_phone=viewer is not None))
    return results


@router.get("/me", response_model=DonorPrivate)
def get_my_profile(current: Donor = Depends(get_current_donor)):
    return donor_to_private(current)


@router.get("/{donor_id}", response_model=DonorPublic)
def get_donor(
    donor_id: str,
    db: Session = Depends(get_db),
    viewer: Donor | None = Depends(get_optional_donor),
):
    donor = db.get(Donor, donor_id)
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return donor_to_public(donor, reveal_phone=viewer is not None)


@router.post("/me/log-donation", response_model=DonorPrivate)
def log_donation(
    payload: LogDonationRequest,
    db: Session = Depends(get_db),
    current: Donor = Depends(get_current_donor),
):
    current.last_donation_date = payload.donation_date
    current.total_donations += 1
    db.commit()
    db.refresh(current)
    return donor_to_private(current)
