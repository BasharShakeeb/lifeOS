"""Habits router: CRUD endpoints backed by the habits service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.habit import HabitCreate, HabitOut, HabitUpdate
from app.services import habit_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/habits", tags=["habits"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[HabitOut])
def list_habits(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[HabitOut]:
    """List all habits for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return habit_service.list_habits(client, workspace_id)


@router.post("", response_model=HabitOut, status_code=status.HTTP_201_CREATED)
def create_habit(
    payload: HabitCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HabitOut:
    """Create a new habit in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return habit_service.create_habit(client, workspace_id, profile["id"], payload)


@router.get("/{habit_id}", response_model=HabitOut)
def get_habit(
    habit_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HabitOut:
    """Fetch a single habit by id."""
    return habit_service.get_habit(client, habit_id)


@router.patch("/{habit_id}", response_model=HabitOut)
def update_habit(
    habit_id: str,
    payload: HabitUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HabitOut:
    """Partially update a habit."""
    return habit_service.update_habit(client, habit_id, payload)


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete a habit."""
    habit_service.delete_habit(client, habit_id)
