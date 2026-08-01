"""Pydantic schemas for the Project entity (camelCase to match the frontend)."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Priority = Literal["low", "medium", "high", "urgent"]
ProjectStatus = Literal["planning", "in_progress", "completed", "on_hold"]


class ProjectBase(BaseModel):
    """Shared, editable project fields."""

    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(..., min_length=1)
    description: Optional[str] = ""
    hubId: Optional[str] = None
    priority: Priority = "medium"
    status: ProjectStatus = "in_progress"
    progress: int = Field(default=0, ge=0, le=100)
    color: str = "#10b981"
    icon: str = "rocket"
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    isFavorite: bool = False
    isArchived: bool = False


class ProjectCreate(ProjectBase):
    """Payload for creating a project."""


class ProjectUpdate(BaseModel):
    """Payload for partially updating a project (all fields optional)."""

    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    hubId: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[ProjectStatus] = None
    progress: Optional[int] = Field(default=None, ge=0, le=100)
    color: Optional[str] = None
    icon: Optional[str] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    isFavorite: Optional[bool] = None
    isArchived: Optional[bool] = None


class ProjectOut(ProjectBase):
    """Project representation returned to the frontend."""

    id: str
    hubName: Optional[str] = None
    tasksCount: int = 0
    completedTasksCount: int = 0
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
