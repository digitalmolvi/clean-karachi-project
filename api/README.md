Civic Complaints API — FastAPI MVP (Clean Karachi)

A lightweight API to route citizen complaints to the right elected representatives (MNA/MPA) and crowd-prioritize them with local voting.

Framework: FastAPI

Database: SQLite (data/civic.db)

Auth: Omitted in MVP (JWT planned)

Run: uvicorn app:app --reload --port 8000

Docs: Swagger UI /docs, ReDoc /redoc

🚀 Problem  Pitch 

Citizens submit issues (trash, water, roads) with GPS. The API maps the location to a constituency (demo boxes), auto-assigns the complaint to the relevant MNA/MPA, and lets the community vote (+1/−1). Reps get a prioritized queue by public support.

🎯 Why It Matters (Impact)

Transparency: Publicly visible assignment to elected reps.

Prioritization: Voting surfaces hotspots quickly.

Low friction: Works with phone GPS; minimal input required.

Local relevance: Designed around Karachi’s NA/PS structure, but portable.

Future impact (ready hooks): severity scoring, automated summaries for reps, hotspot clustering.

✅ What’s Built (Completeness)

Complaint lifecycle: create → (auto) assign → vote → status updates → summary

Assignment logic: bounding-box resolver (demo) to NA/PS codes; override supported

Voting model: one vote per voter_id per complaint (upsert on re-vote)

Seed data: sample MNA/MPA reps for Karachi South/East

API docs: Swagger + Redoc auto-generated

Tests: minimal flow test under tests/

🤖 AI Leverage (now & near-term)

Now (architecture-ready):

Endpoints & schemas designed to plug in:

LLM summaries of clustered complaints for reps

Auto-classification (sanitation/water/roads), severity scoring

Deduplication via text/geo similarity

Near-term add-ons (post-MVP):

LLM assistant to generate status updates for reps

Geo-clustering (DBSCAN/HDBSCAN) to detect hot zones

Photo OCR & extraction for richer reports

🧭 UX Overview (API consumer & end user)

API consumer (frontends/bots): simple JSON contracts; instant Swagger docs

End user: minimal form → title, optional description, GPS → submit → vote/track

Reps: list of complaints filtered by constituency with vote totals

A tiny web/mobile UI can be layered on this API in hours.

🧰 Setup & Run (Step-by-step)

Create venv & upgrade pip

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip


Install dependencies

pip install -r requirements.txt
# or
# pip install fastapi uvicorn sqlmodel pydantic-settings python-multipart


Ensure DB path exists

mkdir -p data


Run the API

uvicorn app:app --reload --port 8000


Swagger: http://127.0.0.1:8000/docs

ReDoc: http://127.0.0.1:8000/redoc

🔌 API At-a-Glance (Expected Inputs/Outputs)
Create complaint

POST /complaints

{
  "title": "Garbage not collected",
  "description": "Overflowing trash near Khayaban-e-Seher",
  "lat": 24.83,
  "lng": 67.06,
  "address": "DHA Phase 6",
  "area_code_na": null,
  "area_code_ps": null
}


Returns (excerpt):

{
  "id": 1,
  "area_code_na": "NA-247",
  "area_code_ps": "PS-110",
  "status": "new",
  "mna": {"code":"NA-247","name":"Example MNA South"},
  "mpa": {"code":"PS-110","name":"Example MPA South"},
  "votes_total": 0
}

Vote

POST /complaints/{id}/vote

{ "voter_id": "user-92300", "value": 1 }


Returns: complaint summary with updated votes_total.

Update status

PATCH /complaints/{id}/status

{ "status": "in_progress" }

Seed demo reps

POST /seed/example → installs NA-247 / PS-110 / NA-242 / PS-102 examples.

Full schema & try-it-now in Swagger.

🧪 Quick Demo Script (10 minutes)

Seed reps → POST /seed/example

Create complaint (DHA coords) → auto NA-247 / PS-110, summary shows MNA/MPA

Vote (+1, then −1) → show upsert & totals

Update status → in_progress

List & summary views → show prioritization by votes

Explain AI hooks (classification, severity, clustering, summaries)

Tip: keep the terminal + Swagger side-by-side while presenting.

🗺️ Constituency Logic (MVP)

Bounding boxes for Karachi South (NA-247, PS-110) and Karachi East (NA-242, PS-102)

Outside boxes → NA-000 / PS-000

Override supported via area_code_na / area_code_ps

Upgrade path: replace with official polygons (PostGIS), or a hosted geocoder.

🧱 Testing
pytest -q


Contains: seed → create → vote → status → summary smoke test.

🛣️ Roadmap (fast wins)

JWT & roles (citizen/rep/admin)

Media uploads for complaints (photos)

Priority scorer (LLM + rules)

Hotspot clustering

Pagination & filters

Tiny React dashboard
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

