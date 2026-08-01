"""Pydantic schemas for the HealthRecord entity (camelCase to match the frontend)."""
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class HealthRecordBase(BaseModel):
    """Shared, editable health record fields."""

    model_config = ConfigDict(populate_by_name=True)

    date: str = Field(..., min_length=1)
    waterIntakeMl: int = Field(default=0, ge=0)
    sleepHours: float = Field(default=0.0, ge=0)
    exerciseMinutes: int = Field(default=0, ge=0)
    weightKg: Optional[float] = Field(default=None, ge=0)
    bloodPressure: Optional[str] = None
    caloriesBurned: Optional[int] = Field(default=None, ge=0)
    notes: Optional[str] = None


class HealthRecordCreate(HealthRecordBase):
    """Payload for creating a health record."""


class HealthRecordUpdate(BaseModel):
    """Payload for partially updating a health record."""

    model_config = ConfigDict(populate_by_name=True)

    date: Optional[str] = Field(default=None, min_length=1)
    waterIntakeMl: Optional[int] = Field(default=None, ge=0)
    sleepHours: Optional[float] = Field(default=None, ge=0)
    exerciseMinutes: Optional[int] = Field(default=None, ge=0)
    weightKg: Optional[float] = Field(default=None, ge=0)
    bloodPressure: Optional[str] = None
    caloriesBurned: Optional[int] = Field(default=None, ge=0)
    notes: Optional[str] = None


class HealthRecordOut(HealthRecordBase):
    """Health record representation returned to the frontend."""

    id: str
    createdAt: Optional[str] = None
