from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import compute_availability, donor_to_private, donor_to_public
from app.database import get_db
from app.deps import get_current_donor, get_optional_donor
from app.models import Donor
from app.schemas import DonorPrivate, DonorPublic, LogDonationRequest, UpdateProfileRequest

router = APIRouter(prefix="/api/donors", tags=["donors"])


@router.get("/search")
def search_donors(
    blood_group: str | None = None,
    division: str | None = None,
    district: str | None = None,
    area: str | None = None,
    university: str | None = None,
    show_unavailable: bool = False,
    page: int = 1,
    page_size: int = 12,
    db: Session = Depends(get_db),
    viewer: Donor | None = Depends(get_optional_donor),
):
    query = db.query(Donor).filter(Donor.role == "donor")
    if blood_group and blood_group != "ALL":
        query = query.filter(Donor.blood_group == blood_group)
    if division:
        query = query.filter(Donor.division == division)
    if district:
        query = query.filter(Donor.district == district)
    if area:
        query = query.filter(Donor.area.ilike(f"%{area}%"))
    if university:
        query = query.filter(Donor.university.ilike(f"%{university}%"))

    results = []
    for donor in query.all():
        is_available, _ = compute_availability(donor.last_donation_date)
        if not show_unavailable and not is_available:
            continue
        results.append(donor_to_public(donor, reveal_phone=viewer is not None))
    total = len(results)
    start = max(page - 1, 0) * page_size
    return {
        "items": results[start : start + page_size],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": max((total + page_size - 1) // page_size, 1),
    }


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


@router.patch("/me", response_model=DonorPrivate)
def update_my_profile(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current: Donor = Depends(get_current_donor),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current, field, value)
    db.commit()
    db.refresh(current)
    return donor_to_private(current)


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
