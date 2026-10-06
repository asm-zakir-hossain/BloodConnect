from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"}


def _to_camel(snake: str) -> str:
    first, *rest = snake.split("_")
    return first + "".join(word.capitalize() for word in rest)


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True)


class RegisterRequest(CamelModel):
    name: str
    email: EmailStr | None = None
    phone: str | None = None
    password: str = Field(min_length=8)
    confirm_password: str
    role: str = "donor"
    blood_group: str | None = None
    division: str
    district: str
    area: str = ""
    date_of_birth: date | None = None
    gender: str | None = None
    university: str | None = None
    last_donation_date: date | None = None

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in {"donor", "recipient"}:
            raise ValueError("role must be 'donor' or 'recipient'")
        return v

    @field_validator("blood_group")
    @classmethod
    def validate_blood_group(cls, v: str | None, info) -> str | None:
        if info.data.get("role", "donor") == "donor":
            if v is None or v not in BLOOD_GROUPS:
                raise ValueError(f"blood_group must be one of {sorted(BLOOD_GROUPS)}")
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("password and confirm_password do not match")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def minimum_age(cls, v: date | None) -> date | None:
        if v is not None:
            today = date.today()
            cutoff = today.replace(year=today.year - 18)
            if v > cutoff:
                raise ValueError("You must be at least 18 years old to register")
        return v


class LoginRequest(CamelModel):
    email_or_phone: str
    password: str


class DonorPublic(CamelModel):
    id: str
    name: str
    role: str = "donor"
    phone: str | None = None
    blood_group: str
    division: str
    district: str
    area: str
    university: str | None = None
    last_donation_date: date | None
    total_donations: int
    is_available: bool
    next_eligible_date: date | None
    phone_visibility: str
    is_verified: bool


class DonorPrivate(DonorPublic):
    email: str | None = None


class AuthResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    donor: DonorPrivate


class UpdateProfileRequest(CamelModel):
    university: str | None = None
    area: str | None = None
    division: str | None = None
    district: str | None = None
    gender: str | None = None
    phone_visibility: str | None = None


class LogDonationRequest(CamelModel):
    donation_date: date
    location_note: str | None = None
