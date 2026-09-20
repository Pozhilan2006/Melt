import pytest
from fastapi.testclient import TestClient


def test_health_check_endpoint(client: TestClient):
    """Verify health check endpoint returns 200 OK."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "MEELT!" in data["project"]


def test_list_interests_endpoint(client: TestClient):
    """Verify list interests endpoint populates initial categories."""
    response = client.get("/api/v1/interests")
    assert response.status_code == 200
    interests = response.json()
    assert len(interests) >= 5
    assert any(i["name"] == "Football" for i in interests)


def test_user_creation_and_retrieval(client: TestClient):
    """Verify user registration and profile lookup."""
    user_payload = {
        "name": "Alex Sensei",
        "username": "alex_sensei",
        "email": "alex@melt.app",
        "password": "SecurePassword123!",
        "bio": "Weekend Striker",
        "location_name": "Kompally, Hyderabad"
    }

    # Create user
    res_create = client.post("/api/v1/users", json=user_payload)
    assert res_create.status_code == 201
    user_data = res_create.json()
    assert user_data["username"] == "alex_sensei"
    assert "password_hash" not in user_data

    # Fetch user profile
    res_get = client.get(f"/api/v1/users/{user_data['id']}")
    assert res_get.status_code == 200
    assert res_get.json()["name"] == "Alex Sensei"


def test_community_creation_and_listing(client: TestClient):
    """Verify tribe creation and retrieval."""
    comm_payload = {
        "name": "Hyd Football Turf Tribe ⚽",
        "tagline": "Weekend matches",
        "description": "7v7 turf games",
        "category": "Sports",
        "location": "Kompally",
        "visibility": "PUBLIC"
    }

    res_create = client.post("/api/v1/communities", json=comm_payload)
    assert res_create.status_code == 201
    comm_data = res_create.json()
    assert comm_data["name"] == "Hyd Football Turf Tribe ⚽"

    res_list = client.get("/api/v1/communities")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1


def test_activity_creation_and_listing(client: TestClient):
    """Verify activity creation and retrieval."""
    act_payload = {
        "title": "Sunday Morning 7v7 Football ⚽",
        "description": "7v7 match on turf",
        "category": "Sports",
        "venue_name": "Striker Turf Arena",
        "area": "Kompally",
        "city": "Hyderabad",
        "distance_km": 1.8,
        "start_time": "2026-09-27T07:00:00Z",
        "capacity": 14,
        "entry_fee": "₹150"
    }

    res_create = client.post("/api/v1/activities", json=act_payload)
    assert res_create.status_code == 201
    act_data = res_create.json()
    assert act_data["title"] == "Sunday Morning 7v7 Football ⚽"
    assert act_data["status"] == "OPEN"

    res_list = client.get("/api/v1/activities")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1
