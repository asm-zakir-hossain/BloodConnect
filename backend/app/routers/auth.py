from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.crud import donor_to_private
from app.database import get_db
from app.models import Donor
from app.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if not payload.email and not payload.phone:
        raise HTTPException(status_code=400, detail="Email or phone number is required")

    conflict_filters = []
    if payload.email:
        conflict_filters.append(Donor.email == payload.email)
    if payload.phone:
        conflict_filters.append(Donor.phone == payload.phone)

    existing = db.query(Donor).filter(or_(*conflict_filters)).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email or phone already exists")

    donor = Donor(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role=payload.role,
        blood_group=payload.blood_group or "",
        division=payload.division,
        district=payload.district,
        area=payload.area,
        date_of_birth=payload.date_of_birth,
        gender=payload.gender,
        university=payload.university,
        last_donation_date=payload.last_donation_date,
        total_donations=1 if payload.last_donation_date else 0,
        phone_visibility="public",
    )
    db.add(donor)
    db.commit()
    db.refresh(donor)

    token = create_access_token(donor.id)
    return AuthResponse(access_token=token, donor=donor_to_private(donor))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(
        or_(Donor.email == payload.email_or_phone, Donor.phone == payload.email_or_phone)
    ).first()

    if not donor or not verify_password(payload.password, donor.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email/phone or password")

    token = create_access_token(donor.id)
    return AuthResponse(access_token=token, donor=donor_to_private(donor))
