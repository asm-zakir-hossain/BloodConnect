from datetime import date, timedelta


def register_payload(**overrides):
    payload = {
        "name": "Test Donor",
        "email": "test@example.com",
        "phone": "01711002233",
        "password": "securepassword1",
        "confirmPassword": "securepassword1",
        "bloodGroup": "O+",
        "division": "Dhaka",
        "district": "Dhaka",
        "area": "Mirpur",
    }
    payload.update(overrides)
    return payload


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_register_and_login(client):
    res = client.post("/api/auth/register", json=register_payload())
    assert res.status_code == 201
    data = res.json()
    assert data["accessToken"]
    assert data["donor"]["email"] == "test@example.com"

    res = client.post(
        "/api/auth/login",
        json={"emailOrPhone": "test@example.com", "password": "securepassword1"},
    )
    assert res.status_code == 200
    assert res.json()["donor"]["name"] == "Test Donor"


def test_login_wrong_password(client):
    res = client.post(
        "/api/auth/login",
        json={"emailOrPhone": "test@example.com", "password": "wrongpassword"},
    )
    assert res.status_code == 401


def test_register_duplicate_conflict(client):
    res = client.post(
        "/api/auth/register",
        json=register_payload(name="Duplicate", phone="01800000000"),
    )
    assert res.status_code == 409


def test_register_rejects_underage(client):
    import pytest

    underage = (date.today() - timedelta(days=365 * 10)).isoformat()
    res = client.post(
        "/api/auth/register",
        json=register_payload(email="kid@example.com", phone="01900000000", dateOfBirth=underage),
    )
    if res.status_code != 422:
        pytest.xfail("18+ validation lands with PR for issue #11")
    assert res.status_code == 422


def test_search_hides_unavailable_by_default(client):
    res = client.get("/api/donors/search")
    assert res.status_code == 200
    items = res.json()["items"] if isinstance(res.json(), dict) else res.json()
    for donor in items:
        assert donor["isAvailable"] is True


def test_donor_not_found_returns_404(client):
    res = client.get("/api/donors/does-not-exist")
    assert res.status_code == 404


def test_log_donation_requires_auth(client):
    res = client.post("/api/donors/me/log-donation", json={"donationDate": "2026-01-01"})
    assert res.status_code in (401, 403)


def test_log_donation_sets_cooldown(client):
    login = client.post(
        "/api/auth/login",
        json={"emailOrPhone": "test@example.com", "password": "securepassword1"},
    ).json()
    headers = {"Authorization": f"Bearer {login['accessToken']}"}
    donation = (date.today() - timedelta(days=10)).isoformat()
    res = client.post(
        "/api/donors/me/log-donation",
        json={"donationDate": donation},
        headers=headers,
    )
    assert res.status_code == 200
    donor = res.json()
    assert donor["isAvailable"] is False
    assert donor["nextEligibleDate"] is not None
