"""Hub service: CRUD against the Supabase `hubs` table with field mapping."""
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.hub import HubCreate, HubOut, HubUpdate


def _row_to_hub(row: dict[str, Any]) -> HubOut:
    """Map a DB row to the frontend-facing HubOut model."""
    return HubOut(
        id=str(row["id"]),
        name=row.get("title") or "",
        description=row.get("description") or "",
        color=row.get("color") or "#006c49",
        icon=row.get("icon") or "grid_view",
        coverImage=row.get("cover_image"),
        sortOrder=row.get("sort_order") or 0,
        isArchived=bool(row.get("is_archived") is True),
        createdAt=row.get("created_at"),
        updatedAt=row.get("updated_at"),
    )


def list_hubs(client: Client, workspace_id: str) -> list[HubOut]:
    """Return all hubs for a workspace, ordered by sort order."""
    res = (
        client.table("hubs")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("sort_order", desc=False)
        .execute()
    )
    return [_row_to_hub(row) for row in (res.data or [])]


def create_hub(
    client: Client, workspace_id: str, profile_id: str, payload: HubCreate
) -> HubOut:
    """Insert a new hub and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "title": payload.name,
        "description": payload.description or None,
        "color": payload.color,
        "icon": payload.icon,
        "cover_image": payload.coverImage or None,
        "sort_order": payload.sortOrder,
        "is_archived": payload.isArchived,
        "created_by": profile_id,
    }
    res = client.table("hubs").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create hub",
        )
    return _row_to_hub(res.data[0])


def get_hub(client: Client, hub_id: str) -> HubOut:
    """Fetch a single hub by id."""
    res = client.table("hubs").select("*").eq("id", hub_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hub not found",
        )
    return _row_to_hub(res.data[0])


def update_hub(client: Client, hub_id: str, payload: HubUpdate) -> HubOut:
    """Apply a partial update to a hub."""
    update_data: dict[str, Any] = {}
    if payload.name is not None:
        update_data["title"] = payload.name
    if payload.description is not None:
        update_data["description"] = payload.description or None
    if payload.color is not None:
        update_data["color"] = payload.color
    if payload.icon is not None:
        update_data["icon"] = payload.icon
    if payload.coverImage is not None:
        update_data["cover_image"] = payload.coverImage or None
    if payload.sortOrder is not None:
        update_data["sort_order"] = payload.sortOrder
    if payload.isArchived is not None:
        update_data["is_archived"] = payload.isArchived

    if not update_data:
        return get_hub(client, hub_id)

    res = client.table("hubs").update(update_data).eq("id", hub_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hub not found",
        )
    return _row_to_hub(res.data[0])


def delete_hub(client: Client, hub_id: str) -> None:
    """Delete a hub by id."""
    client.table("hubs").delete().eq("id", hub_id).execute()
