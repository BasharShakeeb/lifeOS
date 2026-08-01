"""Pydantic schemas for the Assignment entity (camelCase to match the frontend)."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Priority = Literal["low", "medium", "high", "urgent"]
AssignmentStatus = Literal["pending", "in_progress", "submitted", "graded"]


class AssignmentBase(BaseModel):
    """Shared, editable assignment fields."""

    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(..., min_length=1)
    course: Optional[str] = None
    subject: Optional[str] = None
    teacher: Optional[str] = None
    description: Optional[str] = ""
    status: AssignmentStatus = "pending"
    priority: Priority = "medium"
    progress: int = Field(default=0, ge=0, le=100)
    submissionUrl: Optional[str] = None
    grade: Optional[str] = None
    semester: Optional[str] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    hubId: Optional[str] = None
    projectId: Optional[str] = None
    assignedTo: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    """Payload for creating an assignment."""


class AssignmentUpdate(BaseModel):
    """Payload for partially updating an assignment (all fields optional)."""

    model_config = ConfigDict(populate_by_name=True)

    title: Optional[str] = Field(default=None, min_length=1)
    course: Optional[str] = None
    subject: Optional[str] = None
    teacher: Optional[str] = None
    description: Optional[str] = None
    status: Optional[AssignmentStatus] = None
    priority: Optional[Priority] = None
    progress: Optional[int] = Field(default=None, ge=0, le=100)
    submissionUrl: Optional[str] = None
    grade: Optional[str] = None
    semester: Optional[str] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    hubId: Optional[str] = None
    projectId: Optional[str] = None
    assignedTo: Optional[str] = None


class AssignmentOut(AssignmentBase):
    """Assignment representation returned to the frontend."""

    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
