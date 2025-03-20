import json
from sqlalchemy import Column, ForeignKey, Integer, PrimaryKeyConstraint, String, Boolean, DateTime, Date, create_engine, select
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from sqlalchemy.pool import QueuePool
import random

from passwordUtil import hash_password

DATABASE_URL = "sqlite:///./sqlite.db"  # Replace with your DB URL
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    user_email = Column(String)
    user_company = Column(String)
    user_role = Column(String)
    user_company_sector = Column(String)
    user_problem = Column(String)
    user_problem = Column(String)
    user_profile = Column(String)



class InnovationAreas(Base):
    __tablename__ = "innovation_areas"
    innovation_area_id = Column(Integer, primary_key=True, index=True)
    innovation_area_name = Column(String)

class Experts(Base):
    __tablename__ = "experts"
    expert_id = Column(Integer, primary_key=True, index=True)
    expert_name = Column(String)
    expert_description = Column(String)
    expert_institution = Column(String)
    expert_email = Column(String)
    expert_website = Column(String)

class IdentifiedArea(Base):
    __tablename__ = "identified_areas"
    areas_id = Column(Integer, ForeignKey('innovation_areas.innovation_area_id'))
    user_id = Column(Integer, ForeignKey('users.user_id'))
    # set primary key
    __table_args__ = (
        PrimaryKeyConstraint('areas_id', 'user_id'),
    )

class ExpertAreas(Base):
    __tablename__ = "expert_areas"
    expert_id = Column(Integer, ForeignKey('experts.expert_id'), primary_key=True)
    area_id = Column(Integer, ForeignKey('innovation_areas.innovation_area_id'), primary_key=True)
    __table_args__ = (PrimaryKeyConstraint('expert_id', 'area_id'),)


def create_user(db: Session, username: str, password: str, email: str = "", company: str = "", role: str = "", company_sector: str = "", problem: str = "", profile: str = ""):
    hashed_password = hash_password(password)  # Hash the password
    db_user = User(
        username=username,
        hashed_password=hashed_password,
        user_email=email,
        user_company=company,
        user_role=role,
        user_company_sector=company_sector,
        user_problem=problem,
        user_profile=profile
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_areas(db: Session, user_id: int):
    areas = db.query(InnovationAreas).join(IdentifiedArea).filter(IdentifiedArea.user_id == user_id).all()
    return areas

def get_experts(db: Session, area_id: int):
    experts = db.query(Experts).filter(Experts.expert_category == area_id).all()
    return experts

def get_experts_by_user(db: Session, user_id: int):
    areas = get_areas(db, user_id)
    experts = []
    for area in areas:
        experts += get_experts(db, area.innovation_area_id)
    return experts

engine = create_engine(
    DATABASE_URL,
    pool_size=10,  # Increase the pool size
    max_overflow=20,  # Increase the overflow size
    pool_timeout=30,  # Increase the timeout period
    poolclass=QueuePool
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    # delete_schedule(SessionLocal(), 474313)
    # add_dummy_data(SessionLocal())
    # schedule_project(SessionLocal(), 1)
    pass