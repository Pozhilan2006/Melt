"""
Backend authentication tests — Phase 4.

Covers: Registration, Login, JWT validation, Profile endpoints.
Uses in-memory SQLite via conftest.py for speed.
"""
import pytest
from fastapi.testclient import TestClient


# ── Helper ────────────────────────────────────────────────────────────────────

def register_user(client: TestClient, name="Test User", email="test@meelt.io", password="securePass1"):
    return client.post("/api/v1/auth/register", json={
        "name": name,
        "email": email,
        "password": password,
    })


def get_token(client: TestClient, email="test@meelt.io", password="securePass1") -> str:
    resp = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return resp.json().get("access_token", "")


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ── Registration ──────────────────────────────────────────────────────────────

class TestRegistration:
    def test_valid_registration(self, client):
        resp = register_user(client, email="newuser@meelt.io")
        assert resp.status_code == 201
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "newuser@meelt.io"
        assert "password" not in data["user"]
        assert "password_hash" not in data["user"]

    def test_duplicate_email_rejected(self, client):
        register_user(client, email="dup@meelt.io")
        resp = register_user(client, email="dup@meelt.io")
        assert resp.status_code == 400
        assert "already exists" in resp.json()["detail"].lower()

    def test_invalid_email_rejected(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "name": "Bad Email",
            "email": "not-an-email",
            "password": "securePass1",
        })
        assert resp.status_code == 422

    def test_short_password_rejected(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "name": "Weak Pass",
            "email": "weakpass@meelt.io",
            "password": "abc",
        })
        assert resp.status_code == 422
        error_str = str(resp.json())
        assert "8" in error_str or "password" in error_str.lower()

    def test_missing_name_rejected(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "email": "noname@meelt.io",
            "password": "securePass1",
        })
        assert resp.status_code == 422

    def test_username_auto_generated(self, client):
        resp = register_user(client, email="autousername@meelt.io", name="Pozhilan Kumar")
        assert resp.status_code == 201
        username = resp.json()["user"]["username"]
        assert username  # not empty
        assert "pozhilankumar" in username  # derived from name

    def test_is_onboarded_false_after_register(self, client):
        resp = register_user(client, email="onboard@meelt.io")
        assert resp.json()["user"]["is_onboarded"] is False


# ── Login ─────────────────────────────────────────────────────────────────────

class TestLogin:
    def setup_method(self, method):
        """Ensure fresh user exists before each login test via shared fixture."""

    def test_valid_login(self, client):
        register_user(client, email="logintest@meelt.io")
        resp = client.post("/api/v1/auth/login", json={
            "email": "logintest@meelt.io",
            "password": "securePass1",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["user"]["email"] == "logintest@meelt.io"

    def test_wrong_password_rejected(self, client):
        register_user(client, email="wrongpwd@meelt.io")
        resp = client.post("/api/v1/auth/login", json={
            "email": "wrongpwd@meelt.io",
            "password": "wrongpassword",
        })
        assert resp.status_code == 401
        # Generic message — must not reveal whether email exists
        assert "invalid" in resp.json()["detail"].lower()

    def test_nonexistent_email_rejected(self, client):
        resp = client.post("/api/v1/auth/login", json={
            "email": "ghost@meelt.io",
            "password": "securePass1",
        })
        assert resp.status_code == 401
        assert "invalid" in resp.json()["detail"].lower()

    def test_missing_email_rejected(self, client):
        resp = client.post("/api/v1/auth/login", json={"password": "securePass1"})
        assert resp.status_code == 422

    def test_missing_password_rejected(self, client):
        resp = client.post("/api/v1/auth/login", json={"email": "nopwd@meelt.io"})
        assert resp.status_code == 422


# ── JWT / Auth Middleware ─────────────────────────────────────────────────────

class TestJWTAuth:
    def test_me_returns_current_user(self, client):
        register_user(client, email="metest@meelt.io")
        token = get_token(client, email="metest@meelt.io")
        resp = client.get("/api/v1/auth/me", headers=auth_headers(token))
        assert resp.status_code == 200
        assert resp.json()["email"] == "metest@meelt.io"

    def test_me_without_token_returns_401(self, client):
        resp = client.get("/api/v1/auth/me")
        assert resp.status_code == 401

    def test_me_with_invalid_token_returns_401(self, client):
        resp = client.get("/api/v1/auth/me", headers=auth_headers("this.is.garbage"))
        assert resp.status_code == 401

    def test_me_with_tampered_token_returns_401(self, client):
        register_user(client, email="tamper@meelt.io")
        token = get_token(client, email="tamper@meelt.io")
        tampered = token[:-5] + "XXXXX"
        resp = client.get("/api/v1/auth/me", headers=auth_headers(tampered))
        assert resp.status_code == 401

    def test_protected_users_me_requires_auth(self, client):
        resp = client.get("/api/v1/users/me")
        assert resp.status_code == 401


# ── Profile ───────────────────────────────────────────────────────────────────

class TestProfile:
    def test_get_my_profile(self, client):
        register_user(client, email="profile1@meelt.io")
        token = get_token(client, email="profile1@meelt.io")
        resp = client.get("/api/v1/users/me", headers=auth_headers(token))
        assert resp.status_code == 200
        assert resp.json()["email"] == "profile1@meelt.io"

    def test_update_profile(self, client):
        register_user(client, email="profile2@meelt.io")
        token = get_token(client, email="profile2@meelt.io")
        resp = client.patch(
            "/api/v1/users/me",
            headers=auth_headers(token),
            json={"bio": "Love anime and football!", "location_name": "Kompally, Hyderabad"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["bio"] == "Love anime and football!"
        assert data["location_name"] == "Kompally, Hyderabad"

    def test_update_interests(self, client):
        register_user(client, email="interests1@meelt.io")
        token = get_token(client, email="interests1@meelt.io")
        # No interests exist in test DB, so passing an empty list is valid
        resp = client.put(
            "/api/v1/users/me/interests",
            headers=auth_headers(token),
            json={"interest_ids": []},
        )
        assert resp.status_code == 200
        assert resp.json()["interests"] == []

    def test_complete_onboarding(self, client):
        register_user(client, email="onboard2@meelt.io")
        token = get_token(client, email="onboard2@meelt.io")

        # Before: is_onboarded is False
        me = client.get("/api/v1/users/me", headers=auth_headers(token))
        assert me.json()["is_onboarded"] is False

        # Complete onboarding
        resp = client.post("/api/v1/users/me/onboarding", headers=auth_headers(token))
        assert resp.status_code == 200
        assert resp.json()["is_onboarded"] is True

    def test_unauthorized_profile_access(self, client):
        resp = client.patch("/api/v1/users/me", json={"bio": "should fail"})
        assert resp.status_code == 401

    def test_password_hash_never_returned(self, client):
        register_user(client, email="nohash@meelt.io")
        token = get_token(client, email="nohash@meelt.io")
        resp = client.get("/api/v1/users/me", headers=auth_headers(token))
        response_str = str(resp.json())
        assert "password_hash" not in response_str
        assert "password" not in resp.json()
