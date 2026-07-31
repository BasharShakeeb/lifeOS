"""Bootstrap router: exposes the current user's profile and default workspace."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from supabase import Client

from app.core.auth import CurrentUser, get_current_user
from app.db.supabase import get_supabase
from app.services.workspace_service import get_default_workspace, get_profile

router = APIRouter(prefix="/api", tags=["bootstrap"])


class MeResponse(BaseModel):
    """Identity payload returned to the frontend on startup."""

    profileId: str
    fullName: str
    email: str
    defaultWorkspaceId: str


@router.get("/me", response_model=MeResponse)
def read_me(
    current_user: CurrentUser = Depends(get_current_user),
    client: Client = Depends(get_supabase),
) -> MeResponse:
    """Return the authenticated user's profile id and default workspace id."""
    profile = get_profile(client, current_user.user_id)
    workspace = get_default_workspace(client, profile["id"])
    return MeResponse(
        profileId=profile["id"],
        fullName=profile.get("full_name") or "",
        email=profile.get("email") or "",
        defaultWorkspaceId=workspace["id"],
    )
