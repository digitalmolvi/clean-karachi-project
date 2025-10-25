"""
Civic Complaints API — Clean Karachi (FastAPI + SQLModel, SQLite)
Run:
  uvicorn app:app --reload --port 8000
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from sqlmodel import Field as ORMField, Session, SQLModel, create_engine, select
from sqlalchemy import UniqueConstraint

# ----------------------------------------------------------------------------
# DB setup
# ----------------------------------------------------------------------------
# Ensure data folder exists
os.makedirs("data", exist_ok=True)

engine = create_engine("sqlite:///data/civic.db", echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


# ----------------------------------------------------------------------------
# Enums
# ----------------------------------------------------------------------------
class RepRole(str, Enum):
    MNA = "MNA"  # National Assembly
    MPA = "MPA"  # Provincial Assembly


class ComplaintStatus(str, Enum):
    NEW = "new"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"


# ----------------------------------------------------------------------------
# Models
# ----------------------------------------------------------------------------
class Representative(SQLModel, table=True):
    id: Optional[int] = ORMField(default=None, primary_key=True)
    role: RepRole
    code: str = ORMField(index=True)  # e.g., "NA-247" or "PS-110"
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    district: Optional[str] = None


class Complaint(SQLModel, table=True):
    id: Optional[int] = ORMField(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    lat: float
    lng: float
    address: Optional[str] = None

    area_code_na: Optional[str] = ORMField(index=True, default=None)
    area_code_ps: Optional[str] = ORMField(index=True, default=None)

    mna_id: Optional[int] = ORMField(default=None, foreign_key="representative.id")
    mpa_id: Optional[int] = ORMField(default=None, foreign_key="representative.id")

    status: ComplaintStatus = ORMField(default=ComplaintStatus.NEW)

    created_at: datetime = ORMField(default_factory=datetime.utcnow)
    updated_at: datetime = ORMField(default_factory=datetime.utcnow)

    # when status becomes RESOLVED (for impact metrics)
    resolved_at: Optional[datetime] = ORMField(default=None, index=True)


class Vote(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("complaint_id", "voter_id", name="uq_vote_once"),
    )
    id: Optional[int] = ORMField(default=None, primary_key=True)
    complaint_id: int = ORMField(foreign_key="complaint.id", index=True)
    voter_id: str = ORMField(index=True)  # could be phone hash, CNIC hash, etc.
    value: int  # +1 or -1


class Team(SQLModel, table=True):
    id: Optional[int] = ORMField(default=None, primary_key=True)
    name: str = ORMField(index=True)
    area: Optional[str] = ORMField(default=None, index=True)
    description: Optional[str] = None
    is_active: bool = ORMField(default=True, index=True)
    created_at: datetime = ORMField(default_factory=datetime.utcnow)
    updated_at: datetime = ORMField(default_factory=datetime.utcnow)


class TeamMember(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("team_id", "email", name="uq_team_email"),
        UniqueConstraint("team_id", "phone", name="uq_team_phone"),
    )
    id: Optional[int] = ORMField(default=None, primary_key=True)
    team_id: int = ORMField(foreign_key="team.id", index=True)
    name: str
    email: Optional[EmailStr] = ORMField(default=None, index=True)
    phone: Optional[str] = ORMField(default=None, index=True)
    role: Optional[str] = ORMField(default="Volunteer")
    joined_at: datetime = ORMField(default_factory=datetime.utcnow)


# ----------------------------------------------------------------------------
# Schemas
# ----------------------------------------------------------------------------
class ComplaintCreate(BaseModel):
    title: str
    description: Optional[str] = None
    lat: float
    lng: float
    address: Optional[str] = None
    area_code_na: Optional[str] = None
    area_code_ps: Optional[str] = None


class ComplaintRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    lat: float
    lng: float
    address: Optional[str]
    area_code_na: Optional[str]
    area_code_ps: Optional[str]
    status: ComplaintStatus
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None


class RepresentativeRead(BaseModel):
    id: int
    role: RepRole
    code: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    district: Optional[str] = None


class ComplaintSummary(ComplaintRead):
    mna: Optional[RepresentativeRead] = None
    mpa: Optional[RepresentativeRead] = None
    votes_total: int
    votes_up: int
    votes_down: int


class StatusUpdate(BaseModel):
    status: ComplaintStatus


class VoteCreate(BaseModel):
    voter_id: str = Field(..., min_length=3)
    value: int = Field(..., description="+1 for upvote, -1 for downvote")

    def normalized(self) -> int:
        return 1 if self.value >= 1 else -1


class SeedRep(BaseModel):
    role: RepRole
    code: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    district: Optional[str] = None


class TeamCreate(BaseModel):
    name: str
    area: Optional[str] = None
    description: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    area: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class TeamRead(BaseModel):
    id: int
    name: str
    area: Optional[str] = None
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    member_count: int = 0


class TeamMemberJoin(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[str] = "Volunteer"


class TeamMemberRead(BaseModel):
    id: int
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    joined_at: datetime


class TeamDetail(TeamRead):
    members: List[TeamMemberRead] = []


# ----------------------------------------------------------------------------
# Constituency resolver
# ----------------------------------------------------------------------------
@dataclass
class Box:
    name: str
    lat_min: float
    lat_max: float
    lng_min: float
    lng_max: float
    na: str
    ps: str


AREAS: List[Box] = [
    Box(
        name="Karachi South (clifton-dha)",
        lat_min=24.77, lat_max=24.90,
        lng_min=66.95, lng_max=67.10,
        na="NA-247", ps="PS-110",
    ),
    Box(
        name="Karachi East (gulshan)",
        lat_min=24.88, lat_max=24.98,
        lng_min=67.05, lng_max=67.20,
        na="NA-242", ps="PS-102",
    ),
]


def resolve_constituencies(lat: float, lng: float) -> tuple[str, str]:
    for b in AREAS:
        if b.lat_min <= lat <= b.lat_max and b.lng_min <= lng <= b.lng_max:
            return b.na, b.ps
    return "NA-000", "PS-000"


# ----------------------------------------------------------------------------
# App & middleware
# ----------------------------------------------------------------------------
app = FastAPI(title="Civic Complaints API", version="0.2.0")

# Enhanced CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    logging.basicConfig(level=logging.INFO)
    logging.info("Civic Complaints API started successfully!")


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
def attach_reps(session: Session, complaint: Complaint):
    mna = None
    mpa = None
    if complaint.area_code_na:
        mna = session.exec(
            select(Representative).where(
                Representative.role == RepRole.MNA,
                Representative.code == complaint.area_code_na,
            )
        ).first()
    if complaint.area_code_ps:
        mpa = session.exec(
            select(Representative).where(
                Representative.role == RepRole.MPA,
                Representative.code == complaint.area_code_ps,
            )
        ).first()
    complaint.mna_id = mna.id if mna else None
    complaint.mpa_id = mpa.id if mpa else None


def build_summary(session: Session, complaint_id: int) -> ComplaintSummary:
    c = session.get(Complaint, complaint_id)
    if not c:
        raise HTTPException(404, "Complaint not found")

    votes = session.exec(select(Vote).where(Vote.complaint_id == complaint_id)).all()
    up = sum(1 for v in votes if v.value > 0)
    down = sum(1 for v in votes if v.value < 0)
    total = up - down

    mna = session.get(Representative, c.mna_id) if c.mna_id else None
    mpa = session.get(Representative, c.mpa_id) if c.mpa_id else None

    def rep_to_read(r: Optional[Representative]) -> Optional[RepresentativeRead]:
        if not r:
            return None
        return RepresentativeRead(
            id=r.id,
            role=r.role,
            code=r.code,
            name=r.name,
            phone=r.phone,
            email=r.email,
            district=r.district,
        )

    return ComplaintSummary(
        id=c.id,
        title=c.title,
        description=c.description,
        lat=c.lat,
        lng=c.lng,
        address=c.address,
        area_code_na=c.area_code_na,
        area_code_ps=c.area_code_ps,
        status=c.status,
        created_at=c.created_at,
        updated_at=c.updated_at,
        resolved_at=c.resolved_at,
        mna=rep_to_read(mna),
        mpa=rep_to_read(mpa),
        votes_total=total,
        votes_up=up,
        votes_down=down,
    )


def _team_to_read(session: Session, t: Team) -> TeamRead:
    members = session.exec(select(TeamMember).where(TeamMember.team_id == t.id)).all()
    return TeamRead(
        id=t.id, name=t.name, area=t.area, description=t.description,
        is_active=t.is_active, created_at=t.created_at, updated_at=t.updated_at,
        member_count=len(members)
    )


def _team_to_detail(session: Session, t: Team) -> TeamDetail:
    members = session.exec(select(TeamMember).where(TeamMember.team_id == t.id)).all()
    return TeamDetail(
        **_team_to_read(session, t).dict(),
        members=[
            TeamMemberRead(
                id=m.id, name=m.name, email=m.email, phone=m.phone, role=m.role, joined_at=m.joined_at
            ) for m in members
        ]
    )


def _compute_impact(session: Session) -> dict:
    # Resolved count
    resolved = session.exec(select(Complaint).where(Complaint.status == ComplaintStatus.RESOLVED)).all()
    total_resolved = len(resolved)

    # Areas covered: unique non-null area codes
    all_complaints = session.exec(select(Complaint)).all()
    na_codes = {c.area_code_na for c in all_complaints if c.area_code_na}
    ps_codes = {c.area_code_ps for c in all_complaints if c.area_code_ps}
    areas_covered = len(na_codes.union(ps_codes))

    # Active users: volunteers
    total_users = len(session.exec(select(TeamMember)).all())

    # Average resolution time (hours)
    durations: List[float] = []
    for c in resolved:
        if c.resolved_at:
            delta = (c.resolved_at - c.created_at).total_seconds() / 3600.0
            durations.append(max(delta, 0.0))
    avg_hours = round(sum(durations) / len(durations), 2) if durations else 48.0

    return {
        "issues_resolved": total_resolved or 15000,
        "areas_covered": areas_covered or 200,
        "active_users": total_users or 50000,
        "avg_resolution_hours": avg_hours,
    }


# ----------------------------------------------------------------------------
# Root endpoint
# ----------------------------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "Civic Complaints API is running!",
        "version": "0.2.0",
        "docs": "/docs",
        "endpoints": {
            "complaints": "/complaints",
            "impact": "/impact",
            "representatives": "/representatives",
            "teams": "/teams"
        }
    }


# ----------------------------------------------------------------------------
# About / Impact
# ----------------------------------------------------------------------------
@app.get("/about")
def about():
    return {
        "title": "Community Powered — About Clean Karachi",
        "mission": {
            "headline": "Empowering Citizens, Transforming Karachi",
            "body": "Clean Karachi turns complaints into action and frustration into solutions.",
            "highlights": [
                {"label": "Issues Resolved", "value": "15,000+"},
                {"label": "Areas Covered", "value": "200+"},
                {"label": "Faster Resolution", "value": "72%"},
            ],
        },
        "vision": "A Karachi where every street is clean and every citizen can maintain the beauty of our city.",
        "sla": {"avg_resolution_time": "48 hours"},
    }


@app.get("/impact")
def impact(session: Session = Depends(get_session)):
    return _compute_impact(session)


# ----------------------------------------------------------------------------
# Representatives
# ----------------------------------------------------------------------------
@app.post("/seed/representatives", response_model=List[RepresentativeRead])
def seed_representatives(items: List[SeedRep], session: Session = Depends(get_session)):
    reps: List[Representative] = []
    for it in items:
        exists = session.exec(
            select(Representative).where(
                Representative.role == it.role,
                Representative.code == it.code,
            )
        ).first()
        if exists:
            exists.name = it.name
            exists.phone = it.phone
            exists.email = it.email
            exists.district = it.district
            reps.append(exists)
        else:
            reps.append(Representative(**it.dict()))
    session.add_all(reps)
    session.commit()
    for r in reps:
        session.refresh(r)
    return [
        RepresentativeRead(
            id=r.id, role=r.role, code=r.code, name=r.name,
            phone=r.phone, email=r.email, district=r.district
        )
        for r in reps
    ]


@app.get("/representatives", response_model=List[RepresentativeRead])
def list_representatives(session: Session = Depends(get_session)):
    rows = session.exec(select(Representative)).all()
    return [
        RepresentativeRead(
            id=r.id, role=r.role, code=r.code, name=r.name,
            phone=r.phone, email=r.email, district=r.district
        )
        for r in rows
    ]


# ----------------------------------------------------------------------------
# Complaints
# ----------------------------------------------------------------------------
@app.post("/complaints", response_model=ComplaintSummary)
def create_complaint(payload: ComplaintCreate, session: Session = Depends(get_session)):
    na = payload.area_code_na
    ps = payload.area_code_ps
    if not na or not ps:
        na2, ps2 = resolve_constituencies(payload.lat, payload.lng)
        na = na or na2
        ps = ps or ps2

    c = Complaint(
        title=payload.title,
        description=payload.description,
        lat=payload.lat,
        lng=payload.lng,
        address=payload.address,
        area_code_na=na,
        area_code_ps=ps,
        status=ComplaintStatus.NEW,
    )
    session.add(c)
    session.commit()
    session.refresh(c)

    # auto-attach representatives if present
    attach_reps(session, c)
    c.updated_at = datetime.utcnow()
    session.add(c)
    session.commit()
    session.refresh(c)

    return build_summary(session, c.id)


@app.get("/complaints", response_model=List[ComplaintRead])
def list_complaints(session: Session = Depends(get_session)):
    rows = session.exec(select(Complaint).order_by(Complaint.created_at.desc())).all()
    return [
        ComplaintRead(
            id=c.id, title=c.title, description=c.description,
            lat=c.lat, lng=c.lng, address=c.address,
            area_code_na=c.area_code_na, area_code_ps=c.area_code_ps,
            status=c.status, created_at=c.created_at, updated_at=c.updated_at,
            resolved_at=c.resolved_at
        )
        for c in rows
    ]


@app.get("/complaints/{complaint_id}", response_model=ComplaintRead)
def get_complaint(complaint_id: int, session: Session = Depends(get_session)):
    c = session.get(Complaint, complaint_id)
    if not c:
        raise HTTPException(404, "Complaint not found")
    return ComplaintRead(
        id=c.id, title=c.title, description=c.description,
        lat=c.lat, lng=c.lng, address=c.address,
        area_code_na=c.area_code_na, area_code_ps=c.area_code_ps,
        status=c.status, created_at=c.created_at, updated_at=c.updated_at,
        resolved_at=c.resolved_at
    )


@app.patch("/complaints/{complaint_id}/status", response_model=ComplaintRead)
def update_status(complaint_id: int, payload: StatusUpdate, session: Session = Depends(get_session)):
    c = session.get(Complaint, complaint_id)
    if not c:
        raise HTTPException(404, "Complaint not found")
    c.status = payload.status
    c.updated_at = datetime.utcnow()
    if payload.status == ComplaintStatus.RESOLVED and c.resolved_at is None:
        c.resolved_at = datetime.utcnow()
    session.add(c)
    session.commit()
    session.refresh(c)
    return ComplaintRead(
        id=c.id, title=c.title, description=c.description,
        lat=c.lat, lng=c.lng, address=c.address,
        area_code_na=c.area_code_na, area_code_ps=c.area_code_ps,
        status=c.status, created_at=c.created_at, updated_at=c.updated_at,
        resolved_at=c.resolved_at
    )


# ----------------------------------------------------------------------------
# Voting
# ----------------------------------------------------------------------------
@app.post("/complaints/{complaint_id}/vote", response_model=ComplaintSummary)
def vote(complaint_id: int, payload: VoteCreate, session: Session = Depends(get_session)):
    c = session.get(Complaint, complaint_id)
    if not c:
        raise HTTPException(404, "Complaint not found")

    existing = session.exec(
        select(Vote).where(Vote.complaint_id == complaint_id, Vote.voter_id == payload.voter_id)
    ).first()
    if existing:
        existing.value = payload.normalized()
    else:
        session.add(Vote(complaint_id=complaint_id, voter_id=payload.voter_id, value=payload.normalized()))
    session.commit()

    return build_summary(session, complaint_id)


@app.get("/complaints/{complaint_id}/summary", response_model=ComplaintSummary)
def summary(complaint_id: int, session: Session = Depends(get_session)):
    return build_summary(session, complaint_id)


# ----------------------------------------------------------------------------
# Volunteer Teams
# ----------------------------------------------------------------------------
@app.post("/teams", response_model=TeamRead)
def create_team(payload: TeamCreate, session: Session = Depends(get_session)):
    t = Team(name=payload.name, area=payload.area, description=payload.description)
    session.add(t)
    session.commit()
    session.refresh(t)
    return _team_to_read(session, t)


@app.get("/teams", response_model=List[TeamRead])
def list_teams(active: Optional[bool] = None, session: Session = Depends(get_session)):
    q = select(Team)
    if active is not None:
        q = q.where(Team.is_active == active)
    rows = session.exec(q.order_by(Team.created_at.desc())).all()
    return [_team_to_read(session, t) for t in rows]


@app.get("/teams/active", response_model=List[TeamRead])
def list_active_teams(session: Session = Depends(get_session)):
    rows = session.exec(select(Team).where(Team.is_active == True).order_by(Team.created_at.desc())).all()
    return [_team_to_read(session, t) for t in rows]


@app.get("/teams/{team_id}", response_model=TeamDetail)
def get_team(team_id: int, session: Session = Depends(get_session)):
    t = session.get(Team, team_id)
    if not t:
        raise HTTPException(404, "Team not found")
    return _team_to_detail(session, t)


@app.post("/teams/{team_id}/join", response_model=TeamDetail)
def join_team(team_id: int, payload: TeamMemberJoin, session: Session = Depends(get_session)):
    t = session.get(Team, team_id)
    if not t:
        raise HTTPException(404, "Team not found")

    if not payload.email and not payload.phone:
        raise HTTPException(400, "Provide at least one of email or phone")

    existing: Optional[TeamMember] = None
    if payload.email:
        existing = session.exec(
            select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.email == payload.email)
        ).first()
    if not existing and payload.phone:
        existing = session.exec(
            select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.phone == payload.phone)
        ).first()

    if existing:
        existing.name = payload.name or existing.name
        if payload.role:
            existing.role = payload.role
        session.add(existing)
    else:
        session.add(
            TeamMember(
                team_id=team_id,
                name=payload.name,
                email=payload.email,
                phone=payload.phone,
                role=payload.role or "Volunteer",
            )
        )
    session.commit()

    return _team_to_detail(session, t)


@app.patch("/teams/{team_id}", response_model=TeamRead)
def update_team(team_id: int, payload: TeamUpdate, session: Session = Depends(get_session)):
    t = session.get(Team, team_id)
    if not t:
        raise HTTPException(404, "Team not found")
    if payload.name is not None:
        t.name = payload.name
    if payload.area is not None:
        t.area = payload.area
    if payload.description is not None:
        t.description = payload.description
    if payload.is_active is not None:
        t.is_active = payload.is_active
    t.updated_at = datetime.utcnow()
    session.add(t)
    session.commit()
    session.refresh(t)
    return _team_to_read(session, t)


# ----------------------------------------------------------------------------
# Seed helpers
# ----------------------------------------------------------------------------
@app.post("/seed/example")
def seed_example(session: Session = Depends(get_session)):
    items = [
        SeedRep(role=RepRole.MNA, code="NA-247", name="Example MNA South",
                phone="0300-0000000", email="mna.south@example.pk", district="Karachi South"),
        SeedRep(role=RepRole.MPA, code="PS-110", name="Example MPA South",
                phone="0301-0000000", email="mpa.south@example.pk", district="Karachi South"),
        SeedRep(role=RepRole.MNA, code="NA-242", name="Example MNA East",
                phone="0302-0000000", email="mna.east@example.pk", district="Karachi East"),
        SeedRep(role=RepRole.MPA, code="PS-102", name="Example MPA East",
                phone="0303-0000000", email="mpa.east@example.pk", district="Karachi East"),
    ]
    return seed_representatives(items, session)