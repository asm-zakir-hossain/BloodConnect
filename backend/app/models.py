import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def _new_id() -> str:
    return uuid.uuid4().hex[:12]


class Donor(Base):
    __tablename__ = "donors"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_id)

    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)

    blood_group: Mapped[str] = mapped_column(String, nullable=False)
    division: Mapped[str] = mapped_column(String, nullable=False)
    district: Mapped[str] = mapped_column(String, nullable=False)
    area: Mapped[str] = mapped_column(String, default="")

    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[str | None] = mapped_column(String, nullable=True)
    university: Mapped[str | None] = mapped_column(String, nullable=True)

    last_donation_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    total_donations: Mapped[int] = mapped_column(Integer, default=0)

    role: Mapped[str] = mapped_column(String, default="donor")
    phone_visibility: Mapped[str] = mapped_column(String, default="public")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
