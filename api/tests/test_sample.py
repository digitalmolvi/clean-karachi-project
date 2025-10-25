from fastapi.testclient import TestClient
from app import app  # FastAPI instance inside app/__init__.py

client = TestClient(app)


def test_seed_and_flow():
    # Seed example reps
    r = client.post("/seed/example")
    assert r.status_code == 200

    # Create a complaint inside the South box (should map to NA-247 / PS-110)
    payload = {
        "title": "Garbage not collected",
        "description": "Overflowing trash near Khayaban-e-Seher",
        "lat": 24.83,
        "lng": 67.06,
        "address": "Phase 6, DHA"
    }
    r = client.post("/complaints", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["area_code_na"] == "NA-247"
    assert data["area_code_ps"] == "PS-110"
    cid = data["id"]

    # Vote +1
    r = client.post(f"/complaints/{cid}/vote", json={"voter_id": "user1", "value": 1})
    assert r.status_code == 200
    assert r.json()["votes_total"] == 1

    # Re-vote -1 (should update)
    r = client.post(f"/complaints/{cid}/vote", json={"voter_id": "user1", "value": -1})
    assert r.status_code == 200
    assert r.json()["votes_total"] == -1

    # Update status
    r = client.patch(f"/complaints/{cid}/status", json={"status": "in_progress"})
    assert r.status_code == 200
    assert r.json()["status"] == "in_progress"

    # Summary
    r = client.get(f"/complaints/{cid}/summary")
    assert r.status_code == 200
    s = r.json()
    assert s["votes_total"] == -1
