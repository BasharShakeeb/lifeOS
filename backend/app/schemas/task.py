"""Pydantic schemas for the Task entity (camelCase to match the frontend)."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Priority = Literal["low", "medium", "high", "urgent"]
TaskStatus = Literal["not_started", "in_progress", "completed", "paused", "overdue"]


class TaskBase(BaseModel):
    """Shared, editable task fields."""

    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(..., min_length=1)
    description: Optional[str] = ""
    dueDate: Optional[str] = None
    priority: Priority = "medium"
    status: TaskStatus = "not_started"
    projectId: Optional[str] = None
    hubId: Optional[str] = None


class TaskCreate(TaskBase):
    """Payload for creating a task."""


class TaskUpdate(BaseModel):
    """Payload for partially updating a task (all fields optional)."""

    model_config = ConfigDict(populate_by_name=True)

    title: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    dueDate: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[TaskStatus] = None
    projectId: Optional[str] = None
    hubId: Optional[str] = None


class TaskOut(TaskBase):
    """Task representation returned to the frontend."""

    id: str
    tags: list[str] = []
    subtasks: list[dict] = []
    createdAt: Optional[str] = None
