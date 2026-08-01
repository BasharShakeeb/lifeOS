"""Projects router: CRUD endpoints backed by the projects service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.services import project_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[ProjectOut])
def list_projects(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[ProjectOut]:
    """List all projects for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return project_service.list_projects(client, workspace_id)


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> ProjectOut:
    """Create a new project in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return project_service.create_project(client, workspace_id, profile["id"], payload)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> ProjectOut:
    """Fetch a single project by id."""
    return project_service.get_project(client, project_id)


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    payload: ProjectUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> ProjectOut:
    """Partially update a project."""
    return project_service.update_project(client, project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete a project."""
    project_service.delete_project(client, project_id)
