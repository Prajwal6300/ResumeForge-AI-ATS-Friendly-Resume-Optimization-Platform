"""
ResumeForge AI - Authentication Unit Tests
"""

import pytest
from httpx import AsyncClient
from app.core.security import verify_password, get_password_hash, create_access_token, decode_token


def test_password_hashing():
    raw = "MySuperSecret123!"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_encoding_and_decoding():
    user_id = "test-user-uuid-1234"
    token = create_access_token(subject=user_id)
    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["type"] == "access"


@pytest.mark.asyncio
async def test_user_registration_and_login_flow(client: AsyncClient):
    # 1. Register
    reg_payload = {
        "email": "newuser@example.com",
        "password": "Password123!",
        "full_name": "New User",
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert data["user"]["email"] == "newuser@example.com"
    assert "access_token" in data["tokens"]

    # 2. Duplicate registration should fail with 409
    dup_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_resp.status_code == 409

    # 3. Login with correct credentials
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "newuser@example.com", "password": "Password123!"},
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()["tokens"]

    # 4. Login with wrong password
    bad_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "newuser@example.com", "password": "WrongPassword!"},
    )
    assert bad_login.status_code == 401
