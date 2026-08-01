"""Hubs router: CRUD endpoints backed by the hubs service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.hub import HubCreate, HubOut, HubUpdate
from app.services import hub_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/hubs", tags=["hubs"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[HubOut])
def list_hubs(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[HubOut]:
    """List all hubs for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return hub_service.list_hubs(client, workspace_id)


@router.post("", response_model=HubOut, status_code=status.HTTP_201_CREATED)
def create_hub(
    payload: HubCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HubOut:
    """Create a new hub in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return hub_service.create_hub(client, workspace_id, profile["id"], payload)


@router.get("/{hub_id}", response_model=HubOut)
def get_hub(
    hub_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HubOut:
    """Fetch a single hub by id."""
    return hub_service.get_hub(client, hub_id)


@router.patch("/{hub_id}", response_model=HubOut)
def update_hub(
    hub_id: str,
    payload: HubUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HubOut:
    """Partially update a hub."""
    return hub_service.update_hub(client, hub_id, payload)


@router.delete("/{hub_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hub(
    hub_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete a hub."""
    hub_service.delete_hub(client, hub_id)
