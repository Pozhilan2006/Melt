from fastapi.testclient import TestClient


def register(client: TestClient, email: str, name: str) -> str:
    response = client.post(
        "/api/v1/auth/register",
        json={"name": name, "email": email, "password": "securePass1"},
    )
    assert response.status_code == 201
    return response.json()["access_token"]


def headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def create_community(
    client: TestClient,
    token: str,
    name: str = "Football Friends",
    category: str = "Sports",
) -> dict:
    response = client.post(
        "/api/v1/communities",
        headers=headers(token),
        json={
            "name": name,
            "description": f"A real-world {name.lower()} community.",
            "category": category,
            "location": "Kompally",
            "visibility": "PUBLIC",
        },
    )
    assert response.status_code == 201
    return response.json()


class TestCommunities:
    def test_creation_requires_authentication(self, client):
        response = client.post(
            "/api/v1/communities",
            json={"name": "No Auth", "category": "Sports", "location": "Hyderabad"},
        )
        assert response.status_code == 401

    def test_creator_becomes_admin(self, client):
        token = register(client, "community-admin@meelt.io", "Community Admin")
        community = create_community(client, token)

        assert community["member_count"] == 1
        assert community["membership"] == {"is_member": True, "role": "ADMIN"}
        assert community["members"][0]["role"] == "ADMIN"
        assert "password_hash" not in str(community)

    def test_list_search_and_category_filter(self, client):
        token = register(client, "community-search@meelt.io", "Community Search")
        create_community(client, token, "Football Friends")
        create_community(client, token, "Coding Circle", category="Tech")

        search = client.get("/api/v1/communities?search=football")
        assert search.status_code == 200
        assert [item["name"] for item in search.json()] == ["Football Friends"]

        category = client.get("/api/v1/communities?category=Sports")
        assert category.status_code == 200
        assert len(category.json()) == 1

    def test_join_duplicate_join_and_leave(self, client):
        creator_token = register(client, "community-owner@meelt.io", "Community Owner")
        member_token = register(client, "community-member@meelt.io", "Community Member")
        community = create_community(client, creator_token, "Joinable Tribe")

        joined = client.post(
            f"/api/v1/communities/{community['id']}/join",
            headers=headers(member_token),
        )
        assert joined.status_code == 200
        assert joined.json()["member_count"] == 2
        assert joined.json()["membership"] == {"is_member": True, "role": "MEMBER"}

        duplicate = client.post(
            f"/api/v1/communities/{community['id']}/join",
            headers=headers(member_token),
        )
        assert duplicate.status_code == 409

        left = client.delete(
            f"/api/v1/communities/{community['id']}/leave",
            headers=headers(member_token),
        )
        assert left.status_code == 200
        assert left.json()["member_count"] == 1
        assert left.json()["membership"] == {"is_member": False, "role": None}

    def test_final_admin_cannot_leave(self, client):
        token = register(client, "community-final-admin@meelt.io", "Final Admin")
        community = create_community(client, token, "Admin Protected Tribe")

        response = client.delete(
            f"/api/v1/communities/{community['id']}/leave",
            headers=headers(token),
        )
        assert response.status_code == 409
        assert "final admin" in response.json()["detail"].lower()

    def test_members_endpoint_hides_private_fields(self, client):
        token = register(client, "community-members@meelt.io", "Members Viewer")
        community = create_community(client, token, "Member Directory")

        response = client.get(
            f"/api/v1/communities/{community['id']}/members",
            headers=headers(token),
        )
        assert response.status_code == 200
        member = response.json()[0]
        assert member["role"] == "ADMIN"
        assert "password" not in member
        assert "password_hash" not in member
