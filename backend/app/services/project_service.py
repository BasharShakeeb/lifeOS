"""Project service: CRUD against the Supabase `projects` table with field mapping."""
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import HTTPException, status
from supabase import Client

from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate

PRIORITY_TO_DB = {"low": "LOW", "medium": "MEDIUM", "high": "HIGH", "urgent": "URGENT"}
PRIORITY_FROM_DB = {v: k for k, v in PRIORITY_TO_DB.items()}

STATUS_TO_DB = {
    "planning": "TODO",
    "not_started": "TODO",
    "in_progress": "IN_PROGRESS",
    "review": "REVIEW",
    "completed": "COMPLETED",
    "on_hold": "ARCHIVED",
    "paused": "ARCHIVED",
}
STATUS_FROM_DB = {
    "TODO": "planning",
    "IN_PROGRESS": "in_progress",
    "REVIEW": "in_progress",
    "COMPLETED": "completed",
    "CANCELLED": "on_hold",
    "ARCHIVED": "on_hold",
}


def _to_iso(value: Optional[str]) -> Optional[str]:
    """Normalize a frontend date/datetime string into an ISO timestamp."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value).isoformat()
    except ValueError:
        try:
            return datetime.fromisoformat(f"{value}T00:00:00").isoformat()
        except ValueError:
            return value


def _get_tasks_counts(client: Client, project_id: str) -> tuple[int, int]:
    """Return total and completed task counts for a project."""
    res = (
        client.table("tasks")
        .select("id, status")
        .eq("project_id", project_id)
        .execute()
    )
    rows = res.data or []
    total = len(rows)
    completed = sum(1 for row in rows if (row.get("status") or "TODO") == "COMPLETED")
    return total, completed


def _row_to_project(row: dict[str, Any]) -> ProjectOut:
    """Map a DB row to the frontend-facing ProjectOut model."""
    db_status = row.get("status") or "TODO"
    fe_status = STATUS_FROM_DB.get(db_status, "planning")

    hub_name = None
    hub_payload = row.get("hubs")
    if isinstance(hub_payload, dict):
        hub_name = hub_payload.get("title")
    if not hub_name:
        hub_name = row.get("hub_name")

    tasks_count, completed_tasks_count = _get_tasks_counts(row["_client"], str(row["id"])) if "_client" in row else (0, 0)

    return ProjectOut(
        id=str(row["id"]),
        name=row.get("title") or "",
        description=row.get("description") or "",
        hubId=row.get("hub_id"),
        hubName=hub_name,
        priority=PRIORITY_FROM_DB.get(row.get("priority") or "MEDIUM", "medium"),
        status=fe_status,
        progress=row.get("progress") or 0,
        color=row.get("color") or "#10b981",
        icon=row.get("icon") or "rocket",
        startDate=(row.get("start_date") or "").split("T")[0] if row.get("start_date") else None,
        dueDate=(row.get("due_date") or "").split("T")[0] if row.get("due_date") else None,
        isFavorite=bool(row.get("is_favorite") is True),
        isArchived=bool(row.get("is_archived") is True),
        tasksCount=tasks_count,
        completedTasksCount=completed_tasks_count,
        createdAt=row.get("created_at"),
        updatedAt=row.get("updated_at"),
    )


def list_projects(client: Client, workspace_id: str) -> list[ProjectOut]:
    """Return all projects for a workspace, newest first."""
    res = (
        client.table("projects")
        .select("*, hubs(title)")
        .eq("workspace_id", workspace_id)
        .order("created_at", desc=True)
        .execute()
    )
    projects = []
    for row in res.data or []:
        result = dict(row)
        result["_client"] = client
        projects.append(_row_to_project(result))
    return projects


def create_project(
    client: Client, workspace_id: str, profile_id: str, payload: ProjectCreate
) -> ProjectOut:
    """Insert a new project and return its mapped representation."""
    insert_data = {
        "workspace_id": workspace_id,
        "hub_id": payload.hubId or None,
        "owner_id": profile_id,
        "title": payload.name,
        "description": payload.description or None,
        "status": STATUS_TO_DB.get(payload.status, "IN_PROGRESS"),
        "priority": PRIORITY_TO_DB.get(payload.priority, "MEDIUM"),
        "progress": payload.progress,
        "color": payload.color,
        "icon": payload.icon,
        "start_date": _to_iso(payload.startDate),
        "due_date": _to_iso(payload.dueDate),
        "is_favorite": payload.isFavorite,
        "is_archived": payload.isArchived,
    }
    res = client.table("projects").insert(insert_data).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create project",
        )
    return _row_to_project({**res.data[0], "_client": client})


def get_project(client: Client, project_id: str) -> ProjectOut:
    """Fetch a single project by id."""
    res = (
        client.table("projects")
        .select("*, hubs(title)")
        .eq("id", project_id)
        .limit(1)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    return _row_to_project({**res.data[0], "_client": client})


def update_project(client: Client, project_id: str, payload: ProjectUpdate) -> ProjectOut:
    """Apply a partial update to a project."""
    update_data: dict[str, Any] = {}
    if payload.name is not None:
        update_data["title"] = payload.name
    if payload.description is not None:
        update_data["description"] = payload.description or None
    if payload.hubId is not None:
        update_data["hub_id"] = payload.hubId or None
    if payload.priority is not None:
        update_data["priority"] = PRIORITY_TO_DB.get(payload.priority, "MEDIUM")
    if payload.status is not None:
        update_data["status"] = STATUS_TO_DB.get(payload.status, "IN_PROGRESS")
    if payload.progress is not None:
        update_data["progress"] = payload.progress
    if payload.color is not None:
        update_data["color"] = payload.color
    if payload.icon is not None:
        update_data["icon"] = payload.icon
    if payload.startDate is not None:
        update_data["start_date"] = _to_iso(payload.startDate)
    if payload.dueDate is not None:
        update_data["due_date"] = _to_iso(payload.dueDate)
    if payload.isFavorite is not None:
        update_data["is_favorite"] = payload.isFavorite
    if payload.isArchived is not None:
        update_data["is_archived"] = payload.isArchived

    if not update_data:
        return get_project(client, project_id)

    res = client.table("projects").update(update_data).eq("id", project_id).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    return _row_to_project({**res.data[0], "_client": client})


def delete_project(client: Client, project_id: str) -> None:
    """Delete a project by id."""
    client.table("projects").delete().eq("id", project_id).execute()
