"""Pydantic schemas for the Habit entity (camelCase to match the frontend)."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Frequency = Literal["daily", "weekly", "monthly", "yearly", "custom", "none"]
HabitStatus = Literal["not_started", "in_progress", "completed", "paused"]


class HabitBase(BaseModel):
    """Shared, editable habit fields."""

    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(..., min_length=1)
    description: Optional[str] = ""
    frequency: Frequency = "daily"
    targetPerDay: int = Field(default=1, ge=0)
    targetPerWeek: int = Field(default=7, ge=0)
    currentStreak: int = Field(default=0, ge=0)
    bestStreak: int = Field(default=0, ge=0)
    lastCompleted: Optional[str] = None
    status: HabitStatus = "in_progress"
    color: str = "#10b981"
    icon: str = "flame"
    hubId: Optional[str] = None


class HabitCreate(HabitBase):
    """Payload for creating a habit."""


class HabitUpdate(BaseModel):
    """Payload for partially updating a habit (all fields optional)."""

    model_config = ConfigDict(populate_by_name=True)

    title: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    frequency: Optional[Frequency] = None
    targetPerDay: Optional[int] = Field(default=None, ge=0)
    targetPerWeek: Optional[int] = Field(default=None, ge=0)
    currentStreak: Optional[int] = Field(default=None, ge=0)
    bestStreak: Optional[int] = Field(default=None, ge=0)
    lastCompleted: Optional[str] = None
    status: Optional[HabitStatus] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    hubId: Optional[str] = None


class HabitOut(HabitBase):
    """Habit representation returned to the frontend."""

    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
