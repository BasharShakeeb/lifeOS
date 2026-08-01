"""Health records router: CRUD endpoints backed by the health record service."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.schemas.health_record import HealthRecordCreate, HealthRecordOut, HealthRecordUpdate
from app.services import health_record_service
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api/health-records", tags=["health-records"])


def _resolve_workspace(client: Client, current_user: CurrentUser, workspace_id: Optional[str]) -> str:
    """Return the target workspace id, defaulting to the user's own workspace."""
    if workspace_id:
        return workspace_id
    profile = get_profile(client, current_user.user_id)
    return get_default_workspace(client, profile["id"])["id"]


@router.get("", response_model=list[HealthRecordOut])
def list_health_records(
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> list[HealthRecordOut]:
    """List all health records for the given (or default) workspace."""
    workspace_id = _resolve_workspace(client, current_user, workspaceId)
    return health_record_service.list_health_records(client, workspace_id)


@router.post("", response_model=HealthRecordOut, status_code=status.HTTP_201_CREATED)
def create_health_record(
    payload: HealthRecordCreate,
    workspaceId: Optional[str] = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HealthRecordOut:
    """Create a new health record in the given (or default) workspace."""
    profile = get_profile(client, current_user.user_id)
    workspace_id = workspaceId or get_default_workspace(client, profile["id"])["id"]
    return health_record_service.create_health_record(client, workspace_id, profile["id"], payload)


@router.get("/{health_record_id}", response_model=HealthRecordOut)
def get_health_record(
    health_record_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HealthRecordOut:
    """Fetch a single health record by id."""
    return health_record_service.get_health_record(client, health_record_id)


@router.patch("/{health_record_id}", response_model=HealthRecordOut)
def update_health_record(
    health_record_id: str,
    payload: HealthRecordUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> HealthRecordOut:
    """Partially update a health record."""
    return health_record_service.update_health_record(client, health_record_id, payload)


@router.delete("/{health_record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_health_record(
    health_record_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> None:
    """Delete a health record."""
    health_record_service.delete_health_record(client, health_record_id)
