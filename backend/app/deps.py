from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Donor
from app.security import decode_access_token


def _extract_token(authorization: str | None) -> str | None:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    return authorization.split(" ", 1)[1].strip()


def get_current_donor(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> Donor:
    token = _extract_token(authorization)
    donor_id = decode_access_token(token) if token else None
    if not donor_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    donor = db.get(Donor, donor_id)
    if not donor:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return donor


def get_optional_donor(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> Donor | None:
    token = _extract_token(authorization)
    donor_id = decode_access_token(token) if token else None
    if not donor_id:
        return None
    return db.get(Donor, donor_id)
