"""Tasks router: CRUD endpoints backed by the tasks service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate
from app.services import task_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[TaskOut])
def list_tasks(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[TaskOut]:
    """List all tasks for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return task_service.list_tasks(client, workspace_id)


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> TaskOut:
    """Create a new task in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return task_service.create_task(client, workspace_id, profile["id"], payload)


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    payload: TaskUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> TaskOut:
    """Partially update a task."""
    return task_service.update_task(client, task_id, payload)


@router.patch("/{task_id}/toggle", response_model=TaskOut)
def toggle_task(
    task_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> TaskOut:
    """Toggle a task between completed and not-completed."""
    return task_service.toggle_task(client, task_id)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete a task."""
    task_service.delete_task(client, task_id)
