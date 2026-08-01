"""Pydantic schemas for the Hub entity (camelCase to match the frontend)."""
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class HubBase(BaseModel):
    """Shared, editable hub fields."""

    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(..., min_length=1)
    description: Optional[str] = ""
    color: str = "#006c49"
    icon: str = "grid_view"
    coverImage: Optional[str] = None
    sortOrder: int = 0
    isArchived: bool = False


class HubCreate(HubBase):
    """Payload for creating a hub."""


class HubUpdate(BaseModel):
    """Payload for partially updating a hub (all fields optional)."""

    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    coverImage: Optional[str] = None
    sortOrder: Optional[int] = None
    isArchived: Optional[bool] = None


class HubOut(HubBase):
    """Hub representation returned to the frontend."""

    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
