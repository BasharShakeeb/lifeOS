"""Goals router: CRUD endpoints backed by the goals service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.goal import GoalCreate, GoalOut, GoalUpdate
from app.services import goal_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/goals", tags=["goals"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[GoalOut])
def list_goals(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[GoalOut]:
    """List all goals for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return goal_service.list_goals(client, workspace_id)


@router.post("", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> GoalOut:
    """Create a new goal in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return goal_service.create_goal(client, workspace_id, profile["id"], payload)


@router.get("/{goal_id}", response_model=GoalOut)
def get_goal(
    goal_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> GoalOut:
    """Fetch a single goal by id."""
    return goal_service.get_goal(client, goal_id)


@router.patch("/{goal_id}", response_model=GoalOut)
def update_goal(
    goal_id: str,
    payload: GoalUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> GoalOut:
    """Partially update a goal."""
    return goal_service.update_goal(client, goal_id, payload)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete a goal."""
    goal_service.delete_goal(client, goal_id)
