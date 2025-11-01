from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Enum as SQLAEnum
from sqlalchemy.sql import func
from .database import Base
import uuid
from enum import Enum

def gen_uuid():
    return str(uuid.uuid4())

class UrgencyLevel(str, Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"
    Critical = "Critical"

class ReportStatus(str, Enum):
    Submitted = "Submitted"
    InProgress = "In Progress"
    Resolved = "Resolved"

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=gen_uuid)
    station_name = Column(String, nullable=False, index=True)
    station_city = Column(String, nullable=False, index=True)
    issue_category = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    photo_url = Column(String, nullable=True)
    urgency_level = Column(SQLAEnum(UrgencyLevel), nullable=False, default=UrgencyLevel.Medium)
    status = Column(SQLAEnum(ReportStatus), nullable=False, default=ReportStatus.Submitted)
    inspector_notes = Column(Text, nullable=True)
    reporter_contact = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_date = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_by = Column(String, nullable=True)
    ai_analysis = Column(Text, nullable=True)
