"""Pydantic schemas for the Goal entity (camelCase to match the frontend)."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Priority = Literal["low", "medium", "high", "urgent"]
GoalType = Literal["number", "boolean", "percentage", "time", "money"]
GoalStatus = Literal["not_started", "in_progress", "achieved"]


class GoalBase(BaseModel):
    """Shared, editable goal fields."""

    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(..., min_length=1)
    description: Optional[str] = ""
    goalType: GoalType = "percentage"
    targetValue: float = 100.0
    currentValue: float = 0.0
    measurementUnit: str = "%"
    status: GoalStatus = "in_progress"
    priority: Priority = "medium"
    progress: int = Field(default=0, ge=0, le=100)
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    hubId: Optional[str] = None
    projectId: Optional[str] = None
    assignedTo: Optional[str] = None


class GoalCreate(GoalBase):
    """Payload for creating a goal."""


class GoalUpdate(BaseModel):
    """Payload for partially updating a goal (all fields optional)."""

    model_config = ConfigDict(populate_by_name=True)

    title: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    goalType: Optional[GoalType] = None
    targetValue: Optional[float] = None
    currentValue: Optional[float] = None
    measurementUnit: Optional[str] = None
    status: Optional[GoalStatus] = None
    priority: Optional[Priority] = None
    progress: Optional[int] = Field(default=None, ge=0, le=100)
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    hubId: Optional[str] = None
    projectId: Optional[str] = None
    assignedTo: Optional[str] = None


class GoalOut(GoalBase):
    """Goal representation returned to the frontend."""

    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
