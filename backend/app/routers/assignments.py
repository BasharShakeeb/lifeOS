"""Assignments router: CRUD endpoints backed by the assignments service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.assignment import AssignmentCreate, AssignmentOut, AssignmentUpdate
from app.services import assignment_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/assignments", tags=["assignments"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[AssignmentOut])
def list_assignments(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[AssignmentOut]:
    """List all assignments for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return assignment_service.list_assignments(client, workspace_id)


@router.post("", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(
    payload: AssignmentCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> AssignmentOut:
    """Create a new assignment in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return assignment_service.create_assignment(client, workspace_id, profile["id"], payload)


@router.get("/{assignment_id}", response_model=AssignmentOut)
def get_assignment(
    assignment_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> AssignmentOut:
    """Fetch a single assignment by id."""
    return assignment_service.get_assignment(client, assignment_id)


@router.patch("/{assignment_id}", response_model=AssignmentOut)
def update_assignment(
    assignment_id: str,
    payload: AssignmentUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> AssignmentOut:
    """Partially update an assignment."""
    return assignment_service.update_assignment(client, assignment_id, payload)


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    assignment_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete an assignment."""
    assignment_service.delete_assignment(client, assignment_id)
